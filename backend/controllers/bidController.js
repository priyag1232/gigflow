const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

exports.createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;
    if (!gigId || !price) return res.status(400).json({ message: 'Missing fields' });
    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== 'open') return res.status(400).json({ message: 'Gig not available for bidding' });
    const bid = new Bid({ gigId, freelancerId: req.user._id, message, price });
    await bid.save();
    // notify gig owner about new bid
    try {
      const io = req.app.get('io');
      if (io && gig.ownerId) {
        // populate minimal freelancer info
        await bid.populate('freelancerId', 'name email');
        io.to(gig.ownerId.toString()).emit('bid:created', { bid });
      }
    } catch (e) { console.error('Emit error', e); }
    res.status(201).json(bid);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You have already bid on this gig' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    const bids = await Bid.find({ gigId }).populate('freelancerId', 'name email').sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id }).populate('gigId', 'title ownerId').sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Atomic hire endpoint
exports.hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { bidId } = req.params;
    session.startTransaction();

    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Only owner can hire
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Prevent hiring when already assigned
    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Gig already assigned' });
    }

    // Update gig status
    gig.status = 'assigned';
    await gig.save({ session });

    // Set selected bid to hired
    bid.status = 'hired';
    await bid.save({ session });

    // Reject other bids
    await Bid.updateMany({ gigId: gig._id, _id: { $ne: bid._id } }, { $set: { status: 'rejected' } }, { session });

    await session.commitTransaction();

    // Emit socket notification (if socket server attached)
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(bid.freelancerId.toString()).emit('notification', { message: `You have been hired for ${gig.title}!`, gigId: gig._id });
        // also broadcast gig update so feeds can refresh
        io.emit('gig:updated', { gigId: gig._id, status: gig.status });
      }
    } catch (emitErr) {
      console.error('Emit error', emitErr);
    }

    res.json({ message: 'Hired successfully' });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    session.endSession();
  }
};

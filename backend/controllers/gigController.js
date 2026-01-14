const Gig = require('../models/Gig');

exports.createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    if (!title || !description || !budget) return res.status(400).json({ message: 'Missing fields' });
    const gig = await Gig.create({ title, description, budget, ownerId: req.user._id });
    // emit real-time event for new gig
    try {
      const io = req.app.get('io');
      if (io) io.emit('gig:created', gig);
    } catch (e) { console.error('Socket emit error', e); }
    res.status(201).json(gig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGigs = async (req, res) => {
  try {
    let { search } = req.query;
    const q = { status: 'open' };
    let gigs = [];

    if (search && String(search).trim().length > 0) {
      search = String(search).trim();
      // primary: text search (fast when index exists)
      gigs = await Gig.find({ $text: { $search: search }, status: 'open' }).populate('ownerId', 'name email');

      // fallback: if text search returned nothing, try a case-insensitive partial match
      if ((!gigs || gigs.length === 0)) {
        const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const re = new RegExp(esc(search), 'i')
        gigs = await Gig.find({ status: 'open', $or: [{ title: re }, { description: re }] }).sort({ createdAt: -1 }).populate('ownerId', 'name email')
      }
    } else {
      gigs = await Gig.find(q).sort({ createdAt: -1 }).populate('ownerId', 'name email');
    }

    return res.json(gigs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGigById = async (req, res) => {
  try {
    const { id } = req.params;
    const gig = await Gig.findById(id).populate('ownerId', 'name email');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

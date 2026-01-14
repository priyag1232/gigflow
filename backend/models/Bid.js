const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true, index: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  message: { type: String },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'hired', 'rejected'], default: 'pending' },
}, { timestamps: true });

// Ensure one bid per freelancer per gig
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);

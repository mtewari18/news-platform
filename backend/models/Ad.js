const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, enum: ['top','sidebar','footer'], default: 'sidebar' },
  html: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);

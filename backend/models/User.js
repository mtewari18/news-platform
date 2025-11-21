const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','editor','admin'], default: 'user' },
  verified: { type: Boolean, default: false },
  verifyToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

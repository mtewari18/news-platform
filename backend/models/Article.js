const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: { type: String },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  publishedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);

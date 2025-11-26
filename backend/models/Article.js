const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  image: { type: String },
  tags: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  views: { type: Number, default: 0 },

  publishedAt: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);

const Article = require('../models/Article');
const User = require('../models/User');

exports.stats = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  const totalArticles = await Article.countDocuments();
  const pending = await Article.countDocuments({ status: 'pending' });
  const approved = await Article.countDocuments({ status: 'approved' });
  const usersCount = await User.countDocuments();
  const recentArticles = await Article.find().sort({ createdAt:-1 }).limit(10).populate('author','name');
  res.json({ totalArticles, pending, approved, usersCount, recentArticles });
};

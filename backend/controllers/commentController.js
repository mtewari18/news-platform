const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { articleId } = req.params;
    if (!content) return res.status(400).json({ message:'Missing content' });
    const comment = await Comment.create({ content, article: articleId, author: req.user.id });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId }).populate('author','name').sort({ createdAt:-1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

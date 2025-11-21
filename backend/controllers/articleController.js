const Article = require('../models/Article');
const slugify = require('slugify');
const Category = require('../models/Category');
const { sendEmail } = require('../utils/email');

exports.listArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'approved' })
      .sort({ publishedAt: -1 })
      .populate('author', 'name')
      .populate('category', 'name slug');
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, status: 'approved' }).populate('author', 'name email').populate('category','name slug');
    if (!article) return res.status(404).json({ message:'Article not found' });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, summary, content, tags = [], category } = req.body;
    if (!title || !content) return res.status(400).json({ message:'Missing fields' });
    const slug = slugify(title, { lower:true, strict:true }) + '-' + Date.now().toString().slice(-4);
    let catId = null;
    if (category) {
      const cat = await Category.findOne({ $or: [{ _id: category }, { slug: category }] });
      if (cat) catId = cat._id;
    }
    const article = await Article.create({
      title, summary, content, slug, tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t=>t.trim()).filter(Boolean) : []),
      author: req.user.id, category: catId, status: 'pending', image: req.file ? `/uploads/${req.file.filename}` : null
    });
    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

exports.pendingList = async (req, res) => {
  try {
    const pending = await Article.find({ status: 'pending' }).populate('author','name email').sort({ createdAt:-1 });
    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

exports.approveArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author','name email');
    if (!article) return res.status(404).json({ message:'Not found' });
    article.status = 'approved';
    article.publishedAt = new Date();
    await article.save();
    try {
      await sendEmail(article.author.email, 'Your article was approved', `<p>Hi ${article.author.name},</p><p>Your article "<strong>${article.title}</strong>" was approved.</p><p><a href="${process.env.FRONTEND_BASE}/article/${article.slug}">View article</a></p>`);
    } catch(e) { console.error('Email failed', e); }
    res.json({ message:'Article approved', article });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

exports.rejectArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message:'Not found' });
    article.status = 'rejected';
    await article.save();
    res.json({ message:'Article rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

exports.listByCategory = async (req, res) => {
  try {
    const CategoryModel = require('../models/Category');
    const cat = await CategoryModel.findOne({ slug: req.params.slug });
    if (!cat) return res.status(404).json({ message:'Category not found' });
    const articles = await Article.find({ status:'approved', category: cat._id }).populate('author','name');
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

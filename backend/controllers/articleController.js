const Article = require("../models/Article");
const Category = require("../models/Category");
const User = require("../models/User");
const slugify = require("slugify");
const { sendHTML } = require("../utils/sendEmail");

// -------------------------------
// CREATE ARTICLE
// -------------------------------
exports.createArticle = async (req, res) => {
  try {
    const { title, summary, content, tags = [], category } = req.body;

    const slug = slugify(title, { lower: true }) + "-" + Date.now();

    const cat = await Category.findOne({ $or: [{ _id: category }, { slug: category }] });

    const article = await Article.create({
      title,
      summary,
      content,
      slug,
      author: req.user.id,
      category: cat?._id || null,
      tags,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      status: req.user.role === "admin" || req.user.role === "editor" ? "approved" : "pending",
      publishedAt: req.user.role !== "user" ? new Date() : null,
    });

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------
// GET ALL APPROVED ARTICLES + SEARCH + PAGINATION
// -------------------------------
exports.getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, q } = req.query;

    const filter = { status: "approved" };

    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { summary: new RegExp(q, "i") },
        { tags: { $in: [new RegExp(q, "i")] } },
      ];
    }

    const articles = await Article.find(filter)
      .populate("author", "name")
      .populate("category", "name slug")
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Article.countDocuments(filter);

    res.json({ articles, total, page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------
// GET SINGLE ARTICLE BY SLUG + INCREASE VIEW COUNT
// -------------------------------
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate("author", "name email")
      .populate("category", "name slug");

    if (!article) return res.status(404).json({ message: "Article not found" });

    // increase view count
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------
// UPDATE ARTICLE
// -------------------------------
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ message: "Not found" });

    // auth check
    if (article.author.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    const { title, summary, content, tags, category } = req.body;

    if (title) article.title = title;
    if (summary) article.summary = summary;
    if (content) article.content = content;
    if (tags) article.tags = tags;
    if (category) {
      const cat = await Category.findOne({ slug: category });
      article.category = cat?._id;
    }
    if (req.file) article.image = `/uploads/${req.file.filename}`;

    await article.save();

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------
// DELETE ARTICLE
// -------------------------------
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ message: "Not found" });

    if (article.author.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    await article.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------
// APPROVE ARTICLE (Admin)
// -------------------------------
exports.approveArticle = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    const article = await Article.findById(req.params.id).populate("author");

    if (!article) return res.status(404).json({ message: "Not found" });

    article.status = "approved";
    article.publishedAt = new Date();
    await article.save();

    // Send email to author
    await sendHTML(
      article.author.email,
      "Your article is Approved",
      "articleApproved.html",
      {
        name: article.author.name,
        title: article.title,
        articleUrl: `${process.env.FRONTEND_BASE}/article/${article.slug}`,
        year: new Date().getFullYear(),
      }
    );

    res.json({ message: "Approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------
// TRENDING ARTICLES
// -------------------------------
exports.getTrending = async (req, res) => {
  const articles = await Article.find({ status: "approved" })
    .sort({ views: -1 })
    .limit(10);
  res.json(articles);
};

// -------------------------------
// RELATED ARTICLES
// -------------------------------
exports.getRelated = async (req, res) => {
  const base = await Article.findById(req.params.id);
  if (!base) return res.status(404).json({ message: "Not found" });

  const related = await Article.find({
    _id: { $ne: base._id },
    category: base.category,
    status: "approved",
  })
    .limit(10)
    .sort({ createdAt: -1 });

  res.json(related);
};

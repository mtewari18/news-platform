const Category = require('../models/Category');

exports.list = async (req, res) => {
  const cats = await Category.find().sort({ name: 1 });
  res.json(cats);
};

exports.create = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  const { name, slug } = req.body;
  if (!name || !slug) return res.status(400).json({ message:'Missing fields' });
  const cat = await Category.create({ name, slug });
  res.status(201).json(cat);
};

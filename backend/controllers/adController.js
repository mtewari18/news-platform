const Ad = require('../models/Ad');

exports.list = async (req, res) => {
  const ads = await Ad.find({ active: true }).sort({ position: 1 });
  res.json(ads);
};

exports.create = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  const ad = await Ad.create(req.body);
  res.status(201).json(ad);
};

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  listArticles, getArticle, createArticle, pendingList, approveArticle, rejectArticle, listByCategory
} = require('../controllers/articleController');

router.get('/', listArticles);
router.get('/pending', auth, async (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  next();
}, pendingList);
router.get('/category/:slug', listByCategory);

router.get('/:slug', getArticle);

router.post('/', auth, upload.single('image'), createArticle);

router.put('/:id/approve', auth, async (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  next();
}, approveArticle);

router.put('/:id/reject', auth, async (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  next();
}, rejectArticle);

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addComment, getComments } = require('../controllers/commentController');

router.get('/:articleId', getComments);
router.post('/:articleId', auth, addComment);

module.exports = router;

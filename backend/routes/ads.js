const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { list, create } = require('../controllers/adController');

router.get('/', list);
router.post('/', auth, create);

module.exports = router;

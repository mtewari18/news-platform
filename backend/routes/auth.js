const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, requestPasswordReset, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/request-reset', requestPasswordReset);
router.post('/reset/:token', resetPassword);

module.exports = router;

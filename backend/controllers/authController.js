const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');

const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:5173';
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({ message:'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message:'Email already registered' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const verifyToken = crypto.randomBytes(20).toString('hex');
    const user = await User.create({ name, email, passwordHash, verifyToken });
    const verifyUrl = `${FRONTEND_BASE}/verify-email/${verifyToken}`;
    await sendEmail(user.email, 'Verify your account', `<p>Hi ${user.name},</p><p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`);
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, verified: user.verified, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message:'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message:'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message:'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, verified: user.verified, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verifyToken: token });
    if (!user) return res.status(400).json({ message:'Invalid token' });
    user.verified = true;
    user.verifyToken = undefined;
    await user.save();
    res.json({ message:'Verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
}

async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ message:'If that email exists you will receive reset instructions' });
    const token = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600000;
    await user.save();
    const resetUrl = `${FRONTEND_BASE}/reset-password/${token}`;
    await sendEmail(user.email, 'Password reset', `<p>Reset link: <a href="${resetUrl}">${resetUrl}</a></p>`);
    res.json({ message:'If that email exists you will receive reset instructions' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
}

async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message:'Invalid or expired token' });
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({ message:'Password reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
}

module.exports = { register, login, verifyEmail, requestPasswordReset, resetPassword };

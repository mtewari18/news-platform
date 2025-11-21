const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = { id: user._id, email: user.email, role: user.role, name: user.name, verified: user.verified };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;

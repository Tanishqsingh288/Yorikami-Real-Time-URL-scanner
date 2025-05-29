// middleware/verifySession.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifySession = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const sessionId = req.headers['x-session-id'];

  if (!token || !sessionId) {
    return res.status(401).json({ error: 'Token and session ID required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.sessionId !== sessionId) {
      return res.status(401).json({ error: 'Invalid session. Please log in again.' });
    }

    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
};

module.exports = verifySession;

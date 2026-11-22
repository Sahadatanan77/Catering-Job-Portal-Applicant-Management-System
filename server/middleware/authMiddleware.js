const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    // Allow token via query parameter for direct browser downloads/previews
    token = req.query.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_catering_job_portal_jwt_token_key_2026'
      );

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.',
        });
      }

      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token.',
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Not authorized, no authentication token provided.',
  });
};

module.exports = { protect };

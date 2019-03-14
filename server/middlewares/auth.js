const jwt = require('jsonwebtoken');
const { secret } = require('../db/credentials');

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-auth'];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'not logged in',
    });
  }

  try {
    jwt.verify(token, secret);
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      success: false,
      message: 'verification failed',
    });
  }

  next();
};

module.exports = authMiddleware;

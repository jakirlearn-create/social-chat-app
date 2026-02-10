const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.userId: Quick access to user ID (string)
    req.userId = decoded.userId;
    // req.user: Full decoded token object containing {userId, email, role, iat, exp}
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Alias for compatibility
const verifyToken = auth;

module.exports = { auth, verifyToken };

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }
    

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ 
        error: 'Account inactive. Contact support.' 
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('AUTH ERROR:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ 
      success: false, 
      error: 'Super Admin access required' 
    });
  }
  next();
};

module.exports = { authMiddleware, isSuperAdmin };

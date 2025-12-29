// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

exports.authUser = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.authAdmin = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.admin) {
        return res.status(401).json({ msg: 'Not an admin token' });
    }

    const admin = await Admin.findById(decoded.admin.id).select('-password');
    if (!admin) {
        return res.status(401).json({ msg: 'Admin not found, authorization denied' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.isDefaultAdmin = (req, res, next) => {
    if (req.admin && req.admin.isDefault) {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Default admin privilege required.' });
    }
};

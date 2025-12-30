// backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const logger = require('../config/logger');
const constants = require('../config/constants');
const { asyncHandler, APIError } = require('../middleware/errorMiddleware');

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, gender } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new APIError(constants.ERROR_MESSAGES.USER_EXISTS, 400);
  }

  const user = new User({ name, email, password, gender });
  const salt = await bcrypt.genSalt(constants.BCRYPT_SALT_ROUNDS);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  logger.info(`New user registered: ${email}`)

;

  // Create JWT payload
  const payload = { user: { id: user.id } };

  // Sign and return token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: constants.JWT_EXPIRATION 
  });

  res.json({ 
    success: true,
    message: 'Registration successful',
    token 
  });
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError(constants.ERROR_MESSAGES.INVALID_CREDENTIALS, 400);
  }

  // Check if user is deleted
  if (user.isDeleted) {
    throw new APIError(constants.ERROR_MESSAGES.ACCOUNT_DEACTIVATED, 403);
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new APIError(constants.ERROR_MESSAGES.INVALID_CREDENTIALS, 400);
  }

  logger.info(`User logged in: ${email}`);

  // Create payload
  const payload = { user: { id: user.id } };

  // Sign and return token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: constants.JWT_EXPIRATION 
  });

  res.json({ 
    success: true,
    message: 'Login successful',
    token
  });
});

// === Admin Login ===
exports.loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check if admin exists
  const admin = await Admin.findOne({ username });
  if (!admin) {
    throw new APIError(constants.ERROR_MESSAGES.INVALID_CREDENTIALS, 400);
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new APIError(constants.ERROR_MESSAGES.INVALID_CREDENTIALS, 400);
  }

  logger.info(`Admin logged in: ${username}`);

  // Create payload, including admin flag and default status
  const payload = {
    admin: {
      id: admin.id,
      isDefault: admin.isDefault,
      username: admin.username,
      role: admin.isDefault ? 'Super Admin' : 'Admin'
    }
  };

  // Sign and return token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: constants.JWT_EXPIRATION 
  });

  res.json({ 
    success: true,
    message: 'Admin login successful',
    token
  });
});
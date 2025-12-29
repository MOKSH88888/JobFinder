// backend/routes/api/auth.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin } = require('../../controllers/authController');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateAdminLogin 
} = require('../../middleware/validationMiddleware');

// POST api/auth/register - Register new user
router.post('/register', validateUserRegistration, registerUser);

// POST api/auth/login - User authentication
router.post('/login', validateUserLogin, loginUser);

// POST api/auth/admin/login - Admin authentication
router.post('/admin/login', validateAdminLogin, loginAdmin);

module.exports = router;
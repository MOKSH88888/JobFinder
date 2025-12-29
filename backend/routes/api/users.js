// backend/routes/api/users.js

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { authUser } = require('../../middleware/authMiddleware');
const { upload } = require('../../middleware/uploadMiddleware');
const { validateUserProfile, validateJobId } = require('../../middleware/validationMiddleware');
const constants = require('../../config/constants');
const {
  getUserProfile,
  updateUserProfile,
  applyForJob,
  withdrawApplication,
  getAppliedJobs,
  bookmarkJob,
  removeBookmark,
  getBookmarkedJobs
} = require('../../controllers/userController');

// Rate limiter for file uploads (stricter than general API)
const uploadLimiter = rateLimit({
  windowMs: constants.RATE_LIMIT_WINDOW_MS,
  max: 10, // 10 file uploads per 15 minutes
  message: 'Too many file uploads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Profile Routes ---

// @route   GET api/users/profile
// @desc    Get the logged-in user's profile
// @access  Private (User)
router.get('/profile', authUser, getUserProfile);

// @route   PUT api/users/profile
// @desc    Update user profile (name, gender, etc., plus photo and resume)
// @access  Private (User)
router.put(
  '/profile',
  authUser,
  uploadLimiter, // Add rate limiting for file uploads
  upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'resume', maxCount: 1 }]),
  validateUserProfile,
  updateUserProfile
);

// --- Job Application Routes ---

// @route   POST api/users/jobs/:id/apply
// @desc    Apply for a job
// @access  Private (User)
router.post('/jobs/:id/apply', authUser, validateJobId, applyForJob);

// @route   DELETE api/users/jobs/:id/withdraw
// @desc    Withdraw a job application
// @access  Private (User)
router.delete('/jobs/:id/withdraw', authUser, validateJobId, withdrawApplication);

// @route   GET api/users/applied-jobs
// @desc    Get all jobs the user has applied for
// @access  Private (User)
router.get('/applied-jobs', authUser, getAppliedJobs);

// --- Job Bookmark Routes ---

// @route   POST api/users/jobs/:id/bookmark
// @desc    Bookmark a job
// @access  Private (User)
router.post('/jobs/:id/bookmark', authUser, validateJobId, bookmarkJob);

// @route   DELETE api/users/jobs/:id/bookmark
// @desc    Remove bookmark from a job
// @access  Private (User)
router.delete('/jobs/:id/bookmark', authUser, validateJobId, removeBookmark);

// @route   GET api/users/bookmarked-jobs
// @desc    Get all bookmarked jobs
// @access  Private (User)
router.get('/bookmarked-jobs', authUser, getBookmarkedJobs);

module.exports = router;
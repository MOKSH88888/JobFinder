// backend/controllers/jobController.js

const Job = require('../models/Job');
const logger = require('../config/logger');
const constants = require('../config/constants');
const { asyncHandler, APIError } = require('../middleware/errorMiddleware');

// === Get all jobs with filtering and optional pagination ===
exports.getAllJobs = asyncHandler(async (req, res) => {
  const { experience, salary, page, limit } = req.query;
  let filter = { isDeleted: false };

  // Handle experience filter
  if (experience != null && experience !== '') {
    const expNum = parseInt(experience, 10);
    
    // Handle "3+ Years" (value is 3 or more)
    if (expNum >= 3) {
      filter.experienceRequired = { $gte: expNum };
    } else {
      // Exact matches for Fresher (0), 1, and 2 years
      filter.experienceRequired = expNum;
    }
  }
  
  // Handle salary filter
  if (salary) {
    filter.salary = { $gte: parseInt(salary, 10) };
  }

  // Pagination enabled by default
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50; // Default 50 items per page
  const skip = (pageNum - 1) * limitNum;

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Job.countDocuments(filter)
  ]);

  res.json({
    success: true,
    jobs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

// === Get a single job by ID ===
exports.getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, isDeleted: false })
    .populate('postedBy', 'username');
  
  if (!job) {
    throw new APIError(constants.ERROR_MESSAGES.JOB_NOT_FOUND, 404);
  }
  
  res.json({ success: true, job });
});

module.exports = exports;

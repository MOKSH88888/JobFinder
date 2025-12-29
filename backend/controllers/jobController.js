// backend/controllers/jobController.js

const Job = require('../models/Job');
const logger = require('../config/logger');
const { asyncHandler, APIError } = require('../middleware/errorMiddleware');

// === Get all jobs with filtering ===
exports.getAllJobs = asyncHandler(async (req, res) => {
  const { experience, salary } = req.query;
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

  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, jobs });
});

// === Get a single job by ID ===
exports.getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, isDeleted: false })
    .populate('postedBy', 'username');
  
  if (!job) {
    throw new APIError('Job not found', 404);
  }
  
  res.json({ success: true, job });
});

module.exports = exports;

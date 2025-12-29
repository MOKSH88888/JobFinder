// backend/routes/api/jobs.js

const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById } = require('../../controllers/jobController');
const { validateJobFilters, validateJobId } = require('../../middleware/validationMiddleware');

// GET api/jobs - Retrieve all jobs with optional filters
router.get('/', validateJobFilters, getAllJobs);

// GET api/jobs/:id - Retrieve job by ID
router.get('/:id', validateJobId, getJobById);

module.exports = router;
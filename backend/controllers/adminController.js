// backend/controllers/adminController.js

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Job = require('../models/Job');
const { notifyUser, notifyAllAdmins, notifyAllUsers } = require('../config/socket');
const logger = require('../config/logger');
const constants = require('../config/constants');
const { asyncHandler, APIError } = require('../middleware/errorMiddleware');

// === Dashboard Stats ===

exports.getStats = asyncHandler(async (req, res) => {
  const totalAdmins = await Admin.countDocuments();
  const totalUsers = await User.countDocuments({ isDeleted: false });
  const totalJobs = await Job.countDocuments({ isDeleted: false });
  
  // Count total applications across all active jobs
  const jobs = await Job.find({ isDeleted: false }).populate('applicants.userId', '_id');
  const totalApplications = jobs.reduce((sum, job) => {
    const validApplicants = job.applicants.filter(app => app.userId != null);
    return sum + validApplicants.length;
  }, 0);
  
  res.json({
    success: true,
    stats: {
      totalAdmins,
      totalUsers,
      totalJobs,
      totalApplications
    }
  });
});

// === Admin Management ===

exports.addAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    throw new APIError(constants.ERROR_MESSAGES.ADMIN_EXISTS, 400);
  }
  
  const salt = await bcrypt.genSalt(constants.BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const admin = new Admin({ username, password: hashedPassword });
  await admin.save();
  
  logger.info(`New admin created: ${username}`);
  res.status(201).json({ success: true, message: 'Admin created successfully' });
});

exports.getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find().select('-password');
  res.json({ success: true, admins });
});

exports.deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  
  if (!admin) {
    throw new APIError('Admin not found', 404);
  }
  
  if (admin.isDefault) {
    throw new APIError('Cannot delete default admin', 403);
  }
  
  await admin.deleteOne();
  logger.info(`Admin deleted: ${admin.username}`);
  res.json({ success: true, message: 'Admin removed successfully' });
});

// === User Management ===

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isDeleted: false }).select('-password');
  res.json({ success: true, users });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(req.params.id).session(session);
    
    if (!user || user.isDeleted) {
      throw new APIError('User not found', 404);
    }
    
    // Soft delete user
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save({ session });
    
    // Remove user's applications from all jobs
    await Job.updateMany(
      { 'applicants.userId': user._id },
      { $pull: { applicants: { userId: user._id } } },
      { session }
    );
    
    await session.commitTransaction();
    logger.info(`User soft deleted: ${user.email}`);
    res.json({ success: true, message: 'User removed successfully' });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// === Job Management ===

exports.getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isDeleted: false })
    .populate('applicants.userId', '_id')
    .sort({ createdAt: -1 });
  
  // Filter out applicants with deleted users
  const cleanedJobs = jobs.map(job => {
    const jobObj = job.toObject();
    jobObj.applicants = jobObj.applicants.filter(app => app.userId != null);
    return jobObj;
  });
  
  res.json({ success: true, jobs: cleanedJobs });
});

exports.postJob = asyncHandler(async (req, res) => {
  const { title, description, companyName, location, salary, experienceRequired, jobType, requirements } = req.body;
  
  const newJob = new Job({
    title,
    description,
    companyName,
    location,
    salary,
    experienceRequired,
    jobType,
    requirements,
    postedBy: req.admin.id,
  });
  
  await newJob.save();
  logger.info(`New job posted: ${title} at ${companyName}`);

  // Notify all users about the new job
  notifyAllUsers('new-job-posted', {
    jobId: newJob._id,
    title: newJob.title,
    companyName: newJob.companyName,
    location: newJob.location,
    salary: newJob.salary,
    message: `New job posted: ${newJob.title} at ${newJob.companyName}`
  });

  res.status(201).json({ success: true, message: 'Job posted successfully', job: newJob });
});

exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  
  if (!job || job.isDeleted) {
    throw new APIError('Job not found', 404);
  }
  
  const { title, description, companyName, location, salary, experienceRequired, jobType, requirements } = req.body;
  
  if (title) job.title = title;
  if (description) job.description = description;
  if (companyName) job.companyName = companyName;
  if (location) job.location = location;
  if (salary !== undefined) job.salary = salary;
  if (experienceRequired !== undefined) job.experienceRequired = experienceRequired;
  if (jobType) job.jobType = jobType;
  if (requirements) job.requirements = requirements;
  
  await job.save();
  logger.info(`Job updated: ${job.title}`);
  
  res.json({ success: true, message: 'Job updated successfully', job });
});

exports.deleteJob = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const job = await Job.findById(req.params.id).session(session);
    
    if (!job || job.isDeleted) {
      throw new APIError('Job not found', 404);
    }
    
    // Soft delete job
    job.isDeleted = true;
    job.deletedAt = new Date();
    await job.save({ session });
    
    // Remove this job from all users' appliedJobs and bookmarks
    await User.updateMany(
      { 'appliedJobs.jobId': job._id },
      { $pull: { appliedJobs: { jobId: job._id } } },
      { session }
    );
    
    await User.updateMany(
      { bookmarkedJobs: job._id },
      { $pull: { bookmarkedJobs: job._id } },
      { session }
    );
    
    await session.commitTransaction();
    logger.info(`Job soft deleted: ${job.title}`);

    // Notify all users that the job has been removed
    notifyAllUsers('job-deleted', {
      jobId: job._id,
      title: job.title,
      companyName: job.companyName,
      message: `Job removed: ${job.title} at ${job.companyName}`
    });

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// === Applicant Management ===

exports.getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, isDeleted: false })
    .populate({
      path: 'applicants.userId',
      match: { isDeleted: false },
      select: 'name email phone experience skills resume gender'
    });
  
  if (!job) {
    throw new APIError('Job not found', 404);
  }
  
  // Filter out applicants with deleted users and flatten user data
  const validApplicants = job.applicants
    .filter(app => app.userId != null)
    .map(app => ({
      _id: app.userId._id,
      name: app.userId.name,
      email: app.userId.email,
      phone: app.userId.phone,
      experience: app.userId.experience,
      skills: app.userId.skills,
      resume: app.userId.resume,
      gender: app.userId.gender,
      status: app.status,
      appliedAt: app.appliedAt
    }));
  
  res.json({ 
    success: true,
    job: {
      id: job._id,
      title: job.title,
      companyName: job.companyName
    },
    applicants: validApplicants
  });
});

exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { jobId, applicantId } = req.params;
  const { status } = req.body;

  if (!['Under Review', 'Accepted', 'Rejected', 'Shortlisted', 'Reviewed'].includes(status)) {
    throw new APIError('Invalid status', 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update status in Job collection
    const job = await Job.findOneAndUpdate(
      { _id: jobId, 'applicants.userId': applicantId, isDeleted: false },
      { $set: { 'applicants.$.status': status } },
      { new: true, session }
    );

    if (!job) {
      throw new APIError('Job or applicant not found', 404);
    }

    // Update status in User collection
    const user = await User.findOneAndUpdate(
      { _id: applicantId, 'appliedJobs.jobId': jobId, isDeleted: false },
      { $set: { 'appliedJobs.$.status': status } },
      { new: true, session }
    );

    if (!user) {
      throw new APIError('User not found', 404);
    }

    await session.commitTransaction();
    logger.info(`Application status updated to ${status} for user ${user.email} on job ${job.title}`);

    // Notify the user about the status change
    notifyUser(applicantId, 'application-status-updated', {
      jobId: job._id,
      jobTitle: job.title,
      companyName: job.companyName,
      status: status,
      message: `Your application for ${job.title} at ${job.companyName} has been ${status.toLowerCase()}`
    });

    res.json({ success: true, message: 'Application status updated', status });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

module.exports = exports;

// backend/controllers/userController.js

const User = require('../models/User');
const Job = require('../models/Job');
const mongoose = require('mongoose');
const { notifyAllAdmins } = require('../config/socket');
const { uploadToGridFS } = require('../middleware/uploadMiddleware');
const logger = require('../config/logger');
const constants = require('../config/constants');
const { asyncHandler, APIError } = require('../middleware/errorMiddleware');

// === User Profile Management ===

exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user.id, isDeleted: false }).select('-password');
  if (!user) {
    throw new APIError('User not found', 404);
  }
  res.json({ success: true, user });
});

exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, gender, experience, skills, description } = req.body;
  const profileFields = {};
  
  if (name) profileFields.name = name;
  if (phone) profileFields.phone = phone;
  if (gender) profileFields.gender = gender;
  if (experience !== undefined) profileFields.experience = experience;
  if (description) profileFields.description = description;
  
  // Handle skills - accept both string and array formats
  if (skills) {
    profileFields.skills = Array.isArray(skills) 
      ? skills 
      : skills.split(',').map(skill => skill.trim()).filter(skill => skill);
  }

  // Check for uploaded files
  if (req.files && (req.files.profilePhoto || req.files.resume)) {
    logger.info(`Processing file uploads for user ${req.user.id}`);
    
    // Upload profile photo to GridFS
    if (req.files.profilePhoto) {
      const photoFile = req.files.profilePhoto[0];
      const result = await uploadToGridFS(photoFile, 'profilePhoto');
      profileFields.profilePhoto = result.url;
      logger.info(`Profile photo uploaded: ${result.filename}`);
    }
    
    // Upload resume to GridFS
    if (req.files.resume) {
      const resumeFile = req.files.resume[0];
      const result = await uploadToGridFS(resumeFile, 'resume');
      profileFields.resume = result.url;
      logger.info(`Resume uploaded: ${result.filename}`);
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: profileFields },
    { new: true }
  ).select('-password');

  res.json({ success: true, message: 'Profile updated successfully', user });
});

// === Job Application Management ===

exports.applyForJob = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const job = await Job.findOne({ _id: req.params.id, isDeleted: false }).session(session);
    const user = await User.findOne({ _id: req.user.id, isDeleted: false }).session(session);

    if (!job) {
      throw new APIError('Job not found', 404);
    }

    if (!user) {
      throw new APIError('User not found', 404);
    }

    // Check if user has already applied
    const alreadyApplied = user.appliedJobs.some(app => app.jobId.equals(job._id));
    if (alreadyApplied) {
      throw new APIError('You have already applied for this job', 400);
    }

    // Add application to both job and user within transaction
    job.applicants.push({ 
      userId: user._id, 
      appliedAt: new Date(),
      status: 'Pending'
    });
    user.appliedJobs.push({ 
      jobId: job._id, 
      appliedAt: new Date(),
      status: 'Pending'
    });

    await job.save({ session });
    await user.save({ session });
    
    await session.commitTransaction();
    logger.info(`User ${user.email} applied for job: ${job.title}`);

    // Notify all admins about new application
    notifyAllAdmins('new-application', {
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      jobId: job._id,
      jobTitle: job.title,
      companyName: job.companyName,
      message: `${user.name} applied for ${job.title} at ${job.companyName}`,
    });

    res.json({ success: true, message: 'Application successful', status: 'Pending' });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

exports.withdrawApplication = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    await Job.findByIdAndUpdate(jobId, { 
      $pull: { applicants: { userId: userId } } 
    }, { session });

    await User.findByIdAndUpdate(userId, { 
      $pull: { appliedJobs: { jobId: jobId } } 
    }, { session });

    await session.commitTransaction();
    logger.info(`User ${userId} withdrew application for job ${jobId}`);

    res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

exports.getAppliedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'appliedJobs.jobId',
    match: { isDeleted: false }
  });
  
  // Filter out deleted jobs and map to include status
  const appliedJobs = user.appliedJobs
    .filter(app => app.jobId)
    .map(app => ({
      ...app.jobId.toObject(),
      applicationStatus: app.status,
      appliedAt: app.appliedAt
    }));
  
  res.json({ success: true, appliedJobs });
});

// === Job Bookmark Management ===

exports.bookmarkJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const user = await User.findById(req.user.id);
  const job = await Job.findOne({ _id: jobId, isDeleted: false });

  if (!job) {
    throw new APIError('Job not found', 404);
  }

  if (user.bookmarkedJobs.includes(jobId)) {
    throw new APIError('Job already bookmarked', 400);
  }

  user.bookmarkedJobs.push(jobId);
  await user.save();

  logger.info(`User ${user.email} bookmarked job: ${job.title}`);
  res.json({ success: true, message: 'Job bookmarked successfully', bookmarked: true });
});

exports.removeBookmark = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user.id;

  await User.findByIdAndUpdate(userId, { 
    $pull: { bookmarkedJobs: jobId } 
  });

  logger.info(`User ${userId} removed bookmark for job ${jobId}`);
  res.json({ success: true, message: 'Bookmark removed successfully', bookmarked: false });
});

exports.getBookmarkedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'bookmarkedJobs',
    match: { isDeleted: false }
  });
  
  // Filter out null entries (deleted jobs)
  const bookmarkedJobs = user.bookmarkedJobs.filter(job => job !== null);
  
  res.json({ success: true, bookmarkedJobs });
});

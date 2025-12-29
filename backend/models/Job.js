const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  experienceRequired: { type: Number, required: true }, // 0 for freshers
  jobType: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  requirements: [{ type: String }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  applicants: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['Under Review', 'Accepted', 'Rejected', 'Shortlisted', 'Reviewed'], 
      default: 'Under Review' 
    }
  }],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { timestamps: true });

// Indexes for performance optimization
jobSchema.index({ createdAt: -1 }); // For sorting by newest jobs first
jobSchema.index({ experienceRequired: 1 }); // For filtering by experience
jobSchema.index({ salary: 1 }); // For filtering by salary
jobSchema.index({ jobType: 1 }); // For filtering by job type
jobSchema.index({ location: 1 }); // For location-based searches
jobSchema.index({ isDeleted: 1 }); // For filtering active jobs
jobSchema.index({ postedBy: 1 }); // For admin job queries
jobSchema.index({ 'applicants.userId': 1 }); // For finding jobs user applied to
jobSchema.index({ 'applicants.status': 1 }); // For filtering by applicant status

// Text search index for title, company, and location
jobSchema.index({ title: 'text', companyName: 'text', location: 'text' }); 

// Compound indexes for common query patterns
jobSchema.index({ isDeleted: 1, createdAt: -1 }); // Active jobs sorted by date
jobSchema.index({ isDeleted: 1, experienceRequired: 1 }); // Active jobs by experience
jobSchema.index({ isDeleted: 1, salary: 1 }); // Active jobs by salary
jobSchema.index({ isDeleted: 1, jobType: 1 }); // Active jobs by type
jobSchema.index({ isDeleted: 1, location: 1 }); // Active jobs by location
jobSchema.index({ postedBy: 1, isDeleted: 1, createdAt: -1 }); // Admin's active jobs
jobSchema.index({ experienceRequired: 1, salary: 1, isDeleted: 1 }); // Multi-filter searches

module.exports = mongoose.model('Job', jobSchema);
// Database validation script - check data integrity
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Job = require('../models/Job');
const Admin = require('../models/Admin');

async function validateDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔍 Running database validation checks...\n');
    
    let issues = 0;
    
    // 1. Check for orphaned bookmarks
    console.log('1️⃣  Checking for orphaned bookmarks...');
    const usersWithBookmarks = await User.find({ bookmarkedJobs: { $exists: true, $ne: [] } });
    let orphanedBookmarks = 0;
    
    for (const user of usersWithBookmarks) {
      for (const jobId of user.bookmarkedJobs) {
        const jobExists = await Job.findOne({ _id: jobId, isDeleted: false });
        if (!jobExists) {
          console.log(`   ❌ User ${user.email} has bookmark to non-existent job: ${jobId}`);
          orphanedBookmarks++;
          issues++;
        }
      }
    }
    if (orphanedBookmarks === 0) {
      console.log('   ✅ No orphaned bookmarks found');
    }
    
    // 2. Check for duplicate bookmarks
    console.log('\n2️⃣  Checking for duplicate bookmarks...');
    let duplicateBookmarks = 0;
    
    for (const user of usersWithBookmarks) {
      const uniqueBookmarks = [...new Set(user.bookmarkedJobs.map(id => id.toString()))];
      if (uniqueBookmarks.length !== user.bookmarkedJobs.length) {
        console.log(`   ❌ User ${user.email} has duplicate bookmarks`);
        duplicateBookmarks++;
        issues++;
      }
    }
    if (duplicateBookmarks === 0) {
      console.log('   ✅ No duplicate bookmarks found');
    }
    
    // 3. Check for orphaned applications
    console.log('\n3️⃣  Checking for orphaned applications...');
    const usersWithApplications = await User.find({ appliedJobs: { $exists: true, $ne: [] } });
    let orphanedApplications = 0;
    
    for (const user of usersWithApplications) {
      for (const app of user.appliedJobs) {
        const jobExists = await Job.findOne({ _id: app.jobId, isDeleted: false });
        if (!jobExists) {
          console.log(`   ❌ User ${user.email} has application to non-existent job: ${app.jobId}`);
          orphanedApplications++;
          issues++;
        }
      }
    }
    if (orphanedApplications === 0) {
      console.log('   ✅ No orphaned applications found');
    }
    
    // 4. Check application status consistency
    console.log('\n4️⃣  Checking application status consistency...');
    const jobs = await Job.find({ isDeleted: false });
    let statusMismatches = 0;
    
    for (const job of jobs) {
      for (const applicant of job.applicants) {
        const user = await User.findById(applicant.userId);
        if (user) {
          const userApp = user.appliedJobs.find(app => app.jobId.toString() === job._id.toString());
          if (userApp && userApp.status !== applicant.status) {
            console.log(`   ❌ Status mismatch for ${user.email} on job ${job.title}: User=${userApp.status}, Job=${applicant.status}`);
            statusMismatches++;
            issues++;
          }
        }
      }
    }
    if (statusMismatches === 0) {
      console.log('   ✅ All application statuses are consistent');
    }
    
    // 5. Check for invalid status values
    console.log('\n5️⃣  Checking for invalid status values...');
    const validStatuses = ['Pending', 'Under Review', 'Shortlisted', 'Rejected'];
    let invalidStatuses = 0;
    
    for (const user of usersWithApplications) {
      for (const app of user.appliedJobs) {
        if (!validStatuses.includes(app.status)) {
          console.log(`   ❌ User ${user.email} has invalid status: ${app.status}`);
          invalidStatuses++;
          issues++;
        }
      }
    }
    if (invalidStatuses === 0) {
      console.log('   ✅ All status values are valid');
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Validation Summary:');
    console.log('='.repeat(60));
    
    const userCount = await User.countDocuments({ isDeleted: false });
    const jobCount = await Job.countDocuments({ isDeleted: false });
    const adminCount = await Admin.countDocuments();
    
    const totalBookmarks = usersWithBookmarks.reduce((sum, user) => sum + user.bookmarkedJobs.length, 0);
    const totalApplications = usersWithApplications.reduce((sum, user) => sum + user.appliedJobs.length, 0);
    
    console.log(`   - Total Users: ${userCount}`);
    console.log(`   - Total Jobs: ${jobCount}`);
    console.log(`   - Total Admins: ${adminCount}`);
    console.log(`   - Total Bookmarks: ${totalBookmarks}`);
    console.log(`   - Total Applications: ${totalApplications}`);
    console.log(`   - Issues Found: ${issues}`);
    
    if (issues === 0) {
      console.log('\n✅ Database is consistent and valid!');
    } else {
      console.log(`\n⚠️  Found ${issues} issue(s). Run 'npm run cleanup' to fix bookmark issues.`);
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
    process.exit(1);
  }
}

validateDatabase();

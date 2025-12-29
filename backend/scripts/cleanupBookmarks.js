// Cleanup script to remove orphaned bookmarks
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Job = require('../models/Job');

async function cleanupBookmarks() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🧹 Cleaning up orphaned bookmarks...');
    
    // Get all users with bookmarks
    const users = await User.find({ bookmarkedJobs: { $exists: true, $ne: [] } });
    
    let totalCleaned = 0;
    
    for (const user of users) {
      const validBookmarks = [];
      
      // Check each bookmarked job
      for (const jobId of user.bookmarkedJobs) {
        const jobExists = await Job.findOne({ _id: jobId, isDeleted: false });
        if (jobExists) {
          validBookmarks.push(jobId);
        } else {
          console.log(`❌ Removing orphaned bookmark: User ${user.email} -> Job ${jobId}`);
          totalCleaned++;
        }
      }
      
      // Update user if bookmarks changed
      if (validBookmarks.length !== user.bookmarkedJobs.length) {
        await User.findByIdAndUpdate(user._id, {
          bookmarkedJobs: validBookmarks
        });
      }
    }
    
    console.log(`\n✅ Cleanup completed!`);
    console.log(`   - Total orphaned bookmarks removed: ${totalCleaned}`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

cleanupBookmarks();

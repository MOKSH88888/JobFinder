// backend/config/gridfs.js
// GridFS configuration for storing files in MongoDB

const mongoose = require('mongoose');
const logger = require('./logger');

let bucket;

// Initialize GridFS bucket once MongoDB is connected
const initGridFS = () => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      logger.error('MongoDB connection not ready for GridFS initialization');
      return null;
    }
    
    // Use GridFSBucket from mongoose's mongodb driver
    const { GridFSBucket } = mongoose.mongo;
    
    bucket = new GridFSBucket(db, {
      bucketName: 'uploads' // Collection name will be uploads.files and uploads.chunks
    });
    logger.info('GridFS bucket initialized successfully');
    return bucket;
  } catch (error) {
    logger.error('Error initializing GridFS:', error);
    return null;
  }
};

const getGridFSBucket = () => {
  if (!bucket) {
    logger.info('GridFS bucket not initialized, attempting to initialize...');
    return initGridFS();
  }
  return bucket;
};

module.exports = { initGridFS, getGridFSBucket };

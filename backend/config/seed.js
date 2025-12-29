const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const logger = require('./logger');

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ isDefault: true });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, salt);

      const defaultAdmin = new Admin({
        username: process.env.DEFAULT_ADMIN_USERNAME,
        password: hashedPassword,
        isDefault: true,
      });
      await defaultAdmin.save();
      logger.info('Default admin created.');
    }
    // Admin already exists - no message needed
  } catch (error) {
    logger.error('Error seeding admin:', error);
  }
};
module.exports = seedAdmin;
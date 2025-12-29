// backend/controllers/contactController.js

const axios = require('axios');
const logger = require('../config/logger');
const { asyncHandler, APIError } = require('../middleware/errorMiddleware');

exports.sendContactEmail = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!process.env.RESEND_API_KEY) {
    logger.warn('RESEND_API_KEY not configured');
    throw new APIError('Contact service is not configured', 503);
  }

  const emailData = {
    from: 'onboarding@resend.dev',
    to: process.env.CONTACT_EMAIL || 'admin@jobportal.com',
    subject: `Contact Form: Message from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  await axios.post('https://api.resend.com/emails', emailData, {
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  logger.info(`Contact form submitted by ${email}`);
  res.json({ success: true, message: 'Message sent successfully' });
});

module.exports = exports;

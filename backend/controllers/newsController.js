// backend/controllers/newsController.js

const axios = require('axios');
const logger = require('../config/logger');
const { asyncHandler, APIError } = require('../middleware/errorMiddleware');

// @desc    Get news by category
// @route   GET /api/news/:category
// @access  Public
const getNews = asyncHandler(async (req, res) => {
  const { category = 'technology' } = req.params;
  
  const API_KEY = process.env.NEWS_API_KEY;
  
  if (!API_KEY) {
    logger.warn('NEWS_API_KEY not configured');
    throw new APIError('News service is not configured', 503);
  }
  
  const response = await axios.get(
    `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&apiKey=${API_KEY}`
  );
  
  logger.info(`Fetched news for category: ${category}`);
  
  res.json({
    success: true,
    articles: response.data.articles || []
  });
});

module.exports = { getNews };

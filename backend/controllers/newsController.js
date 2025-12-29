// backend/controllers/newsController.js

const axios = require('axios');
const logger = require('../config/logger');
const { asyncHandler, APIError } = require('../middleware/errorMiddleware');

// Mock news data for when API is not configured
const getMockNews = (category) => {
  const mockArticles = {
    technology: [
      {
        title: "AI Revolution Transforms Job Market in 2025",
        description: "Artificial intelligence is reshaping how companies hire and how professionals work, creating new opportunities in tech sectors.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Tech News" }
      },
      {
        title: "Remote Work Technologies See Major Advancements",
        description: "New collaboration tools and virtual office platforms are making remote work more efficient and engaging than ever before.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Innovation Weekly" }
      },
      {
        title: "Cybersecurity Skills in High Demand Across Industries",
        description: "Companies are actively seeking cybersecurity professionals as digital threats continue to evolve and multiply.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: { name: "Security Today" }
      }
    ],
    business: [
      {
        title: "Global Job Market Shows Strong Recovery Signs",
        description: "Employment rates are rising across major economies as businesses expand their workforce and create new positions.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Business Insider" }
      },
      {
        title: "Startups Drive Innovation in Hiring Practices",
        description: "New companies are adopting creative recruitment strategies to attract top talent in competitive markets.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Startup News" }
      }
    ],
    general: [
      {
        title: "Career Development Trends for 2025",
        description: "Professionals are focusing on continuous learning and skill development to stay competitive in evolving job markets.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Career Focus" }
      }
    ]
  };

  return mockArticles[category] || mockArticles.general;
};

// @desc    Get news by category
// @route   GET /api/news/:category
// @access  Public
const getNews = asyncHandler(async (req, res) => {
  const { category = 'technology' } = req.params;
  
  const API_KEY = process.env.NEWS_API_KEY;
  
  // If API key is not configured, return mock data
  if (!API_KEY) {
    logger.info(`NEWS_API_KEY not configured - returning mock news for category: ${category}`);
    return res.json({
      success: true,
      articles: getMockNews(category),
      mock: true
    });
  }

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&apiKey=${API_KEY}`
    );
    
    logger.info(`Fetched news for category: ${category}`);
    
    res.json({
      success: true,
      articles: response.data.articles || []
    });
  } catch (error) {
    // If API call fails, fallback to mock data
    logger.error(`Failed to fetch news from API: ${error.message} - returning mock data`);
    res.json({
      success: true,
      articles: getMockNews(category),
      mock: true
    });
  }
});

module.exports = { getNews };

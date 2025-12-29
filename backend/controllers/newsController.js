// backend/controllers/newsController.js

const axios = require('axios');
const logger = require('../config/logger');
const { asyncHandler, APIError } = require('../middleware/errorMiddleware');

// Mock news data for when API is not configured
const getMockNews = (category) => {
  const mockArticles = {
    technology: [
      {
        title: "Tech Industry Hiring Surges: 150,000 New Positions Expected in 2025",
        description: "Major tech companies and startups are ramping up recruitment efforts, with software engineering, AI/ML, and cybersecurity roles leading the demand.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Tech Careers Daily" }
      },
      {
        title: "Remote Software Developer Salaries Rise 15% Amid Global Talent Competition",
        description: "Companies offering competitive compensation packages as remote work enables access to global talent pools. Average salaries now exceed $120,000.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Job Market Insights" }
      },
      {
        title: "Top 10 In-Demand Tech Skills Employers Are Looking For Right Now",
        description: "Python, React, AWS, and data analysis top the list as companies seek versatile professionals who can adapt to evolving technologies.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: { name: "Skills & Hiring Report" }
      },
      {
        title: "AI Job Opportunities Double Year-Over-Year as Industry Expands",
        description: "Machine learning engineers, AI researchers, and data scientists are among the most sought-after professionals in today's job market.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        source: { name: "AI Careers Weekly" }
      }
    ],
    business: [
      {
        title: "Entry-Level Hiring Increases 22% as Companies Invest in Fresh Talent",
        description: "Organizations across industries are expanding graduate recruitment programs and offering comprehensive training to build future workforce.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Employment Trends" }
      },
      {
        title: "Hybrid Work Model Now Standard: 70% of Companies Offer Flexible Options",
        description: "Job seekers prioritize work-life balance as employers adapt policies to attract and retain top talent in competitive markets.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Workplace Evolution" }
      },
      {
        title: "Average Job Search Time Drops to 6 Weeks Amid Strong Labor Market",
        description: "Candidates finding opportunities faster than ever, with multiple offers becoming increasingly common for skilled professionals.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: { name: "Job Market Analytics" }
      }
    ],
    general: [
      {
        title: "Career Growth: 5 Strategies to Stand Out in Job Applications",
        description: "Expert advice on crafting compelling resumes, building professional networks, and preparing for interviews in 2025's competitive job market.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Career Success Guide" }
      },
      {
        title: "Salary Negotiation Tips: How to Get the Compensation You Deserve",
        description: "Learn proven techniques to confidently negotiate job offers and maximize your earning potential in today's transparent salary landscape.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Professional Development" }
      },
      {
        title: "Upskilling Revolution: Online Learning Platforms See 200% Growth",
        description: "Professionals investing in continuous education to stay competitive, with certifications in cloud computing and data science most popular.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: { name: "Learning & Growth" }
      }
    ],
    health: [
      {
        title: "Healthcare Sector Jobs Grow 18%: Nurses and Therapists in High Demand",
        description: "Medical facilities nationwide expanding staff as healthcare careers offer stability, competitive pay, and meaningful work opportunities.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Healthcare Careers" }
      },
      {
        title: "Mental Health Professionals See Surge in Job Openings Across Industries",
        description: "Companies prioritizing employee wellness create opportunities for counselors, psychologists, and wellness coaches in corporate settings.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Wellness at Work" }
      }
    ],
    science: [
      {
        title: "Research & Development Jobs Boom as Companies Invest in Innovation",
        description: "Scientific roles in biotechnology, renewable energy, and pharmaceuticals offering attractive salaries and cutting-edge project opportunities.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Science Careers" }
      },
      {
        title: "Environmental Scientists in Demand as Green Jobs Market Expands",
        description: "Sustainability-focused positions grow 30% annually as organizations commit to environmental goals and climate action initiatives.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Green Jobs Network" }
      }
    ],
    sports: [
      {
        title: "Sports Management Careers Score Big: Event Coordinators in High Demand",
        description: "Growing sports industry creates opportunities in marketing, operations, and digital media as fan engagement reaches new heights.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Sports Industry Jobs" }
      },
      {
        title: "Fitness Industry Hiring Surge: Trainers and Wellness Coaches Wanted",
        description: "Health-conscious culture drives demand for certified fitness professionals, nutritionists, and wellness program coordinators nationwide.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Fitness Careers Today" }
      }
    ],
    entertainment: [
      {
        title: "Creative Industry Jobs Flourish: Content Creators and Designers in Demand",
        description: "Digital transformation creates opportunities for video editors, graphic designers, and social media managers as brands expand online presence.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Creative Careers Hub" }
      },
      {
        title: "Gaming Industry Offers Lucrative Careers Beyond Development",
        description: "Esports managers, community coordinators, and marketing specialists find exciting opportunities in rapidly growing gaming sector.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Gaming Careers Network" }
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

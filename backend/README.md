# Backend - Job Portal REST API

Express.js REST API with MongoDB Atlas, JWT authentication, and Socket.io WebSocket notifications. Designed for deployment on Render.

## Quick Start

```bash
npm install
npm start       # Production mode
npm run dev     # Development mode
```

**Local Server:** http://localhost:5000  
**Health Check:** http://localhost:5000/api/health  
**Complete API Docs:** See [main README](../README.md)

## Technology Stack

| Category | Technology | Version |
|----------|------------|--------|
| Runtime | Node.js | v16+ |
| Framework | Express.js | 4.21.2 |
| Database | MongoDB + Mongoose | 8.18.2 |
| Authentication | JWT + bcryptjs | 9.0.2 / 3.0.2 |
| WebSocket | Socket.io | 4.6.1 |
| File Storage | MongoDB GridFS | Built-in |
| Logging | Winston | 3.11.0 |
| Security | Helmet, rate-limit, xss-clean, mongo-sanitize | Latest |

## Environment Variables

**Development** (`.env.local`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job_portal_db
JWT_SECRET=dev-secret-replace-in-production
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=Admin@123
FRONTEND_URL=http://localhost:3000
```

**Production** (`.env` - for Render):
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_portal_db
JWT_SECRET=<generate-with-crypto.randomBytes>
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=<secure-password>
FRONTEND_URL=https://your-app.vercel.app
```

**Generate Secure JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Core Features

| Feature | Implementation |
|---------|----------------|
| Authentication | Dual JWT system (User + Admin), 5-hour expiration |
| File Uploads | GridFS with 5MB limit, MIME validation, virus scan |
| WebSocket | Socket.io with room-based messaging |
| Rate Limiting | 100/15min (API), 5/15min (auth), 10/15min (uploads) |
| Database | Soft deletes, Mongoose transactions |
| Logging | Winston with file rotation |
| Error Handling | Centralized asyncHandler wrapper |
| Security | Helmet, XSS, NoSQL injection, input validation |

## Database Seeding

```bash
node config/seedDatabase.js
```

**Creates:**
- 1 default admin (username from .env)
- 8 test users with complete profiles
- 10 job postings across industries
- 6 sample applications

## Deployment (Render)

**Automatic Deployment via `render.yaml`:**

1. Push to GitHub
2. Connect repo to Render
3. Render auto-detects `render.yaml`
4. Set encrypted environment variables in dashboard
5. Deploy

**Manual Configuration:**
- Build Command: `npm install`
- Start Command: `npm run prod`
- Health Check: `/api/health`
- Region: Choose closest to users

## Project Structure

```
backend/
├── config/          # DB, logger, socket, GridFS, constants
├── controllers/     # Business logic with asyncHandler
├── middleware/      # Auth, validation, error handling, uploads
├── models/          # Mongoose schemas (User, Job, Admin)
├── routes/          # API endpoints
└── server.js        # Application entry point
```

## Development Guidelines

- Use `asyncHandler` for all async routes
- Log with Winston (`logger.info/error`), not `console.log`
- Validate inputs with express-validator
- Use Mongoose transactions for multi-document operations
- Follow consistent response format: `{ success, message, data }`

---

**See [main README](../README.md) for complete documentation and API endpoints**

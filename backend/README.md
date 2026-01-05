# Backend - JobFinder API

Node.js/Express REST API server for the JobFinder job portal with real-time WebSocket support.

## 🚀 Quick Start

```bash
npm install
cp .env.example .env  # Create and configure environment file
node config/seedDatabase.js  # Seed demo data
npm start  # Server runs on http://localhost:5000
```

## 🛠️ Tech Stack

**Runtime:** Node.js v16+ • Express.js 4.21.2 • MongoDB 5.0+ (Mongoose 8.18.2)  
**Real-time:** Socket.io 4.6.1 • WebSocket rooms for users/admins  
**Security:** JWT 9.0.2 • bcryptjs 3.0.2 • helmet • rate-limit • xss-clean  
**Storage:** GridFS (resumes/photos) • Winston logging

## 📂 Architecture

```
backend/
├── config/       # DB, Socket.io, GridFS, logger, constants
├── controllers/  # authController, userController, jobController, adminController
├── middleware/   # auth, validation, upload, error handling
├── models/       # User, Job, Admin (Mongoose schemas)
├── routes/api/   # auth, users, jobs, admin endpoints
└── server.js     # Express app entry point
```

## 🔌 API Endpoints

**Public Routes:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/jobs?page=1&limit=20` - Browse jobs

**User Protected:**
- `GET|PUT /api/users/profile` - Profile management
- `POST /api/users/jobs/:id/apply` - Apply for job
- `POST /api/users/jobs/:id/bookmark` - Bookmark job

**Admin Protected:**
- `GET /api/admin/stats` - Dashboard statistics
- `POST|PUT|DELETE /api/admin/jobs/:id` - Job CRUD

**System:**
- `GET /api/health` - Health check
- `GET /api/docs` - Complete API documentation

## ⚙️ Environment Variables

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_portal_db
JWT_SECRET=<64-char-hex-string>
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=<secure-password>
FRONTEND_URL=https://your-frontend.vercel.app
```

## 🔐 Security

**Authentication:**
- JWT tokens with 5-hour expiration
- bcrypt password hashing (10 salt rounds)

**Rate Limiting:**
- API endpoints: 100 requests/15 minutes
- Auth endpoints: 5 requests/15 minutes
- File uploads: 10 uploads/15 minutes

**Input Protection:**
- express-validator for input validation
- xss-clean for XSS prevention
- mongo-sanitize for NoSQL injection protection

**File Security:**
- MIME type validation
- File extension checking
- Magic number verification
- Size limits: 2MB (photos) / 5MB (resumes)

## ⚡ Real-time Events

| Event | Trigger | Recipients |
|-------|---------|-----------|
| `new-application` | User applies | All admins |
| `application-status-updated` | Admin updates status | Specific user |
| `new-job-posted` | Admin creates job | All users |
| `job-deleted` | Admin deletes job | All users |

## 🗄️ Database

**Optimization:**
- 15+ strategic indexes (createdAt, salary, experience, location)
- Text search index for title/company/location
- MongoDB transactions for data consistency
- Soft delete pattern with audit trail (isDeleted + deletedAt)

**Connection:**
- Connection pooling (min: 2, max: 10)
- Auto-retry with exponential backoff

---

## 📝 Logging

Winston logger writes to:
- Console output
- `logs/error.log` - Error-level logs
- `logs/combined.log` - All logs

---

**For complete project documentation, see [Main README](../README.md)**

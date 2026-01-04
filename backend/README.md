# Backend API Documentation

Node.js/Express REST API server for JobFinder job portal.

## 🚀 Quick Start

```bash
npm install
cp .env.example .env  # Configure environment
node config/seedDatabase.js  # Populate demo data
npm start  # http://localhost:5000
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

## 🔌 Key API Endpoints

**Public:** `POST /api/auth/register|login|admin/login`, `GET /api/jobs?page=1&limit=20`  
**User:** `GET|PUT /api/users/profile`, `POST /api/users/jobs/:id/apply|bookmark`  
**Admin:** `GET /api/admin/stats`, `POST|PUT|DELETE /api/admin/jobs/:id`

📖 **Complete API Docs:** `GET /api/docs`

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

- **Auth:** JWT (5h expiration), bcrypt (10 rounds)
- **Rate Limits:** 100 req/15min (API), 5 req/15min (auth), 10 uploads/15min
- **Validation:** express-validator, xss-clean, mongo-sanitize
- **File Upload:** MIME + extension + magic number checks, 2MB photos / 5MB resumes

## ⚡ Real-time Events

| Event | Trigger | Recipients |
|-------|---------|-----------|
| `new-application` | User applies | All admins |
| `application-status-updated` | Admin updates status | Specific user |
| `new-job-posted` | Admin creates job | All users |
| `job-deleted` | Admin deletes job | All users |

## 🧪 Testing

```bash
npm test  # Runs authentication test suite
```

## 🗄️ Database

**15+ Indexes:** createdAt, salary, experience, location, text search (title/company/location)  
**Transactions:** Multi-document operations (job application flow)  
**Soft Deletes:** Audit trail with isDeleted + deletedAt

## 📝 Logging

Winston logger → Console + `logs/error.log` + `logs/combined.log`

---

See [Main README](../README.md) for full project documentation.

# 🎯 JobFinder - Full Stack Job Portal

A full-stack MERN job portal built for learning and demonstrating web development skills. Features dual authentication (user/admin), real-time notifications via WebSocket, file uploads with GridFS, and RESTful API design.

**🔗 Live Demo:** [https://job-finder-pink-six.vercel.app](https://job-finder-pink-six.vercel.app)  
**📚 Tech Stack:** MongoDB · Express.js · React 19 · Node.js  
**🚀 Deployment:** Render (Backend) + Vercel (Frontend)

---

## � Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack-details)
- [Demo Access](#-demo-access)
- [Architecture](#-architecture-overview)
- [Security](#-security-features)
- [Local Setup](#-local-setup-guide)
- [API Reference](#-api-reference)
- [Database Design](#-database-design)
- [Deployment](#-deployment-guide)
- [Testing](#-testing)

---

## ✨ Key Features

### 🔐 Dual Authentication System
- **User Portal**: JWT-based authentication with secure password hashing (bcrypt, 10 salt rounds)
- **Admin Portal**: Separate authentication flow with role-based access control
- **Session Management**: 5-hour token expiration with secure storage

### 💼 Job Management
- **Advanced Search**: Filter by experience level, salary range, location, and job type
- **Real-time Updates**: Socket.io WebSocket for instant job postings
- **Pagination**: Efficient data loading (default 50 items/page, customizable)
- **CRUD Operations**: Full admin control over job listings

### 👤 User Features
- **Profile Management**: Complete profile with photo and resume uploads
- **Application Tracking**: Real-time status updates (Pending → Under Review → Shortlisted/Rejected)
- **Job Bookmarks**: Save jobs for later viewing
- **File Upload**: PDF/DOC/DOCX resume support (up to 5MB) with GridFS storage
- **Application History**: View all applied jobs with current status

### 🎛️ Admin Dashboard
- **Analytics**: Real-time statistics (total users, jobs, applications)
- **Applicant Management**: View applicant profiles, download resumes, update statuses
- **Multi-Admin System**: Create and manage multiple admin accounts (default admin protection)
- **User Management**: View and manage all registered users
- **Instant Notifications**: WebSocket alerts for new applications

### ⚡ Real-time Capabilities
- **WebSocket Integration**: Socket.io 4.6.1 for bidirectional communication
- **Room-based Messaging**: Separate channels for users and admins
- **Live Notifications**: Instant updates for job posts, applications, and status changes
- **Auto-reconnection**: Exponential backoff retry logic

---

## 🛠 Tech Stack Details

### Backend Architecture
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v16+ | Runtime environment |
| **Express.js** | 4.21.2 | Web framework with MVC pattern |
| **MongoDB** | Atlas | Cloud database with Mongoose ODM 8.18.2 |
| **GridFS** | Built-in | File storage (resumes, photos) |
| **Socket.io** | 4.6.1 | Real-time WebSocket server |
| **JWT** | 9.0.2 | Stateless authentication |
| **bcryptjs** | 3.0.2 | Password hashing |
| **Winston** | 3.11.0 | Structured logging |

### Security Stack
| Package | Purpose |
|---------|---------|
| **helmet** | HTTP security headers (XSS, clickjacking, MIME sniffing) |
| **express-rate-limit** | DoS protection (100 req/15min API, 5 req/15min auth) |
| **xss-clean** | Cross-site scripting prevention |
| **express-mongo-sanitize** | NoSQL injection prevention |
| **express-validator** | Input validation with 20+ validation rules |

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI library with Hooks |
| **Material-UI** | 7.3.2 | Component library and design system |
| **React Router** | 7.9.2 | Client-side routing |
| **Axios** | 1.12.2 | HTTP client with retry logic |
| **Socket.io-client** | 4.6.1 | Real-time client |
| **jwt-decode** | 4.0.0 | Token parsing |

---

## 🎭 Demo Access

### User Portal
```
Email: daksh.varshneya@gmail.com
Password: User@1234
```
**Capabilities:**
- Browse and filter jobs
- Apply for positions
- Upload resume
- Track application status
- Bookmark jobs

**Routes:** `/`, `/browse`, `/applications`, `/bookmarks`, `/dashboard`

### Admin Portal
```
Username: admin
Password: Newadmin@2025
```
**Capabilities:**
- View dashboard analytics
- Create/edit/delete jobs
- Manage applicants
- Update application statuses
- Download resumes
- Manage users and admins

**Routes:** `/admin-dashboard`, `/admin-jobs`, `/admin-users`, `/admin-admins`

> **Project Note:** This is a learning project. Demo data includes 6 sample users, 9 jobs, and 5 applications.

---

## 🏗️ Architecture Overview

### MVC Pattern Implementation
```
backend/
├── models/          # Mongoose schemas (User, Job, Admin)
├── controllers/     # Business logic layer
├── routes/          # API endpoint definitions
├── middleware/      # Auth, validation, error handling
├── config/          # Database, Socket.io, GridFS, constants
└── tests/           # Authentication test suite
```

### Key Design Patterns
1. **Centralized Error Handling**: Custom `APIError` class with async wrapper
2. **Transaction-based Operations**: MongoDB sessions for data consistency
3. **Soft Delete Pattern**: Audit trail with `isDeleted` + `deletedAt`
4. **Constants Centralization**: No magic strings, single source of truth
5. **Middleware Pipeline**: Auth → Validation → Rate Limiting → Business Logic

### Database Optimization
- **15+ Strategic Indexes**: Query performance optimization
  - Single-field indexes: `createdAt`, `salary`, `experienceRequired`, `location`, `jobType`
  - Compound indexes: `{isDeleted: 1, createdAt: -1}`, `{experience: 1, salary: 1}`
  - Text search index: `{title: 'text', companyName: 'text', location: 'text'}`
- **Connection Pooling**: Min 2, Max 10 concurrent connections
- **Retry Logic**: 5 attempts with exponential backoff (5s → 60s cap)

### File Upload Architecture
```
User Upload → Multer (memory) → Validation → GridFS → MongoDB
                                    ↓
                        MIME check + Extension + Size + Magic Numbers
```

---

## 🔒 Security Features

### Authentication & Authorization
- **Password Security**: bcrypt hashing with 10 salt rounds
- **JWT Tokens**: HS256 algorithm, 5-hour expiration
- **Dual Token System**: Separate tokens for users and admins
- **Role-based Access**: Protected routes with `authUser` and `authAdmin` middleware
- **Default Admin Protection**: Cannot delete the root admin account

### Input Validation
- **express-validator**: Comprehensive validation rules
  - Email format validation
  - Password strength: min 8 chars, uppercase, lowercase, number, special char
  - File type and size validation
  - SQL injection prevention through type checking

### Rate Limiting
```javascript
API Endpoints:     100 requests / 15 minutes / IP
Auth Endpoints:    5 attempts / 15 minutes / IP
File Uploads:      10 uploads / 15 minutes / IP
```

### File Upload Security
- **MIME Type Validation**: Only PDF, DOC, DOCX, JPG, PNG
- **Extension Validation**: Double-check file extensions
- **Magic Number Verification**: Validate file signatures
- **Size Limits**: 2MB for photos, 5MB for resumes
- **GridFS Isolation**: Files stored separately from code

### Network Security
- **CORS**: Whitelist specific frontend origin
- **Helmet**: 11 security headers (CSP, HSTS, X-Frame-Options, etc.)
- **NoSQL Injection**: Sanitize MongoDB queries
- **XSS Prevention**: Clean user input before storage

---

## 💻 Local Setup Guide

### Prerequisites
```
Node.js ≥ v16  
MongoDB Atlas account (or local MongoDB 5.0+)
npm ≥ v8
```

### 1. Clone & Install
```bash
git clone https://github.com/MOKSH88888/JobFinder.git
cd JobFinder

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job_portal_db
JWT_SECRET=dev-secret-change-in-production
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=Admin@123
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 3. Seed Database
```bash
cd backend
npm run seed
```
Creates: 1 admin, 6 users, 9 jobs, 5 applications, 8 bookmarks

> **Note:** Sample users use password `User@1234` for demo purposes only. Admin password is set via environment variable.

### 4. Start Development
```bash
# Terminal 1 - Backend (http://localhost:5000)
cd backend
npm start

# Terminal 2 - Frontend (http://localhost:3000)
cd frontend
npm start
```

### 5. Run Tests
```bash
cd backend
npm test
```

---

## 📡 API Reference

### Full API Documentation
Access live API docs at: `GET /api/docs`

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/admin/login` | Admin login | Public |

### Jobs (Public)
| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/jobs` | Get all jobs | `?experience=0&salary=500000&page=1&limit=20` |
| GET | `/api/jobs/:id` | Get job details | - |

### User Protected Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile (multipart/form-data) |
| POST | `/api/users/jobs/:id/apply` | Apply for job |
| DELETE | `/api/users/jobs/:id/withdraw` | Withdraw application |
| GET | `/api/users/applied-jobs` | Get all applications |
| POST | `/api/users/jobs/:id/bookmark` | Bookmark job |
| DELETE | `/api/users/jobs/:id/bookmark` | Remove bookmark |
| GET | `/api/users/bookmarked-jobs` | Get bookmarked jobs |

### Admin Protected Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/jobs?page=1&limit=20` | Get all jobs (paginated) |
| POST | `/api/admin/jobs` | Create job |
| PUT | `/api/admin/jobs/:id` | Update job |
| DELETE | `/api/admin/jobs/:id` | Soft delete job |
| GET | `/api/admin/jobs/:jobId/applicants` | View all applicants |
| PATCH | `/api/admin/jobs/:jobId/applicants/:applicantId/status` | Update application status |
| GET | `/api/admin/users?page=1&limit=20` | Get all users (paginated) |
| DELETE | `/api/admin/users/:id` | Soft delete user |
| GET | `/api/admin/admins` | Get all admins |
| POST | `/api/admin/admins` | Create admin (default admin only) |
| DELETE | `/api/admin/admins/:id` | Delete admin (default admin only) |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | System health check |
| GET | `/api/docs` | Complete API documentation |
| GET | `/api/files/:fileId` | Download file from GridFS |

---

## 🗄️ Database Design

### User Model
```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phone: String,
  gender: Enum ['Male', 'Female', 'Other'],
  experience: Number (years, default: 0),
  skills: [String],
  description: String,
  profilePhoto: String (GridFS URL),
  resume: String (GridFS URL),
  appliedJobs: [{
    jobId: ObjectId (ref: Job),
    appliedAt: Date,
    status: Enum ['Pending', 'Under Review', 'Shortlisted', 'Rejected']
  }],
  bookmarkedJobs: [ObjectId] (ref: Job),
  isDeleted: Boolean,
  deletedAt: Date,
  timestamps: true
}
```

**Indexes**: `email (unique)`, `experience`, `skills`, `isDeleted`, `appliedJobs.jobId`, `bookmarkedJobs`

### Job Model
```javascript
{
  title: String (required),
  description: String (required),
  companyName: String (required),
  location: String (required),
  salary: Number (required),
  experienceRequired: Number (required),
  jobType: Enum ['Full-time', 'Part-time', 'Contract', 'Internship'],
  requirements: [String],
  postedBy: ObjectId (ref: Admin),
  applicants: [{
    userId: ObjectId (ref: User),
    appliedAt: Date,
    status: Enum ['Pending', 'Under Review', 'Shortlisted', 'Rejected']
  }],
  isDeleted: Boolean,
  deletedAt: Date,
  timestamps: true
}
```

**Indexes**: `createdAt`, `experienceRequired`, `salary`, `jobType`, `location`, `isDeleted`, `postedBy`, `applicants.userId`, `applicants.status`  
**Text Search**: `{title: 'text', companyName: 'text', location: 'text'}`  
**Compound Indexes**: 7 strategic combinations for multi-filter queries

### Admin Model
```javascript
{
  username: String (unique, required),
  password: String (hashed, required),
  isDefault: Boolean (prevents deletion)
}
```

**Indexes**: `username (unique)`, `isDefault`

---

## ⚡ Real-time Events

### WebSocket Events
| Event | Direction | Trigger | Recipients |
|-------|-----------|---------|-----------|
| `new-application` | Server → Client | User applies for job | All admins |
| `application-status-updated` | Server → Client | Admin changes status | Specific user |
| `new-job-posted` | Server → Client | Admin creates job | All users |
| `job-deleted` | Server → Client | Admin deletes job | All users |

### Room Structure
```
Socket.io Rooms:
├── user:{userId}    # Individual user notifications
├── admin-room       # All admin notifications
└── users-room       # All user notifications
```

---

## 🚀 Deployment Guide

### Application Structure
This project deploys as a **single-page application** with dual authentication:
- **User Portal**: Main application routes (/, /browse, /applications, etc.)
- **Admin Portal**: Admin management routes (/admin-dashboard, /admin-jobs, etc.)
- **Deployment**: One React SPA on Vercel + One Node.js API on Render

### MongoDB Atlas Setup
1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with password
3. Whitelist all IPs: `0.0.0.0/0` (for Render/Vercel)
4. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/job_portal_db?retryWrites=true&w=majority`

### Deploy Backend (Render)
1. Connect GitHub repo to Render
2. Configure environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=<your-atlas-connection-string>
   JWT_SECRET=<generate-with-crypto-randomBytes-64-chars>
   DEFAULT_ADMIN_USERNAME=admin
   DEFAULT_ADMIN_PASSWORD=<secure-password-min-12-chars>
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Deploy and copy backend URL

### Deploy Frontend (Vercel)
1. Import project from GitHub
2. Set root directory to `frontend`
3. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   REACT_APP_API_BASE_URL=https://your-backend.onrender.com/api
   GENERATE_SOURCEMAP=false
   CI=true
   ```
4. Deploy and copy frontend URL
5. Update `FRONTEND_URL` in Render backend
6. Redeploy backend for CORS update

> **Note:** Vercel builds automatically. The `build/` folder is generated during CI/CD and is not committed to Git.

### Post-Deployment
```bash
# Seed production database (via Render Shell or locally)
node config/seedDatabase.js

# Verify health
curl https://your-backend.onrender.com/api/health
```

---

## 🧪 Testing

### Automated Tests
```bash
cd backend
npm test
```

**Coverage:**
- User registration and validation
- User and admin login flows
- Invalid credential handling
- Duplicate registration prevention

### Manual Testing
- User registration and login flow
- File upload (resume and profile photo)
- Job application process
- Real-time notifications via Socket.io
- Admin CRUD operations on jobs
- Application status updates
- Job bookmarking
- Health check endpoint verification

---

## 📊 Project Metrics

### Backend
- **API Response Time**: < 200ms (avg)
- **Database Queries**: Indexed for O(log n) lookups
- **File Upload**: Streaming to GridFS (memory efficient)
- **WebSocket Latency**: < 50ms

### Frontend
- **Build Size**: ~800KB (gzipped)
- **Initial Load**: < 2s (first contentful paint)
- **Performance**: Lighthouse score 90+

---

## 📚 Learning Outcomes

This project demonstrates practical implementation of:
- RESTful API design with Express.js
- MVC architecture pattern
- Authentication and authorization (JWT, bcrypt)
- Real-time bidirectional communication (Socket.io)
- File handling and GridFS storage
- Modern React development (Hooks, Context API, Material-UI)
- Database design and optimization (indexing, transactions)
- Security best practices (rate limiting, input validation, XSS prevention)

---

## 🔧 Configuration Files

### Backend
- **`config/constants.js`** - Centralized app configuration (rate limits, file limits, enums)
- **`render.yaml`** - Render deployment configuration
- **`package.json`** - Dependencies and scripts

### Frontend
- **`vercel.json`** - Vercel deployment config (SPA routing rewrites)
- **`package.json`** - Dependencies and build scripts
- **`src/theme.js`** - Material-UI customization

---

## 📝 License

MIT License

---

## 👨‍💻 Developer

**Daksh Varshneya**  
📧 Email: daksh.varshneya@gmail.com  
🐙 GitHub: [@MOKSH88888](https://github.com/MOKSH88888)

---

**Built with the MERN Stack**

*Last Updated: January 2026*

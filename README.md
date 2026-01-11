# 🎯 JobFinder - Full Stack Job Portal

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socketdotio&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

A full-stack MERN job portal built to learn and practice web development concepts. Features include dual authentication (user/admin), real-time notifications using Socket.io, file uploads with GridFS, and RESTful API implementation.

**Live Demo:**  
- **User Portal:** [https://jobfinder-nine-jet.vercel.app](https://jobfinder-nine-jet.vercel.app)  
- **Admin Dashboard:** [https://jobfinder-nine-jet.vercel.app/admin-dashboard](https://jobfinder-nine-jet.vercel.app/admin-dashboard)

**Tech Stack:** MongoDB · Express.js · React 19 · Node.js  
**Deployment:** Render (Backend) + Vercel (Frontend)

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Demo Access](#demo-access)
- [Documentation](#documentation)
- [Testing](#testing)
- [License](#license)

---

## Key Features

### 🔐 Dual Authentication System
- **User Portal**: JWT-based authentication with bcrypt password hashing
- **Admin Portal**: Separate authentication with role-based access control
- **Session Management**: Token-based authentication with 5-hour expiration

### Job Management
- **Search & Filter**: Filter jobs by experience, salary, location, and job type
- **Real-time Updates**: Socket.io for instant job postings and notifications
- **Pagination**: Page-based data loading (default 50 items per page)
- **CRUD Operations**: Admin can create, edit, and delete job listings

### User Features
- **Profile Management**: Upload profile photo and resume using GridFS
- **Application Tracking**: Track application status in real-time
- **Job Bookmarks**: Save jobs for later viewing
- **File Upload**: Support for PDF/DOC/DOCX files (up to 5MB)
- **Application History**: View all job applications

### Admin Dashboard
- **Analytics**: View total users, jobs, and applications
- **Applicant Management**: View profiles, download resumes, update application status
- **Multi-Admin System**: Support for multiple admin accounts
- **User Management**: View and manage registered users
- **Notifications**: Real-time alerts for new applications

### Real-time Capabilities
- **Socket.io Integration**: Two-way communication between client and server
- **Room-based Messaging**: Separate channels for users and admins
- **Auto-reconnection**: Automatic retry on connection loss

---

## Tech Stack

### Backend
- **Runtime**: Node.js v16+ with Express.js 4.21.2
- **Database**: MongoDB Atlas with Mongoose ODM 8.18.2
- **Authentication**: JWT 9.0.2 + bcryptjs 3.0.2
- **Real-time**: Socket.io 4.6.1
- **Storage**: GridFS for file handling
- **Security**: Helmet, rate-limiting, XSS protection, NoSQL injection prevention
- **Logging**: Winston 3.11.0

### Frontend
- **Framework**: React 19.1.1 with Hooks
- **UI Library**: Material-UI 7.3.2
- **Routing**: React Router 7.9.2
- **HTTP Client**: Axios 1.12.2 with retry logic
- **Real-time**: Socket.io-client 4.6.1

### Deployment
- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier - may have cold starts)
- **Database**: MongoDB Atlas (free tier - 512MB storage)

---

## Quick Start

### Prerequisites
```bash
Node.js >= v16
MongoDB Atlas account (or local MongoDB 5.0+)
npm >= v8
```

### Installation

```bash
# Clone repository
git clone <your-repository-url>
cd JobFinder

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure environment variables

# Frontend setup
cd ../frontend
npm install
```

### Environment Configuration

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job_portal_db
JWT_SECRET=your-secret-key-change-in-production
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=Main@2026
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Seed Database

```bash
cd backend
npm run seed
```

Creates 6 users, 9 jobs, 5 applications, and 8 bookmarks for testing.

### Run Development Servers

```bash
# Terminal 1 - Backend (http://localhost:5000)
cd backend
npm start

# Terminal 2 - Frontend (http://localhost:3000)
cd frontend
npm start
```

---

## Demo Access

**User Portal:** `demo.user@example.com` / `Demo$45`  
Browse jobs, apply, upload resume, track applications, bookmark opportunities

**Admin Portal:** `testadmin` / `Check#2026`
View analytics, manage jobs, review applicants, update application statuses, receive real-time application notifications

---

## Documentation

Comprehensive documentation available in the `/docs` folder:

- **[API Reference](docs/API.md)** - Complete REST API endpoints with examples
- **[Database Design](docs/DATABASE.md)** - Schema definitions and relationships
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

### Quick Links

**Architecture**: MVC pattern with modular structure
- Models: Mongoose schemas (User, Job, Admin)
- Controllers: Business logic layer
- Routes: API endpoint definitions
- Middleware: Authentication, validation, error handling

**Security Features**:
- JWT authentication with 5-hour expiration
- bcrypt password hashing (10 salt rounds)
- Rate limiting (API: 100 req/15min, Auth: 5 req/15min)
- Helmet security headers
- XSS and NoSQL injection protection
- File upload validation (MIME type, size, magic numbers)

**Database Optimization**:
- 15+ strategic indexes for performance
- Text search capabilities
- Connection pooling (min: 2, max: 10)
- Soft delete pattern with audit trail

---

## Testing

```bash
cd backend
npm test  # Runs authentication and validation tests
```

For comprehensive testing checklist, see [MANUAL_TESTING_GUIDE.md](MANUAL_TESTING_GUIDE.md)

---

## Project Structure

```
JobFinder/
├── backend/          # Express API server (MVC pattern)
├── frontend/         # React application
└── docs/             # API, Database, and Deployment guides
```

---

## Known Limitations

As this is a learning project, there are some known limitations:

- **Free Tier Hosting**: Backend on Render free tier has cold starts (~30s delay after inactivity)
- **File Storage**: GridFS used for simplicity; cloud storage (AWS S3) would be better for production
- **Email Notifications**: Not implemented; only in-app notifications via Socket.io
- **Payment Integration**: Not included as it's outside the project scope
- **Search Optimization**: Basic text search; could be improved with Elasticsearch
- **Testing Coverage**: Only authentication tests implemented; needs more comprehensive test suite

---

## What I Learned

Key concepts practiced in this project:

- Building RESTful APIs with Express.js
- User authentication and authorization using JWT
- Real-time communication with Socket.io
- File upload handling with GridFS
- React state management with Context API
- MongoDB database design and indexing
- Frontend-backend integration
- Deployment on cloud platforms (Vercel & Render)

---

## License

MIT License

---

## Developer

**Moksh**  
GitHub: [@MOKSH88888](https://github.com/MOKSH88888)  
Live Demo: [JobFinder Platform](https://jobfinder-nine-jet.vercel.app)

---

**Built with the MERN Stack**

*Last Updated: January 2026*

# JobFinder - Job Portal Platform

A full-stack MERN job portal with real-time notifications, dual authentication, and enterprise security. Built for scalable deployment on Render (backend) and Vercel (frontend).

## 🚀 Key Features

### For Job Seekers
- JWT-based secure authentication
- Advanced job search with filters (experience, salary, location, type)
- Resume upload (PDF/DOC/DOCX, max 5MB) with GridFS storage
- Real-time application status notifications via WebSocket
- Job bookmarking and application tracking
- Profile management with photo and resume uploads

### For Administrators
- Comprehensive dashboard with analytics
- Full CRUD operations on job postings
- Applicant management with resume downloads
- Multi-admin system with role management
- Real-time notifications for new applications
- User management portal

### Real-time Capabilities
- WebSocket-powered instant notifications
- Live job updates across all connected clients
- Room-based messaging (separate channels for users/admins)
- Auto-reconnection with exponential backoff

## 🛠️ Tech Stack

**Backend**
- Express.js 4.21.2 on Node.js
- MongoDB Atlas with Mongoose 8.18.2
- Socket.io 4.6.1 for WebSocket
- JWT 9.0.2 + bcryptjs 3.0.2 for authentication
- MongoDB GridFS for file storage
- Winston 3.11.0 for structured logging

**Security**
- Helmet (HTTP headers)
- express-rate-limit (100 req/15min API, 5 req/15min auth)
- xss-clean (XSS prevention)
- express-mongo-sanitize (NoSQL injection prevention)
- express-validator (input validation)

**Frontend**
- React 19.1.1 with Hooks
- Material-UI 7.3.2
- React Router 7.9.2
- Axios 1.12.2 with retry logic
- Socket.io-client 4.6.1

## 📋 Prerequisites

- Node.js v16+ (recommended v18 LTS)
- MongoDB Atlas account (or local MongoDB 5.0+)
- npm v8+ or yarn

## ⚙️ Local Development Setup

### 1. Clone & Install

```bash
git clone <repository-url>
cd JobFinder

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

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

### 3. Seed Database (Optional)

```bash
cd backend
node config/seedDatabase.js
```

Creates:
- 1 admin user (username: admin)
- 8 test users with profiles
- 10 sample job postings
- 6 applications

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Portal: http://localhost:3000/admin/login

## 🔐 Default Credentials

**Admin Login:**
- Username: `admin`
- Password: `YourSecurePassword@2025` (set in .env)

**Test User** (after seeding):
- Email: `test@example.com`
- Password: `User@1234`

## 📂 Project Structure

```
JobFinder/
├── backend/
│   ├── config/          # Configuration files (DB, logger, socket, GridFS)
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, error handling, file upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   └── server.js        # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/         # Axios configuration
│       ├── components/  # Reusable components
│       ├── context/     # React context (Auth, Socket)
│       ├── pages/       # Page components
│       └── utils/       # Utilities
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Jobs (Public)
- `GET /api/jobs` - Get all jobs with filters
- `GET /api/jobs/:id` - Get job details

### User (Protected)
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile (with file upload)
- `POST /api/users/jobs/:id/apply` - Apply for job
- `GET /api/users/applied-jobs` - Get applications
- `POST /api/users/jobs/:id/bookmark` - Bookmark job

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/jobs` - Create job
- `PUT /api/admin/jobs/:id` - Update job
- `DELETE /api/admin/jobs/:id` - Delete job
- `GET /api/admin/jobs/:jobId/applicants` - View applicants
- `PATCH /api/admin/jobs/:jobId/applicants/:applicantId/status` - Update status

## 🧪 Testing

Run security checks:
```bash
cd backend
npm test
```

## 🚀 Production Deployment

### Step 1: Deploy Backend to Render

1. **Create MongoDB Atlas Cluster**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster and database user
   - Whitelist all IPs (0.0.0.0/0) for Render
   - Copy connection string

2. **Deploy to Render**
   - Connect GitHub repository to Render
   - Render auto-detects `render.yaml` configuration
   - Set environment variables in Render dashboard:
     ```
     MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_portal_db
     JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
     DEFAULT_ADMIN_PASSWORD=<secure-password>
     FRONTEND_URL=https://your-app.vercel.app (update after Step 2)
     ```
   - Deploy and copy the backend URL (e.g., `https://job-portal-backend.onrender.com`)

3. **Seed Production Database**
   ```bash
   # Run seed script via Render Shell or locally with production MONGO_URI
   node config/seedDatabase.js
   ```

### Step 2: Deploy Frontend to Vercel

1. **Update Environment Variables**
   - Edit `frontend/.env` with your Render backend URL:
     ```env
     REACT_APP_API_URL=https://job-portal-backend.onrender.com
     REACT_APP_API_BASE_URL=https://job-portal-backend.onrender.com/api
     ```

2. **Deploy to Vercel**
   - Import project from GitHub at [vercel.com](https://vercel.com)
   - Vercel auto-detects React app and `vercel.json`
   - Add environment variables in Vercel dashboard
   - Deploy and copy the Vercel URL

3. **Update Backend CORS**
   - Return to Render dashboard
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy backend

### Post-Deployment Checklist

- ✅ Test admin login at `https://your-app.vercel.app/admin/login`
- ✅ Verify WebSocket connection (check browser console)
- ✅ Test file uploads (resume upload)
- ✅ Check real-time notifications
- ✅ Monitor Render logs for errors
- ✅ Change default admin password immediately

## 🔒 Security Features

- **Authentication:** JWT with 5-hour expiration
- **Password Hashing:** bcrypt with 10 salt rounds
- **Rate Limiting:** 100 requests/15min (API), 5 attempts/15min (auth), 10 uploads/15min
- **Input Validation:** express-validator on all inputs
- **XSS Protection:** xss-clean middleware
- **NoSQL Injection:** express-mongo-sanitize
- **File Validation:** MIME type, extension, and size checks
- **Soft Deletes:** Audit trail for users and jobs
- **Database Transactions:** Data consistency for critical operations

## 📊 Database Schema

### User
- Authentication (email, password)
- Profile (name, phone, gender, experience, skills, description)
- Files (profilePhoto, resume)
- Applications (appliedJobs with status)
- Bookmarks
- Soft delete (isDeleted, deletedAt)

### Job
- Details (title, description, company, location, salary, experience)
- Type (Full-time, Part-time, Contract, Internship)
- Requirements
- Applicants (with status)
- Metadata (postedBy, timestamps)
- Soft delete (isDeleted, deletedAt)

### Admin
- Credentials (username, password)
- isDefault flag (prevents deletion)

## 🔄 Real-time Events

| Event | Trigger | Recipients |
|-------|---------|-----------|
| `new-application` | User applies for job | All admins |
| `application-status-updated` | Admin changes status | Specific user |
| `new-job-posted` | Admin creates job | All users |
| `job-deleted` | Admin deletes job | All users |

## 📝 Notes

- **File Storage:** MongoDB GridFS for resumes and profile photos
- **WebSocket:** Separate rooms for users and admins
- **Logging:** Winston logger with file rotation
- **Error Handling:** Centralized with async/await wrappers
- **Database:** Transactions for multi-document operations

## 👨‍💻 Development

- Follow MVC architecture pattern
- Use async/await for all async operations
- Implement proper error handling with try-catch
- Log important events with Winston
- Validate all inputs on both client and server
- Use transactions for operations affecting multiple collections

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

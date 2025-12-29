# Frontend - Job Portal UI

Modern React SPA with Material-UI design system and real-time WebSocket capabilities. Optimized for Vercel deployment.

## Quick Start

```bash
npm install
npm start          # Development server (http://localhost:3000)
npm run build      # Production build
```

**Local Development:** http://localhost:3000  
**Full Documentation:** [Main README](../README.md)

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|----------|
| Framework | React | 19.1.1 | UI library with Hooks |
| UI Components | Material-UI | 7.3.2 | Design system |
| Routing | React Router | 7.9.2 | Client-side routing |
| HTTP Client | Axios | 1.12.2 | API requests with retry |
| WebSocket | Socket.io-client | 4.6.1 | Real-time updates |
| State | React Context | Built-in | Auth & Socket state |
| Build Tool | Create React App | 5.0.1 | Build configuration |

## Environment Variables

**Development** (`.env.local`):
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

**Production** (`.env` - for Vercel):
```env
REACT_APP_API_URL=https://job-portal-backend.onrender.com
REACT_APP_API_BASE_URL=https://job-portal-backend.onrender.com/api
GENERATE_SOURCEMAP=false
CI=true
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Development server with hot reload |
| `npm run build` | Production build to `build/` directory |
| `npm test` | Run test suite in watch mode |
| `npm run eject` | Eject from CRA (⚠️ one-way operation) |

## Deployment (Vercel)

**Automatic Deployment via `vercel.json`:**

1. Import project from GitHub on [vercel.com](https://vercel.com)
2. Vercel auto-detects React app
3. Add environment variables in Vercel dashboard
4. Deploy

**Configuration:**
- Framework: Create React App
- Build Command: `npm run build` (auto-detected)
- Output Directory: `build` (auto-detected)
- Install Command: `npm install` (auto-detected)

**Environment Variables in Vercel:**
```
REACT_APP_API_URL = https://your-backend.onrender.com
REACT_APP_API_BASE_URL = https://your-backend.onrender.com/api
```

## Key Features

- **Dual Authentication:** Separate portals for Users and Admins
- **Real-time Updates:** WebSocket notifications for instant updates
- **Protected Routes:** Role-based access control
- **Job Search:** Advanced filters (experience, salary, location, type)
- **Application Management:** Track applications, view status updates
- **File Uploads:** Resume and profile photo with validation
- **Bookmarks:** Save favorite jobs
- **Responsive Design:** Mobile-friendly Material-UI components

## User Portal Features

- Browse and search job listings
- Apply for jobs with resume upload
- Track application status
- Bookmark favorite jobs
- Update profile and resume
- Real-time notifications for status changes

## Admin Portal Features

- Dashboard with statistics
- Create, edit, and delete job postings
- View and manage applicants
- Update application status
- User management
- Multi-admin system
- Real-time notifications for new applications

## Project Structure

```
frontend/
├── public/          # Static files
└── src/
    ├── api/         # Axios instance and interceptors
    ├── components/  # Reusable components
    │   ├── Navbar.js
    │   ├── Footer.js
    │   ├── JobCard.js
    │   └── Protected routes
    ├── context/     # React Context
    │   ├── AuthContext.js    # Authentication state
    │   └── SocketContext.js  # WebSocket connection
    ├── pages/       # Page components
    │   ├── User pages (Home, Dashboard, Jobs, etc.)
    │   └── Admin pages (Dashboard, Jobs, Users, etc.)
    ├── utils/       # Helper functions
    ├── App.js       # Main app component with routes
    └── index.js     # Application entry point
```

## Development Guidelines

- Use functional components with hooks
- Manage authentication state via AuthContext
- WebSocket connection via SocketContext
- Protected routes for authenticated pages
- Material-UI for consistent styling
- Error boundaries for graceful error handling

## Troubleshooting

**Common Issues:**

1. **CORS Errors:** Ensure backend allows frontend origin
2. **WebSocket Not Connecting:** Check `REACT_APP_API_BASE_URL` in `.env`
3. **Login Issues:** Clear browser localStorage (F12 → Application → Clear)
4. **Build Errors:** Delete `node_modules` and `package-lock.json`, reinstall

---

**See [main README](../README.md) for installation, deployment, and API documentation**

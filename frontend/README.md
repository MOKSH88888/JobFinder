# Frontend Application Documentation

Modern React SPA for JobFinder job portal with Material-UI and real-time features.

## 🚀 Quick Start

```bash
npm install
echo "REACT_APP_API_URL=http://localhost:5000" > .env
echo "REACT_APP_API_BASE_URL=http://localhost:5000/api" >> .env
npm start  # http://localhost:3000
```

## 🛠️ Tech Stack

**Core:** React 19.1.1 (Hooks) • React Router 7.9.2 • Material-UI 7.3.2  
**HTTP:** Axios 1.12.2 (auto-retry, JWT interceptors)  
**Real-time:** Socket.io-client 4.6.1 (WebSocket notifications)  
**Auth:** jwt-decode 4.0.0 • localStorage token management

## 📂 Architecture

```
src/
├── api/          # Axios instance + API endpoints
├── components/   # Navbar, Footer, JobCard, ProtectedRoutes
├── context/      # AuthContext (global auth state)
├── pages/        # 13 pages (User: 7, Admin: 5, Public: 1)
├── utils/        # constants, errorHandler
└── theme.js      # Material-UI customization
```

## 🎨 Features

**User Portal:** Job search/filters, resume upload, application tracking, bookmarks, real-time status updates  
**Admin Portal:** Analytics dashboard, job CRUD, applicant management, multi-admin system  
**Real-time:** Socket.io notifications, auto-reconnect, toast alerts

## 🔐 Authentication

**User:** JWT in `localStorage.token` → `UserProtectedRoute` → Auto-attach to API requests  
**Admin:** JWT in `localStorage.adminToken` → `AdminProtectedRoute` → Separate admin endpoints

## 🌐 Environment Variables

```env
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_API_BASE_URL=https://your-backend.onrender.com/api
GENERATE_SOURCEMAP=false  # Production only
CI=true  # Vercel deployment
```

## 🚀 Build & Deploy

```bash
npm run build  # Creates optimized build/ directory
```

**Vercel:** Auto-deploy on push, SPA routing via `vercel.json` rewrites

## 📱 Responsive Design

Mobile-first with Material-UI Grid (12-column), responsive Drawer navigation, optimized Card components.

## 🔔 Real-time Events

```javascript
socket.on('application-status-updated', ({ jobTitle, status }) => {
  toast.success(`${jobTitle}: ${status}`);
});
```

## 📤 File Upload

```javascript
const formData = new FormData();
formData.append('resume', file);
await api.put('/users/profile', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

---

See [Main README](../README.md) for full project documentation.

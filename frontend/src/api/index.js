// src/api/index.js

import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create an Axios instance with a base URL from environment variable and timeout
const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000 // 30 second timeout
});

// Configure automatic retry logic for network errors
axiosRetry(API, {
  retries: 3, // Retry failed requests up to 3 times
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff delay
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) 
      || error.response?.status === 429;
  }
});

// Request interceptor: Automatically attach JWT token to all API requests
// Token selection is based on the request URL (admin vs user routes)
API.interceptors.request.use((req) => {
  // Determine which token to use based on the request URL
  let token;
  
  if (req.url.includes('/admin')) {
    // Admin routes use adminToken
    token = localStorage.getItem('adminToken');
  } else if (req.url.includes('/users') || req.url.includes('/jobs')) {
    // User routes use userToken
    token = localStorage.getItem('userToken');
  } else {
    // For auth routes, check both (login doesn't need token)
    token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
  }
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// === Authentication Routes ===
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginAdmin = (formData) => API.post('/auth/admin/login', formData);

// === User Routes ===
export const getUserProfile = () => API.get('/users/profile');
export const updateUserProfile = (formData) => API.put('/users/profile', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 120000 // 2 minutes for file uploads
});
export const getAppliedJobs = () => API.get('/users/applied-jobs');

// === Job Routes ===
export const fetchJobs = (params) => API.get('/jobs', { params });
export const fetchJobById = (id) => API.get(`/jobs/${id}`);
export const applyForJob = (id) => API.post(`/users/jobs/${id}/apply`);
export const withdrawApplication = (id) => API.delete(`/users/jobs/${id}/withdraw`);

// === Bookmark Routes ===
export const bookmarkJob = (id) => API.post(`/users/jobs/${id}/bookmark`);
export const removeBookmark = (id) => API.delete(`/users/jobs/${id}/bookmark`);
export const getBookmarkedJobs = () => API.get('/users/bookmarked-jobs');

// === Admin Routes ===
export const getAdminProfile = () => API.get('/admin/profile');
export const adminGetAllAdmins = () => API.get('/admin');
export const adminAddAdmin = (adminData) => API.post('/admin/add', adminData);
export const adminDeleteAdmin = (id) => API.delete(`/admin/${id}`);
export const adminGetAllUsers = () => API.get('/admin/users');
export const adminAddJob = (jobData) => API.post('/admin/jobs', jobData);
export const adminUpdateJob = (id, jobData) => API.put(`/admin/jobs/${id}`, jobData);
export const adminDeleteJob = (id) => API.delete(`/admin/jobs/${id}`);
export const adminGetJobApplicants = (jobId) => API.get(`/admin/jobs/${jobId}/applicants`);
export const adminUpdateApplicationStatus = (jobId, userId, status) => 
  API.put('/admin/application-status', { jobId, userId, status });

export default API;
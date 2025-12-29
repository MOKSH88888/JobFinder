// src/pages/AdminJobsPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Fade,
  IconButton,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import AdminLayout from '../components/admin/AdminLayout';
import {
  validateJobTitle,
  validateCompanyName,
  validateLocation,
  validateSalary,
  validateExperience,
  validateDescription
} from '../utils/validation';

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    companyName: '',
    location: '',
    salary: '',
    experienceRequired: '',
    description: '',
    jobType: 'Full-time'
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/admin/jobs');
      const jobsArray = data?.jobs || [];
      setJobs(Array.isArray(jobsArray) ? jobsArray : []);
      setLoading(false);
    } catch (error) {
      setJobs([]);
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await API.delete(`/admin/jobs/${jobId}`);
      setMessage('Job deleted successfully');
      fetchJobs();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting job');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewJob({
      title: '',
      companyName: '',
      location: '',
      salary: '',
      experienceRequired: '',
      description: '',
      jobType: 'Full-time'
    });
    setValidationErrors({});
    setTouched({});
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'title':
        error = validateJobTitle(value);
        break;
      case 'companyName':
        error = validateCompanyName(value);
        break;
      case 'location':
        error = validateLocation(value);
        break;
      case 'salary':
        error = validateSalary(value);
        break;
      case 'experienceRequired':
        error = validateExperience(value);
        break;
      case 'description':
        error = validateDescription(value, 10, 5000);
        break;
      default:
        break;
    }
    
    setValidationErrors(prev => ({ ...prev, [name]: error || '' }));
    return error === null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const handleCreateJob = async () => {
    const errors = {
      title: validateJobTitle(newJob.title),
      companyName: validateCompanyName(newJob.companyName),
      location: validateLocation(newJob.location),
      salary: validateSalary(newJob.salary),
      experienceRequired: validateExperience(newJob.experienceRequired),
      description: validateDescription(newJob.description, 10, 5000)
    };
    
    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value !== null)
    );
    
    if (Object.keys(filteredErrors).length > 0) {
      setValidationErrors(filteredErrors);
      setTouched({
        title: true,
        companyName: true,
        location: true,
        salary: true,
        experienceRequired: true,
        description: true
      });
      setMessage('Please fix all validation errors before submitting');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    try {
      await API.post('/admin/jobs', newJob);
      setMessage('Job created successfully');
      handleCloseDialog();
      fetchJobs();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error creating job');
    }
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'Full-time': '#667eea',
      'Part-time': '#f093fb',
      'Contract': '#4facfe',
      'Internship': '#43e97b'
    };
    return colors[type] || '#667eea';
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box>
        <Fade in timeout={600}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom>
                Job Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create, manage, and monitor job postings
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 28px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Create New Job
            </Button>
          </Box>
        </Fade>

        {message && (
          <Fade in timeout={400}>
            <Alert
              severity={message.includes('successfully') ? 'success' : 'error'}
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          </Fade>
        )}

        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Job Title</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Salary</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Applicants</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                      <TableRow
                        key={job._id}
                        sx={{
                          '&:hover': { bgcolor: alpha('#667eea', 0.02) },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={600} color="#1e293b">
                            {job.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {job.experienceRequired === 0 ? 'Fresher' : `${job.experienceRequired} yrs exp`}
                          </Typography>
                        </TableCell>
                        <TableCell>{job.companyName}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                          <Typography fontWeight={600} color="#667eea">
                            ₹{job.salary?.toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={job.jobType}
                            size="small"
                            sx={{
                              bgcolor: alpha(getJobTypeColor(job.jobType), 0.1),
                              color: getJobTypeColor(job.jobType),
                              fontWeight: 600,
                              borderRadius: 1.5
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={job.applicants?.length || 0}
                            size="small"
                            sx={{
                              bgcolor: alpha('#667eea', 0.1),
                              color: '#667eea',
                              fontWeight: 700
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/admin-jobs/${job._id}/applicants`)}
                              sx={{
                                bgcolor: alpha('#667eea', 0.1),
                                color: '#667eea',
                                '&:hover': {
                                  bgcolor: alpha('#667eea', 0.2)
                                }
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(job._id)}
                              sx={{
                                bgcolor: alpha('#ef4444', 0.1),
                                color: '#ef4444',
                                '&:hover': {
                                  bgcolor: alpha('#ef4444', 0.2)
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <WorkIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                        <Typography color="text.secondary">
                          No jobs available. Create your first job posting.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Fade>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1.5rem' }}>
            Create New Job
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Job Title"
              name="title"
              value={newJob.title}
              onChange={handleInputChange}
              onBlur={handleBlur}
              margin="normal"
              required
              error={touched.title && !!validationErrors.title}
              helperText={touched.title && validationErrors.title}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={newJob.companyName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              margin="normal"
              required
              error={touched.companyName && !!validationErrors.companyName}
              helperText={touched.companyName && validationErrors.companyName}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={newJob.location}
              onChange={handleInputChange}
              onBlur={handleBlur}
              margin="normal"
              required
              error={touched.location && !!validationErrors.location}
              helperText={touched.location && validationErrors.location}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Salary"
              name="salary"
              type="number"
              value={newJob.salary}
              onChange={handleInputChange}
              onBlur={handleBlur}
              margin="normal"
              required
              error={touched.salary && !!validationErrors.salary}
              helperText={touched.salary && validationErrors.salary}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Experience Required (years)"
              name="experienceRequired"
              type="number"
              value={newJob.experienceRequired}
              onChange={handleInputChange}
              onBlur={handleBlur}
              margin="normal"
              required
              error={touched.experienceRequired && !!validationErrors.experienceRequired}
              helperText={touched.experienceRequired && validationErrors.experienceRequired}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              select
              label="Job Type"
              name="jobType"
              value={newJob.jobType}
              onChange={handleInputChange}
              margin="normal"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={newJob.description}
              onChange={handleInputChange}
              onBlur={handleBlur}
              margin="normal"
              multiline
              rows={4}
              required
              error={touched.description && !!validationErrors.description}
              helperText={touched.description && validationErrors.description}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateJob}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderRadius: 2,
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              Create Job
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default AdminJobsPage;

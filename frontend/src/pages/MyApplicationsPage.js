// src/pages/MyApplicationsPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getAppliedJobs } from '../api';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import NotificationToast from '../components/NotificationToast';

const getStatusBadge = (status) => {
  const statusLower = status?.toLowerCase();
  
  if (statusLower === 'shortlisted') {
    return {
      label: 'SHORTLISTED ⭐',
      icon: <StarIcon />,
      sx: {
        backgroundColor: '#10b981',
        color: 'white',
        fontWeight: 700,
        fontSize: '0.813rem',
        px: 2,
        py: 0.5,
        letterSpacing: '0.5px',
        '& .MuiChip-icon': { color: 'white', fontSize: 20 },
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        border: '2px solid #059669',
        animation: 'gentle-pulse 3s ease-in-out infinite',
        '@keyframes gentle-pulse': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)' }
        }
      }
    };
  }
  
  if (statusLower === 'rejected') {
    return {
      label: 'NOT SELECTED',
      icon: <CancelIcon />,
      sx: {
        backgroundColor: '#ef4444',
        color: 'white',
        fontWeight: 600,
        fontSize: '0.813rem',
        px: 2,
        py: 0.5,
        letterSpacing: '0.5px',
        '& .MuiChip-icon': { color: 'white', fontSize: 20 },
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
        border: '2px solid #dc2626'
      }
    };
  }
  
  if (statusLower === 'under review' || statusLower === 'reviewed') {
    return {
      label: 'UNDER REVIEW',
      sx: {
        backgroundColor: '#3b82f6',
        color: 'white',
        fontWeight: 600,
        fontSize: '0.813rem',
        px: 2,
        py: 0.5,
        letterSpacing: '0.5px',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
        border: '2px solid #2563eb'
      }
    };
  }
  
  // Default status for "Pending" or any unrecognized status
  return {
    label: 'PENDING',
    icon: <HourglassEmptyIcon />,
    sx: {
      backgroundColor: '#6b7280',
      color: 'white',
      fontWeight: 600,
      fontSize: '0.813rem',
      px: 2,
      py: 0.5,
      letterSpacing: '0.5px',
      '& .MuiChip-icon': { color: 'white', fontSize: 20 },
      boxShadow: '0 4px 12px rgba(107, 114, 128, 0.25)',
      border: '2px solid #4b5563'
    }
  };
};

const MyApplicationsPage = () => {
  const { user } = useAuth();
  const { socket, addNotification } = useSocket();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const { data } = await getAppliedJobs();
        // Extract appliedJobs from response wrapper
        const apps = data?.appliedJobs || [];
        setAppliedJobs(Array.isArray(apps) ? apps : []);
      } catch (error) {
        console.error("Failed to fetch applied jobs", error);
        setAppliedJobs([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  // Listen for application status updates via WebSocket
  useEffect(() => {
    if (!socket || !user) return;

    const handleStatusUpdate = (data) => {
      // Show professional toast notification
      setCurrentNotification(data);
      setShowNotification(true);
      
      // Add to notifications
      addNotification(data);
      
      // Update local state
      setAppliedJobs(prev => 
        Array.isArray(prev) ? prev.map(job => 
          job._id === data.jobId 
            ? { ...job, applicationStatus: data.status }
            : job
        ) : []
      );
    };

    socket.on('application-status-updated', handleStatusUpdate);

    return () => {
      socket.off('application-status-updated', handleStatusUpdate);
    };
  }, [socket, user, addNotification]);

  // Sort applications: Shortlisted/Rejected at top, then Under Review, then Pending
  const sortedApplications = useMemo(() => {
    // Defensive check - ensure appliedJobs is always an array
    if (!Array.isArray(appliedJobs)) {
      return [];
    }
    
    return [...appliedJobs].sort((a, b) => {
      const statusA = (a.applicationStatus || 'pending').toLowerCase();
      const statusB = (b.applicationStatus || 'pending').toLowerCase();
      
      // Priority: shortlisted/rejected first, then under review, then pending
      const getPriority = (status) => {
        if (status === 'shortlisted' || status === 'rejected') return 0;
        if (status === 'under review' || status === 'reviewed') return 1;
        return 2; // pending
      };
      
      const priorityDiff = getPriority(statusA) - getPriority(statusB);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Within same priority, sort by applied date (newest first)
      return new Date(b.appliedAt) - new Date(a.appliedAt);
    });
  }, [appliedJobs]);

  if (!user) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            My Applications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track all your job applications in one place
          </Typography>
          
          {/* Status Summary */}
          {Array.isArray(appliedJobs) && appliedJobs.length > 0 && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={`Total: ${appliedJobs.length}`}
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={`⭐ Shortlisted: ${appliedJobs.filter(j => (j.applicationStatus || 'pending').toLowerCase() === 'shortlisted').length}`}
                sx={{ 
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  fontWeight: 600
                }}
              />
              <Chip 
                label={`✗ Rejected: ${appliedJobs.filter(j => (j.applicationStatus || 'pending').toLowerCase() === 'rejected').length}`}
                sx={{ 
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  fontWeight: 600
                }}
              />
              <Chip 
                label={`👁️ Under Review: ${appliedJobs.filter(j => {
                  const status = (j.applicationStatus || 'pending').toLowerCase();
                  return status === 'under review' || status === 'reviewed';
                }).length}`}
                sx={{ 
                  backgroundColor: '#e3f2fd',
                  color: '#1565c0',
                  fontWeight: 600
                }}
              />
              <Chip 
                label={`📋 Pending: ${appliedJobs.filter(j => (j.applicationStatus || 'pending').toLowerCase() === 'pending').length}`}
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  color: '#616161',
                  fontWeight: 600
                }}
              />
            </Box>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : appliedJobs.length > 0 ? (
          <Grid container spacing={3}>
            {sortedApplications.map((job) => {
              const status = (job.applicationStatus || 'pending').toLowerCase();
              const isAccepted = status === 'accepted';
              const isRejected = status === 'rejected';
              const isUpdated = isAccepted || isRejected;
              
              return (
                <Grid item xs={12} md={6} lg={4} key={job._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      border: isAccepted ? '2px solid #4caf50' : isRejected ? '2px solid #f44336' : '1px solid #e0e0e0',
                      boxShadow: isUpdated ? 3 : 1,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isUpdated ? 6 : 4
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.companyName || 'Company not specified'}
                          </Typography>
                        </Box>
                        {isUpdated && (
                          <Chip 
                            label="Updated" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: '20px'
                            }}
                          />
                        )}
                      </Box>
                      
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {job.title || 'Untitled Job'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location || 'Location not specified'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CurrencyRupeeIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.salary && !isNaN(job.salary) ? `₹${Number(job.salary).toLocaleString('en-IN')} LPA` : 'Not disclosed'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip 
                          label={`${job.experienceRequired ?? 0} years`} 
                          size="small" 
                          icon={<WorkIcon />}
                        />
                        
                        {/* Professional Status Badge */}
                        <Chip 
                          label={getStatusBadge(status).label}
                          size="medium"
                          icon={getStatusBadge(status).icon}
                          sx={getStatusBadge(status).sx}
                        />
                      </Box>
                      
                      {job.appliedAt && (
                        <Typography variant="caption" color="text.secondary">
                          Applied: {new Date(job.appliedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        component={RouterLink} 
                        to={`/jobs/${job._id}`}
                        variant="outlined"
                        fullWidth
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Applications Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't applied for any jobs yet. Start exploring opportunities!
            </Typography>
            <Button 
              component={RouterLink} 
              to="/browse" 
              variant="contained"
              size="large"
            >
              Browse Jobs
            </Button>
          </Paper>
        )}
      </Container>
      
      {/* Professional Notification Toast */}
      <NotificationToast
        notification={currentNotification}
        open={showNotification}
        onClose={() => setShowNotification(false)}
        autoHideDuration={8000}
      />
    </Box>
  );
};

export default MyApplicationsPage;

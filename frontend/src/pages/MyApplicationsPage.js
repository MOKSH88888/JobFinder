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
  Grid,
  Tooltip
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BusinessIcon from '@mui/icons-material/Business';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationToast from '../components/NotificationToast';

// Helper function to calculate days since application
const getDaysSinceApplication = (appliedDate) => {
  if (!appliedDate) return null;
  const now = new Date();
  const applied = new Date(appliedDate);
  const diffTime = Math.abs(now - applied);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to get status-based action message
const getStatusActionMessage = (status, daysSince) => {
  const statusLower = status?.toLowerCase();
  
  if (statusLower === 'shortlisted') {
    return { 
      message: 'Congratulations! Prepare for the next round', 
      color: '#059669',
      icon: '🎉'
    };
  }
  
  if (statusLower === 'rejected') {
    return { 
      message: 'Keep applying - the right opportunity awaits', 
      color: '#dc2626',
      icon: '💪'
    };
  }
  
  if (statusLower === 'under review' || statusLower === 'reviewed') {
    if (daysSince > 7) {
      return { 
        message: 'Under review for over a week - stay patient', 
        color: '#2563eb',
        icon: '⏳'
      };
    }
    return { 
      message: 'Your application is being reviewed', 
      color: '#2563eb',
      icon: '👀'
    };
  }
  
  // Pending status
  if (daysSince > 14) {
    return { 
      message: 'No update in 2+ weeks - consider following up', 
      color: '#ea580c',
      icon: '📧'
    };
  }
  if (daysSince > 7) {
    return { 
      message: 'Application submitted - awaiting response', 
      color: '#78716c',
      icon: '⌛'
    };
  }
  return { 
    message: 'Recently applied - good luck!', 
    color: '#16a34a',
    icon: '🚀'
  };
};

const getStatusBadge = (status) => {
  const statusLower = status?.toLowerCase();
  
  if (statusLower === 'shortlisted') {
    return {
      label: 'SHORTLISTED',
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
      icon: <VisibilityIcon />,
      sx: {
        backgroundColor: '#3b82f6',
        color: 'white',
        fontWeight: 600,
        fontSize: '0.813rem',
        px: 2,
        py: 0.5,
        letterSpacing: '0.5px',
        '& .MuiChip-icon': { color: 'white', fontSize: 20 },
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
      // Only show toast notification for meaningful status changes (not Pending)
      if (data.status && data.status.toLowerCase() !== 'pending') {
        setCurrentNotification(data);
        setShowNotification(true);
      }
      
      // Add to notifications
      addNotification(data);
      
      // Update local state (always update UI regardless of notification)
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                My Applications
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track all your job applications in one place
              </Typography>
            </Box>
            
            {/* Application Stats Card */}
            {Array.isArray(appliedJobs) && appliedJobs.length > 0 && (
              <Paper 
                elevation={2}
                sx={{ 
                  px: 3, 
                  py: 2, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 2,
                  minWidth: 180
                }}
              >
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {appliedJobs.length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.95, fontSize: '0.75rem' }}>
                  Total Applications
                </Typography>
                <Box sx={{ mt: 1.5, display: 'flex', gap: 1.5, fontSize: '0.75rem' }}>
                  <Tooltip title="Success Rate">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption" fontWeight={600}>
                        {appliedJobs.length > 0 
                          ? Math.round((appliedJobs.filter(j => (j.applicationStatus || '').toLowerCase() === 'shortlisted').length / appliedJobs.length) * 100)
                          : 0}%
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </Paper>
            )}
          </Box>
          
          {/* Status Summary */}
          {Array.isArray(appliedJobs) && appliedJobs.length > 0 && (
            <Box sx={{ 
              mt: 3, 
              display: 'flex', 
              gap: 1.5, 
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <Chip 
                label={`Total: ${appliedJobs.length}`}
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  height: 32,
                  backgroundColor: '#f5f5f5',
                  color: '#424242',
                  border: '1px solid #e0e0e0'
                }}
              />
              <Chip 
                label={`Shortlisted: ${appliedJobs.filter(j => (j.applicationStatus || 'pending').toLowerCase() === 'shortlisted').length}`}
                sx={{ 
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  height: 32,
                  border: '1px solid #c8e6c9'
                }}
              />
              <Chip 
                label={`Rejected: ${appliedJobs.filter(j => (j.applicationStatus || 'pending').toLowerCase() === 'rejected').length}`}
                sx={{ 
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  height: 32,
                  border: '1px solid #ffcdd2'
                }}
              />
              <Chip 
                label={`Under Review: ${appliedJobs.filter(j => {
                  const status = (j.applicationStatus || 'pending').toLowerCase();
                  return status === 'under review' || status === 'reviewed';
                }).length}`}
                sx={{ 
                  backgroundColor: '#e3f2fd',
                  color: '#1565c0',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  height: 32,
                  border: '1px solid #bbdefb'
                }}
              />
              <Chip 
                label={`Pending: ${appliedJobs.filter(j => (j.applicationStatus || 'pending').toLowerCase() === 'pending').length}`}
                sx={{ 
                  backgroundColor: '#fafafa',
                  color: '#616161',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  height: 32,
                  border: '1px solid #e0e0e0'
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
              const isShortlisted = status === 'shortlisted';
              const isRejected = status === 'rejected';
              const isUnderReview = status === 'under review' || status === 'reviewed';
              const isPending = status === 'pending';
              
              // "Updated" badge shows for any non-Pending status (Shortlisted, Rejected, Under Review)
              const isUpdated = !isPending;
              
              // Determine border and styling based on status
              const getBorderStyle = () => {
                if (isShortlisted) return '3px solid #10b981'; // Green for Shortlisted
                if (isRejected) return '3px solid #ef4444'; // Red for Rejected
                if (isUnderReview) return '2px solid #3b82f6'; // Blue for Under Review
                return '1px solid #e0e0e0'; // Default for Pending
              };
              
              const getBoxShadow = () => {
                if (isShortlisted) return '0 8px 24px rgba(16, 185, 129, 0.2)';
                if (isRejected) return '0 8px 24px rgba(239, 68, 68, 0.15)';
                if (isUnderReview) return '0 6px 20px rgba(59, 130, 246, 0.15)';
                return '0 2px 8px rgba(0, 0, 0, 0.08)';
              };
              
              // Calculate application timeline
              const daysSince = getDaysSinceApplication(job.appliedAt);
              const actionMessage = getStatusActionMessage(status, daysSince);
              
              return (
                <Grid item xs={12} md={6} lg={4} key={job._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: getBorderStyle(),
                      boxShadow: getBoxShadow(),
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: isShortlisted 
                          ? '0 12px 32px rgba(16, 185, 129, 0.3)' 
                          : isRejected 
                          ? '0 12px 32px rgba(239, 68, 68, 0.2)'
                          : isUnderReview
                          ? '0 10px 28px rgba(59, 130, 246, 0.2)'
                          : '0 6px 16px rgba(0, 0, 0, 0.12)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {job.companyName || 'Company not specified'}
                          </Typography>
                        </Box>
                        {isUpdated && (
                          <Chip 
                            label="Updated" 
                            size="small" 
                            sx={{ 
                              backgroundColor: isShortlisted ? '#d1fae5' : isRejected ? '#fee2e2' : '#dbeafe',
                              color: isShortlisted ? '#065f46' : isRejected ? '#991b1b' : '#1e40af',
                              fontWeight: 700,
                              fontSize: '0.688rem',
                              height: '22px',
                              letterSpacing: '0.3px',
                              border: isShortlisted ? '1.5px solid #10b981' : isRejected ? '1.5px solid #ef4444' : '1.5px solid #3b82f6'
                            }}
                          />
                        )}
                      </Box>
                      
                      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ 
                        fontSize: '1.125rem',
                        lineHeight: 1.3,
                        mb: 1.5
                      }}>
                        {job.title || 'Untitled Job'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.25, gap: 0.75 }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {job.location || 'Location not specified'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 0.75 }}>
                        <CurrencyRupeeIcon sx={{ fontSize: 18, color: 'success.main' }} />
                        <Typography variant="body2" fontWeight={600} color="success.main">
                          {job.salary && !isNaN(job.salary) ? `₹${Number(job.salary).toLocaleString('en-IN')} LPA` : 'Not disclosed'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', mb: 2.5 }}>
                        <Chip 
                          label={`${job.experienceRequired ?? 0} years`} 
                          size="small" 
                          icon={<WorkIcon />}
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #e0e0e0'
                          }}
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
                        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #f0f0f0' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.75,
                            mb: 1
                          }}>
                            <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                              Applied {new Date(job.appliedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                              {daysSince && (
                                <Typography component="span" variant="caption" sx={{ ml: 0.5, color: 'text.disabled' }}>
                                  ({daysSince} {daysSince === 1 ? 'day' : 'days'} ago)
                                </Typography>
                              )}
                            </Typography>
                          </Box>
                          
                          {/* Action-oriented status message */}
                          <Tooltip title={actionMessage.message} arrow>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.75,
                              backgroundColor: `${actionMessage.color}08`,
                              border: `1px solid ${actionMessage.color}20`,
                              borderRadius: 1,
                              py: 0.75,
                              px: 1.25,
                              cursor: 'default'
                            }}>
                              <Typography component="span" sx={{ fontSize: '0.875rem' }}>
                                {actionMessage.icon}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: actionMessage.color,
                                  fontWeight: 600,
                                  fontSize: '0.688rem',
                                  lineHeight: 1.3,
                                  flex: 1
                                }}
                              >
                                {actionMessage.message}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </Box>
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        component={RouterLink} 
                        to={`/jobs/${job._id}`}
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderRadius: 1.5,
                          py: 1,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '0.875rem'
                        }}
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

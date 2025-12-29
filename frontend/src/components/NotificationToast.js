// src/components/NotificationToast.js

import React, { useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  IconButton,
  Slide,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const NotificationToast = ({ notification, open, onClose, autoHideDuration = 6000 }) => {
  useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, onClose, autoHideDuration]);

  if (!notification) return null;

  const getStatusConfig = (status) => {
    const configs = {
      accepted: {
        severity: 'success',
        icon: <CheckCircleIcon />,
        title: 'Application Accepted! 🎉',
        color: '#4caf50',
        bgGradient: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
      },
      rejected: {
        severity: 'error',
        icon: <CancelIcon />,
        title: 'Application Update',
        color: '#f44336',
        bgGradient: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)'
      },
      reviewed: {
        severity: 'info',
        icon: <VisibilityIcon />,
        title: 'Application Under Review',
        color: '#2196f3',
        bgGradient: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)'
      },
      'under review': {
        severity: 'info',
        icon: <VisibilityIcon />,
        title: 'Application Under Review',
        color: '#2196f3',
        bgGradient: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)'
      },
      shortlisted: {
        severity: 'success',
        icon: <StarIcon />,
        title: 'Application Shortlisted',
        color: '#10b981',
        bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      },
      pending: {
        severity: 'info',
        icon: <FiberNewIcon />,
        title: 'New Application',
        color: '#2196f3',
        bgGradient: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
        chipLabel: 'Action Required',
        chipColor: '#1976d2'
      }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const getTypeConfig = (type) => {
    if (type === 'new-application') {
      return {
        severity: 'info',
        icon: <AssignmentIndIcon />,
        title: 'New Application Received',
        color: '#1976d2',
        bgGradient: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
        chipLabel: 'Action Required',
        chipColor: '#0d47a1'
      };
    }
    return null;
  };

  const config = notification.type 
    ? getTypeConfig(notification.type) 
    : getStatusConfig(notification.status);

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
      sx={{ mt: 8 }}
    >
      <Alert
        icon={config.icon}
        severity={config.severity}
        onClose={onClose}
        sx={{
          width: '420px',
          maxWidth: '95vw',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          borderRadius: 3,
          border: `2px solid ${config.color}40`,
          background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)',
          '& .MuiAlert-icon': {
            fontSize: 32,
            color: config.color,
            mt: 0.5
          },
          '& .MuiAlert-message': {
            width: '100%',
            py: 0.5
          }
        }}
        action={
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ 
              color: 'text.secondary',
              mt: 0.5,
              '&:hover': { 
                backgroundColor: 'rgba(0,0,0,0.08)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s'
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {/* Header with Title and Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AlertTitle sx={{ 
            fontWeight: 700, 
            fontSize: '1.1rem',
            mb: 0,
            color: config.color,
            flex: 1
          }}>
            {config.title}
          </AlertTitle>
          {config.chipLabel && (
            <Chip 
              label={config.chipLabel}
              size="small"
              sx={{ 
                bgcolor: `${config.chipColor}20`,
                color: config.chipColor,
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 22
              }}
            />
          )}
          {!config.chipLabel && (
            <Chip 
              icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
              label={formatTimestamp()}
              size="small"
              variant="outlined"
              sx={{ 
                height: 22,
                fontSize: '0.7rem',
                borderColor: 'divider',
                color: 'text.secondary'
              }}
            />
          )}
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Stack spacing={2}>
          {/* Job Title Section */}
          {notification.jobTitle && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <WorkIcon sx={{ fontSize: 20, color: config.color }} />
                <Typography variant="body2" sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  fontSize: '0.95rem'
                }}>
                  {notification.jobTitle}
                </Typography>
              </Box>
              {notification.companyName && (
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary', 
                  display: 'block', 
                  ml: 4,
                  fontWeight: 500
                }}>
                  {notification.companyName}
                </Typography>
              )}
            </Box>
          )}
          
          {/* Applicant Information Card */}
          {notification.userName && (
            <Box sx={{ 
              bgcolor: '#f8fafc',
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ 
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    mb: 0.5,
                    display: 'block'
                  }}>
                    Candidate Details
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PersonIcon sx={{ fontSize: 18, color: config.color }} />
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      fontSize: '0.9rem'
                    }}>
                      {notification.userName}
                    </Typography>
                  </Box>
                </Box>
                {notification.userEmail && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.8rem'
                    }}>
                      {notification.userEmail}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;

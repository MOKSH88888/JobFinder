// src/components/NotificationToast.js
// User-facing notification toast for application status updates

import React, { useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  IconButton,
  Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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
      'under review': {
        severity: 'info',
        icon: <VisibilityIcon />,
        title: 'Application Being Reviewed',
        color: '#2196f3',
        bgGradient: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)'
      },
      shortlisted: {
        severity: 'success',
        icon: <StarIcon />,
        title: 'Application Shortlisted! ⭐',
        color: '#10b981',
        bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      },
      pending: {
        severity: 'info',
        icon: <HourglassEmptyIcon />,
        title: 'Application Pending',
        color: '#ff9800',
        bgGradient: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)'
      }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const config = getStatusConfig(notification.status);

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
          width: '400px',
          maxWidth: '95vw',
          background: config.bgGradient,
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          borderRadius: 3,
          '& .MuiAlert-icon': {
            fontSize: 32,
            color: 'white'
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
              color: 'white',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <AlertTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.1rem',
          color: 'white',
          mb: 1
        }}>
          {config.title}
        </AlertTitle>

        {/* Job Title */}
        {notification.jobTitle && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <WorkIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.9)' }} />
            <Typography variant="body2" sx={{ 
              fontWeight: 600, 
              color: 'white',
              fontSize: '0.95rem'
            }}>
              {notification.jobTitle}
            </Typography>
          </Box>
        )}

        {/* Company Name */}
        {notification.companyName && (
          <Typography variant="caption" sx={{ 
            color: 'rgba(255,255,255,0.85)', 
            display: 'block', 
            ml: 3.5,
            mb: 1
          }}>
            {notification.companyName}
          </Typography>
        )}

        {/* Status Message */}
        {notification.jobTitle && notification.companyName && (
          <Typography variant="body2" sx={{ 
            color: 'rgba(255,255,255,0.95)',
            mt: 1.5,
            mb: 1,
            lineHeight: 1.5
          }}>
            Your application for {notification.jobTitle} at {notification.companyName} has been {notification.status?.toLowerCase() || 'updated'}
          </Typography>
        )}

        {/* Custom Message (if provided) */}
        {notification.message && (
          <Typography variant="body2" sx={{ 
            color: 'rgba(255,255,255,0.9)',
            fontStyle: 'italic',
            mb: 1
          }}>
            {notification.message}
          </Typography>
        )}

        {/* Timestamp */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
          <AccessTimeIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {formatTimestamp()}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;

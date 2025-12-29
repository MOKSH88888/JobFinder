// src/components/NotificationToast.js

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
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';

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
        title: 'Application Being Reviewed 👀',
        color: '#2196f3',
        bgGradient: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)'
      },
      'under review': {
        severity: 'info',
        icon: <VisibilityIcon />,
        title: 'Application Being Reviewed 👀',
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
        icon: <HourglassEmptyIcon />,
        title: 'Application Pending',
        color: '#9e9e9e',
        bgGradient: 'linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)'
      }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const getTypeConfig = (type) => {
    if (type === 'new-application') {
      return {
        severity: 'info',
        icon: <PersonIcon />,
        title: 'New Application Received 📝',
        color: '#2196f3',
        bgGradient: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)'
      };
    }
    return null;
  };

  const config = notification.type 
    ? getTypeConfig(notification.type) 
    : getStatusConfig(notification.status);

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
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          borderRadius: 2,
          border: `1px solid ${config.color}30`,
          background: 'white',
          '& .MuiAlert-icon': {
            fontSize: 28,
            color: config.color
          },
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <AlertTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1rem',
          mb: 1,
          color: config.color
        }}>
          {config.title}
        </AlertTitle>
        
        <Box>
          {notification.jobTitle && (
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {notification.jobTitle}
            </Typography>
          )}
          {notification.companyName && (
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              {notification.companyName}
            </Typography>
          )}
          {notification.message && (
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {notification.message}
            </Typography>
          )}
          {notification.userName && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Applicant:</strong> {notification.userName}
            </Typography>
          )}
          {notification.userEmail && (
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              {notification.userEmail}
            </Typography>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;

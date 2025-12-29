// src/components/NotificationToast.js
// User-facing notification toast for application status updates

import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  IconButton,
  Slide
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};

const NotificationToast = ({ notification, open, onClose }) => {
  if (!notification) return null;

  const getStatusConfig = (status) => {
    const configs = {
      'accepted': {
        icon: <CheckCircleIcon />,
        severity: 'success',
        color: '#10b981',
        title: 'Application Accepted',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      },
      'rejected': {
        icon: <CancelIcon />,
        severity: 'error',
        color: '#ef4444',
        title: 'Application Update',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      },
      'reviewed': {
        icon: <VisibilityIcon />,
        severity: 'info',
        color: '#3b82f6',
        title: 'Application Reviewed',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
      },
      'under review': {
        icon: <VisibilityIcon />,
        severity: 'info',
        color: '#3b82f6',
        title: 'Application Under Review',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
      },
      'shortlisted': {
        icon: <StarIcon />,
        severity: 'success',
        color: '#10b981',
        title: 'Application Shortlisted',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      },
      'pending': {
        icon: <HourglassEmptyIcon />,
        severity: 'info',
        color: '#6b7280',
        title: 'Application Pending',
        gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
      }
    };
    return configs[status?.toLowerCase()] || configs['pending'];
  };

  const getTypeConfig = (type) => {
    const configs = {
      'new-application': {
        icon: <PersonIcon />,
        severity: 'info',
        color: '#3b82f6',
        title: 'New Application Received',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
      }
    };
    return configs[type] || null;
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

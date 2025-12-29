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
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
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
        icon: <HourglassEmptyIcon />,
        title: 'Application Submitted',
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
        title: 'New Application Received',
        color: '#2196f3',
        bgGradient: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
        chipLabel: 'New',
        chipColor: '#1976d2'
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
        
        <Divider sx={{ mb: 1.5 }} />
        
        <Stack spacing={1.5}>
          {/* Job Title with Icon */}
          {notification.jobTitle && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <WorkIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.4 }}>
                  {notification.jobTitle}
                </Typography>
                {notification.companyName && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.3 }}>
                    at {notification.companyName}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          
          {/* Applicant Information */}
          {notification.userName && (
            <Box sx={{ 
              bgcolor: 'rgba(33, 150, 243, 0.08)', 
              p: 1.5, 
              borderRadius: 2,
              borderLeft: `3px solid ${config.color}`
            }}>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 16, color: config.color }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {notification.userName}
                  </Typography>
                </Box>
                {notification.userEmail && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 3 }}>
                    <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {notification.userEmail}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
          
          {/* Additional Message */}
          {notification.message && (
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              fontStyle: 'italic',
              pl: 0.5
            }}>
              {notification.message}
            </Typography>
          )}
        </Stack>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;

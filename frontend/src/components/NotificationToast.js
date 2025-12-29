// src/components/NotificationToast.js

import React, { useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  IconButton,
  Slide,
  Chip,
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

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
      sx={{ mt: 8 }}
    >
      <Alert
        icon={false}
        severity="info"
        onClose={onClose}
        sx={{
          width: '400px',
          maxWidth: '95vw',
          bgcolor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)',
          borderRadius: 2,
          border: 'none',
          '& .MuiAlert-message': {
            width: '100%',
            p: 0
          }
        }}
        action={
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ 
              color: '#64748b',
              '&:hover': { 
                bgcolor: '#f1f5f9'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: '#f0f9ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiberNewIcon sx={{ fontSize: 20, color: '#0284c7' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#0f172a',
                lineHeight: 1.3
              }}>
                New Application
              </Typography>
              <Typography sx={{
                fontSize: '0.75rem',
                color: '#64748b',
                lineHeight: 1.3
              }}>
                Action required
              </Typography>
            </Box>
          </Box>

          {/* Job Details */}
          {notification.jobTitle && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1.5,
              py: 1.5,
              borderTop: '1px solid #f1f5f9',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <WorkIcon sx={{ fontSize: 18, color: '#64748b', mt: 0.2 }} />
              <Box>
                <Typography sx={{ 
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  lineHeight: 1.4
                }}>
                  {notification.jobTitle}
                </Typography>
                {notification.companyName && (
                  <Typography sx={{ 
                    fontSize: '0.75rem',
                    color: '#64748b',
                    mt: 0.25
                  }}>
                    {notification.companyName}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Candidate Info */}
          {notification.userName && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <PersonIcon sx={{ fontSize: 18, color: '#64748b' }} />
                <Typography sx={{ 
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  fontWeight: 500
                }}>
                  {notification.userName}
                </Typography>
              </Box>
              {notification.userEmail && (
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <EmailIcon sx={{ fontSize: 18, color: '#64748b' }} />
                  <Typography sx={{ 
                    fontSize: '0.813rem',
                    color: '#64748b'
                  }}>
                    {notification.userEmail}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Stack>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;

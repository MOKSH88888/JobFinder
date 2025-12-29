// src/components/NotificationToast.js

import React, { useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  IconButton,
  Slide,
  Stack,
  Divider
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
          width: '420px',
          maxWidth: '95vw',
          bgcolor: 'white',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
          borderRadius: 3,
          border: '1px solid #e5e7eb',
          borderLeft: '4px solid #2563eb',
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
        <Stack spacing={2.5}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                bgcolor: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiberNewIcon sx={{ fontSize: 22, color: '#2563eb' }} />
              </Box>
              <Box>
                <Typography sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#111827',
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em'
                }}>
                  New Application
                </Typography>
                <Typography sx={{
                  fontSize: '0.813rem',
                  color: '#6b7280',
                  lineHeight: 1.3,
                  mt: 0.25
                }}>
                  Requires review
              </Typography>
              </Box>
            </Box>
            <Box sx={{
              bgcolor: '#fef3c7',
              color: '#92400e',
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Action Required
            </Box>
          </Box>
          
          <Divider sx={{ borderColor: '#f3f4f6' }} />

          {/* Job Details */}
          {notification.jobTitle && (
            <Box>
              <Typography sx={{ 
                fontSize: '0.688rem',
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                mb: 1.5
              }}>
                Position Details
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <WorkIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ 
                    fontWeight: 600,
                    fontSize: '0.938rem',
                    color: '#111827',
                    lineHeight: 1.4,
                    mb: 0.5
                  }}>
                    {notification.jobTitle}
                  </Typography>
                  {notification.companyName && (
                    <Typography sx={{ 
                      fontSize: '0.813rem',
                      color: '#6b7280',
                      lineHeight: 1.4
                    }}>
                      {notification.companyName}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
          
          <Divider sx={{ borderColor: '#f3f4f6' }} />

          {/* Candidate Info */}
          {notification.userName && (
            <Box>
              <Typography sx={{ 
                fontSize: '0.688rem',
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                mb: 1.5
              }}>
                Candidate Information
              </Typography>
              <Box sx={{ 
                bgcolor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 2.5,
                p: 2
              }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <PersonIcon sx={{ fontSize: 20, color: '#4b5563' }} />
                    <Typography sx={{ 
                      fontSize: '0.938rem',
                      color: '#111827',
                      fontWeight: 600,
                      lineHeight: 1.4
                    }}>
                      {notification.userName}
                    </Typography>
                  </Box>
                  {notification.userEmail && (
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <EmailIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                      <Typography sx={{ 
                        fontSize: '0.875rem',
                        color: '#4b5563',
                        lineHeight: 1.4
                      }}>
                        {notification.userEmail}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Box>
          )}
        </Stack>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;

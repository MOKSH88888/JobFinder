// src/components/JobCard.js
// Reusable job card component with bookmark and apply functionality

import React, { useState, useMemo } from 'react';
import { 
  Card, CardContent, CardActions, Typography, Button, Chip, 
  IconButton, Tooltip, Box, Stack, alpha 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { bookmarkJob, removeBookmark } from '../api';

const JobCard = ({ job, isNewJob = false }) => {
  const { user, refreshUser, setUser } = useAuth();
  const { showToast } = useSocket();
  const [loading, setLoading] = useState(false);
  
  // Calculate bookmark status directly from user context
  const isBookmarked = useMemo(() => {
    if (!user || !user.bookmarkedJobs) return false;
    return user.bookmarkedJobs.some(bookmark => {
      const bookmarkId = typeof bookmark === 'string' ? bookmark : bookmark._id;
      return bookmarkId === job._id;
    });
  }, [user, job._id]);
  
  // Check if current user has applied for this job
  const hasApplied = useMemo(() => 
    user && user.appliedJobs?.some(app => 
      (app.jobId === job._id || app === job._id)
    ), [user, job._id]
  );
  
  // Format salary for better readability (memoized)
  const formattedSalary = useMemo(() => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(job.salary);
  }, [job.salary]);

  // Format experience text (memoized)
  const experienceText = useMemo(() => {
    if (job.experienceRequired === 0) return 'Fresher / Entry Level';
    if (job.experienceRequired === 1) return '1 year experience';
    return `${job.experienceRequired}+ years experience`;
  }, [job.experienceRequired]);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please login to bookmark jobs', 'warning');
      return;
    }
    
    setLoading(true);
    
    // Optimistic update - immediately update UI
    const updatedBookmarks = isBookmarked
      ? user.bookmarkedJobs.filter(bookmark => {
          const bookmarkId = typeof bookmark === 'string' ? bookmark : bookmark._id;
          return bookmarkId !== job._id;
        })
      : [...(user.bookmarkedJobs || []), job._id];
    
    setUser({ ...user, bookmarkedJobs: updatedBookmarks });
    
    try {
      if (isBookmarked) {
        await removeBookmark(job._id);
        showToast('Bookmark removed', 'info');
      } else {
        await bookmarkJob(job._id);
        showToast('Job bookmarked successfully', 'success');
      }
      // Refresh to sync with backend
      await refreshUser();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update bookmark';
      showToast(errorMsg, 'error');
      // Revert optimistic update on error
      await refreshUser();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          borderColor: 'primary.light',
        }
      }}
    >
      {/* Header Section */}
      <Box 
        sx={{ 
          background: alpha('#f5f7fa', 1),
          p: 2.5,
          position: 'relative',
          borderBottom: '1px solid',
          borderColor: '#e8eaf0',
          minHeight: user ? 110 : 95
        }}
      >
        {/* New Badge */}
        {isNewJob && (
          <Chip 
            label="NEW"
            size="small"
            sx={{ 
              position: 'absolute',
              top: 10,
              left: 10,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.65rem',
              height: 20,
              px: 1,
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
              border: '1px solid rgba(255,255,255,0.2)',
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
        )}
        
        {/* Bookmark Button */}
        {user && (
          <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark job"}>
            <IconButton
              onClick={handleBookmarkToggle}
              disabled={loading}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                bgcolor: 'white',
                color: isBookmarked ? 'primary.main' : 'action.active',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                width: 36,
                height: 36,
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  color: isBookmarked ? 'primary.dark' : 'primary.main'
                }
              }}
            >
              {isBookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
        
        {/* Company Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, mt: isNewJob ? 3 : 0 }}>
          <BusinessCenterIcon sx={{ color: 'primary.main', fontSize: 18 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              color: 'text.secondary',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.8px'
            }}
          >
            {job.companyName}
          </Typography>
        </Box>
        
        {/* Job Title */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            mb: hasApplied ? 1.5 : 0.5,
            pr: user ? 5 : 0,
            lineHeight: 1.3,
            fontSize: { xs: '1.1rem', md: '1.15rem' }
          }}
        >
          {job.title}
        </Typography>
        
        {/* Applied Badge */}
        {hasApplied && (
          <Chip 
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
            label="Applied" 
            size="small"
            color="success"
            variant="outlined"
            sx={{ 
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 26,
              borderWidth: '1.5px',
              '& .MuiChip-icon': {
                ml: 0.5
              }
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2.5, pb: 2, px: 2.5 }}>
        {/* Key Info - Better Alignment */}
        <Stack spacing={1.5}>
          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <LocationOnIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {job.location}
            </Typography>
          </Box>
          
          {/* Experience */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <TrendingUpIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {experienceText}
            </Typography>
          </Box>
          
          {/* Salary */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <CurrencyRupeeIcon sx={{ fontSize: 19, color: 'success.main' }} />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                color: 'success.main',
                fontSize: '0.875rem'
              }}
            >
              {formattedSalary} / year
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/jobs/${job._id}`}
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            borderRadius: 1.5,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.25)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.35)',
            }
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard;
// src/components/JobCard.js

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

const JobCard = ({ job }) => {
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
      console.error('Bookmark error:', error);
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
          background: `linear-gradient(135deg, ${alpha('#667eea', 0.08)} 0%, ${alpha('#764ba2', 0.04)} 100%)`,
          p: 2.5,
          position: 'relative',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Bookmark Button */}
        {user && (
          <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark job"}>
            <IconButton
              onClick={handleBookmarkToggle}
              disabled={loading}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'white',
                color: isBookmarked ? 'primary.main' : 'action.active',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)',
                }
              }}
              size="small"
            >
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>
        )}
        
        {/* Company Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <BusinessCenterIcon sx={{ color: 'primary.main', fontSize: 18 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              color: 'text.secondary',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.5px'
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
            mb: 1,
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
            color="success" 
            size="small"
            sx={{ 
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2.5, pb: 2 }}>
        {/* Key Info Chips */}
        <Stack spacing={1.5}>
          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.location}
            </Typography>
          </Box>
          
          {/* Experience */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {experienceText}
            </Typography>
          </Box>
          
          {/* Salary */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CurrencyRupeeIcon sx={{ fontSize: 18, color: 'success.main' }} />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                color: 'success.main'
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
            borderRadius: 2,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
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
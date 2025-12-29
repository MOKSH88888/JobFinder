// src/pages/BookmarkedJobsPage.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Paper
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { getBookmarkedJobs } from '../api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';

const BookmarkedJobsPage = () => {
  const { user } = useAuth();
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookmarkedJobs();
  }, []);

  // Sync with user's bookmarked jobs from context
  useEffect(() => {
    if (user && user.bookmarkedJobs) {
      // If user has bookmarks in context, filter the displayed jobs to match
      setBookmarkedJobs(prev => 
        prev.filter(job => 
          user.bookmarkedJobs.some(bookmark => {
            const bookmarkId = typeof bookmark === 'string' ? bookmark : bookmark._id;
            return bookmarkId === job._id;
          })
        )
      );
    }
  }, [user?.bookmarkedJobs]);

  const fetchBookmarkedJobs = async () => {
    try {
      setLoading(true);
      const { data } = await getBookmarkedJobs();
      // Extract bookmarkedJobs from response wrapper
      const bookmarks = data?.bookmarkedJobs || [];
      setBookmarkedJobs(Array.isArray(bookmarks) ? bookmarks : []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load bookmarked jobs');
      setBookmarkedJobs([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <BookmarkIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="600">
          Bookmarked Jobs
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!Array.isArray(bookmarkedJobs) || bookmarkedJobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <BookmarkIcon sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No bookmarked jobs yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Browse jobs and bookmark the ones you're interested in
          </Typography>
        </Paper>
      ) : (
        <>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You have {bookmarkedJobs.length} bookmarked {bookmarkedJobs.length === 1 ? 'job' : 'jobs'}
          </Typography>
          
          <Grid container spacing={3}>
            {bookmarkedJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <JobCard job={job} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default BookmarkedJobsPage;

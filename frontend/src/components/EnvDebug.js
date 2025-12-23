// Debug component to show environment variables
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const EnvDebug = () => {
  return (
    <Paper sx={{ p: 2, m: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        🔍 Environment Debug Info
      </Typography>
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
        <strong>API Base URL:</strong> {process.env.REACT_APP_API_BASE_URL || 'NOT SET (using localhost fallback)'}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
        If this shows "NOT SET", the environment variable wasn't set during build time.
      </Typography>
    </Paper>
  );
};

export default EnvDebug;

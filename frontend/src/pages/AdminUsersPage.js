// src/pages/AdminUsersPage.js

import React, { useState, useEffect } from 'react';
import API from '../api';
import PdfViewer from '../components/PdfViewer';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Avatar,
  Alert,
  Chip,
  Fade,
  IconButton,
  alpha
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Description as ResumeIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import AdminLayout from '../components/admin/AdminLayout';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState({ url: '', name: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      const usersArray = data?.users || [];
      setUsers(Array.isArray(usersArray) ? usersArray : []);
      setLoading(false);
    } catch (error) {
      setUsers([]);
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await API.delete(`/admin/users/${userId}`);
      setMessage('User deleted successfully');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting user');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box>
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom>
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage registered users on your platform
            </Typography>
          </Box>
        </Fade>

        {message && (
          <Fade in timeout={400}>
            <Alert
              severity={message.includes('successfully') ? 'success' : 'error'}
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          </Fade>
        )}

        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Experience</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Gender</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Resume</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          '&:hover': { bgcolor: alpha('#667eea', 0.02) },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={
                                user.profilePhoto
                                  ? user.profilePhoto.startsWith('http')
                                    ? user.profilePhoto
                                    : `${process.env.REACT_APP_API_BASE_URL?.replace('/api', '')}/${user.profilePhoto}`
                                  : undefined
                              }
                              sx={{
                                width: 48,
                                height: 48,
                                border: '2px solid #e2e8f0',
                                bgcolor: alpha('#667eea', 0.1),
                                color: '#667eea',
                                fontWeight: 600
                              }}
                            >
                              {user.name?.charAt(0)}
                            </Avatar>
                            <Typography fontWeight={600} color="#1e293b">
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{user.email}</TableCell>
                        <TableCell>{user.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${user.experience || 0} years`}
                            size="small"
                            sx={{
                              bgcolor: alpha('#667eea', 0.1),
                              color: '#667eea',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>{user.gender || 'Not specified'}</TableCell>
                        <TableCell>
                          {user.resume ? (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<ResumeIcon />}
                              onClick={() => {
                                setSelectedPdf({ url: user.resume, name: `${user.name}'s Resume` });
                                setPdfViewerOpen(true);
                              }}
                              sx={{
                                textTransform: 'none',
                                borderColor: '#667eea',
                                color: '#667eea',
                                fontWeight: 600,
                                '&:hover': {
                                  borderColor: '#764ba2',
                                  bgcolor: alpha('#667eea', 0.04)
                                }
                              }}
                            >
                              View
                            </Button>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              No resume
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(user._id)}
                            sx={{
                              bgcolor: alpha('#ef4444', 0.1),
                              color: '#ef4444',
                              '&:hover': {
                                bgcolor: alpha('#ef4444', 0.2)
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <PeopleIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                        <Typography color="text.secondary">
                          No users registered yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Fade>

        <PdfViewer
          open={pdfViewerOpen}
          onClose={() => setPdfViewerOpen(false)}
          pdfUrl={selectedPdf.url}
          title={selectedPdf.name}
        />
      </Box>
    </AdminLayout>
  );
};

export default AdminUsersPage;

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
  TextField,
  alpha
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Description as ResumeIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import AdminLayout from '../components/admin/AdminLayout';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getFilteredAndSortedUsers = () => {
    let filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.gender?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle numeric values for experience
        if (sortConfig.key === 'experience') {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        } else {
          aVal = String(aVal || '').toLowerCase();
          bVal = String(bVal || '').toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredUsers = getFilteredAndSortedUsers();

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
          <Box sx={{ mb: 3 }}>
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

        <Fade in timeout={600}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search users by name, email, phone, or gender..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: '#667eea', mr: 1 }} />
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.9)',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.1)'
                  },
                  '&:hover fieldset': {
                    borderColor: '#667eea'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea'
                  }
                }
              }}
            />
          </Box>
        </Fade>

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
                    <TableCell 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#475569', 
                        py: 2,
                        cursor: 'pointer',
                        userSelect: 'none',
                        '&:hover': { bgcolor: alpha('#667eea', 0.05) }
                      }}
                      onClick={() => handleSort('name')}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        User
                        {sortConfig.key === 'name' && (
                          sortConfig.direction === 'asc' 
                            ? <ArrowUpwardIcon fontSize="small" sx={{ color: '#667eea' }} />
                            : <ArrowDownwardIcon fontSize="small" sx={{ color: '#667eea' }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#475569',
                        cursor: 'pointer',
                        userSelect: 'none',
                        '&:hover': { bgcolor: alpha('#667eea', 0.05) }
                      }}
                      onClick={() => handleSort('email')}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Email
                        {sortConfig.key === 'email' && (
                          sortConfig.direction === 'asc' 
                            ? <ArrowUpwardIcon fontSize="small" sx={{ color: '#667eea' }} />
                            : <ArrowDownwardIcon fontSize="small" sx={{ color: '#667eea' }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Phone</TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#475569',
                        cursor: 'pointer',
                        userSelect: 'none',
                        '&:hover': { bgcolor: alpha('#667eea', 0.05) }
                      }}
                      onClick={() => handleSort('experience')}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Experience
                        {sortConfig.key === 'experience' && (
                          sortConfig.direction === 'asc' 
                            ? <ArrowUpwardIcon fontSize="small" sx={{ color: '#667eea' }} />
                            : <ArrowDownwardIcon fontSize="small" sx={{ color: '#667eea' }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#475569',
                        cursor: 'pointer',
                        userSelect: 'none',
                        '&:hover': { bgcolor: alpha('#667eea', 0.05) }
                      }}
                      onClick={() => handleSort('gender')}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Gender
                        {sortConfig.key === 'gender' && (
                          sortConfig.direction === 'asc' 
                            ? <ArrowUpwardIcon fontSize="small" sx={{ color: '#667eea' }} />
                            : <ArrowDownwardIcon fontSize="small" sx={{ color: '#667eea' }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Resume</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
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

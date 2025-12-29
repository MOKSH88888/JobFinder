// src/pages/AdminAdminsPage.js

import React, { useState, useEffect } from 'react';
import API from '../api';
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Fade,
  IconButton,
  alpha,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import AdminLayout from '../components/admin/AdminLayout';

const AdminAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await API.get('/admin/admins');
      const adminsArray = data?.admins || [];
      setAdmins(Array.isArray(adminsArray) ? adminsArray : []);
      setLoading(false);
    } catch (error) {
      setAdmins([]);
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      await API.delete(`/admin/admins/${adminId}`);
      setMessage({ text: 'Admin deleted successfully', severity: 'success' });
      await fetchAdmins();
      setTimeout(() => setMessage({ text: '', severity: 'success' }), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Error deleting admin';
      setMessage({ text: errorMsg, severity: 'error' });
      setTimeout(() => setMessage({ text: '', severity: 'success' }), 5000);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.username || !newAdmin.password) {
      setMessage({ text: 'Please fill in all fields', severity: 'warning' });
      setTimeout(() => setMessage({ text: '', severity: 'success' }), 3000);
      return;
    }

    setCreating(true);
    try {
      await API.post('/admin/admins', newAdmin);
      setOpenDialog(false);
      setNewAdmin({ username: '', password: '' });
      await fetchAdmins();
      setMessage({ text: 'Admin created successfully', severity: 'success' });
      setTimeout(() => setMessage({ text: '', severity: 'success' }), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Error creating admin';
      setMessage({ text: errorMsg, severity: 'error' });
      setTimeout(() => setMessage({ text: '', severity: 'success' }), 5000);
    } finally {
      setCreating(false);
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
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom>
                Admin Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage administrator accounts and permissions
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 28px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Create Admin
            </Button>
          </Box>
        </Fade>

        {message.text && (
          <Fade in timeout={400}>
            <Alert
              severity={message.severity}
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setMessage({ text: '', severity: 'success' })}
            >
              {message.text}
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
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Admin</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(admins) && admins.map((admin) => (
                    <TableRow
                      key={admin._id}
                      sx={{
                        '&:hover': { bgcolor: alpha('#667eea', 0.02) },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: admin.isDefault 
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : alpha('#667eea', 0.1),
                              color: admin.isDefault ? 'white' : '#667eea',
                              fontWeight: 700,
                              border: admin.isDefault ? '2px solid #667eea' : 'none'
                            }}
                          >
                            {admin.isDefault ? <ShieldIcon /> : admin.username?.charAt(0).toUpperCase()}
                          </Avatar>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600} color="#1e293b">
                          {admin.username}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {admin.isDefault ? (
                          <Chip
                            label="Super Admin"
                            size="small"
                            icon={<ShieldIcon />}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 700,
                              borderRadius: 1.5
                            }}
                          />
                        ) : (
                          <Chip
                            label="Administrator"
                            size="small"
                            icon={<AdminIcon />}
                            sx={{
                              bgcolor: alpha('#667eea', 0.1),
                              color: '#667eea',
                              fontWeight: 600,
                              borderRadius: 1.5
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {!admin.isDefault ? (
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(admin._id)}
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
                        ) : (
                          <Chip
                            label="Protected"
                            size="small"
                            sx={{
                              bgcolor: alpha('#22c55e', 0.1),
                              color: '#22c55e',
                              fontWeight: 600
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {admins.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 12 }}>
                <AdminIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 3 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No administrators found
                </Typography>
                <Typography color="text.secondary">
                  Create your first admin account to get started
                </Typography>
              </Box>
            )}
          </Paper>
        </Fade>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1.5rem' }}>
            Create New Admin
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Username"
              value={newAdmin.username}
              onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              disabled={creating}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAdmin}
              variant="contained"
              disabled={creating}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderRadius: 2,
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              {creating ? <CircularProgress size={24} color="inherit" /> : 'Create Admin'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default AdminAdminsPage;

// src/pages/AdminApplicantsPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
  MenuItem,
  Select,
  FormControl,
  Chip,
  Fade,
  alpha
} from '@mui/material';
import {
  Description as ResumeIcon,
  Assignment as ApplicationIcon
} from '@mui/icons-material';
import AdminLayout from '../components/admin/AdminLayout';

const AdminApplicantsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState({ url: '', name: '' });

  const fetchApplicants = useCallback(async () => {
    try {
      const { data } = await API.get(`/admin/jobs/${jobId}/applicants`);
      setJob(data?.job || null);
      const applicantsList = data?.applicants || [];
      const mappedApplicants = Array.isArray(applicantsList) 
        ? applicantsList.map(app => ({
            ...app,
            status: app.status || 'Pending'
          }))
        : [];
      setApplicants(mappedApplicants);
      setLoading(false);
    } catch (error) {
      setApplicants([]);
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      await API.patch(`/admin/jobs/${jobId}/applicants/${applicantId}/status`, {
        status: newStatus
      });
      
      setApplicants(applicants.map(app => 
        app._id === applicantId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      alert('Failed to update status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#6b7280',
      'Under Review': '#3b82f6',
      'Shortlisted': '#16a34a',
      'Rejected': '#dc2626'
    };
    return colors[status] || '#6b7280';
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
              {job?.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {job?.companyName}
              </Typography>
              <Chip
                label={job?.location}
                size="small"
                sx={{
                  bgcolor: alpha('#667eea', 0.1),
                  color: '#667eea',
                  fontWeight: 600
                }}
              />
              <Chip
                label={`${applicants.length} Applicants`}
                size="small"
                sx={{
                  bgcolor: alpha('#667eea', 0.1),
                  color: '#667eea',
                  fontWeight: 600
                }}
              />
            </Box>
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
            {applicants.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Applicant</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Experience</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Gender</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Resume</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', minWidth: 200 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applicants.map((applicant) => (
                      <TableRow
                        key={applicant._id}
                        sx={{
                          '&:hover': { bgcolor: alpha('#667eea', 0.02) },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={applicant.profilePhoto || undefined}
                              sx={{
                                width: 48,
                                height: 48,
                                border: '2px solid #e2e8f0',
                                bgcolor: alpha('#667eea', 0.1),
                                color: '#667eea',
                                fontWeight: 600
                              }}
                            >
                              {applicant.name?.charAt(0)}
                            </Avatar>
                            <Typography fontWeight={600} color="#1e293b">
                              {applicant.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{applicant.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${applicant.experience} yrs`}
                            size="small"
                            sx={{
                              bgcolor: alpha('#667eea', 0.1),
                              color: '#667eea',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>{applicant.gender || 'N/A'}</TableCell>
                        <TableCell>{applicant.phone || 'N/A'}</TableCell>
                        <TableCell>
                          {applicant.resume ? (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<ResumeIcon />}
                              onClick={() => {
                                setSelectedPdf({ url: applicant.resume, name: `${applicant.name}'s Resume` });
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
                          <FormControl size="small" fullWidth>
                            <Select
                              value={applicant.status || 'Pending'}
                              onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                              sx={{
                                fontWeight: 600,
                                color: getStatusColor(applicant.status),
                                borderRadius: 2,
                                '& .MuiSelect-select': {
                                  py: 1.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#667eea',
                                  borderWidth: 2
                                }
                              }}
                            >
                              <MenuItem value="Pending" sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span style={{ fontSize: '1.2rem' }}>📋</span>
                                  <span>Pending</span>
                                </Box>
                              </MenuItem>
                              <MenuItem value="Under Review" sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span style={{ fontSize: '1.2rem' }}>👁️</span>
                                  <span>Under Review</span>
                                </Box>
                              </MenuItem>
                              <MenuItem value="Shortlisted" sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span style={{ fontSize: '1.2rem' }}>⭐</span>
                                  <span>Shortlisted</span>
                                </Box>
                              </MenuItem>
                              <MenuItem value="Rejected" sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span style={{ fontSize: '1.2rem' }}>❌</span>
                                  <span>Rejected</span>
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 12 }}>
                <ApplicationIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 3 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No applicants yet
                </Typography>
                <Typography color="text.secondary">
                  This job hasn't received any applications.
                </Typography>
              </Box>
            )}
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

export default AdminApplicantsPage;

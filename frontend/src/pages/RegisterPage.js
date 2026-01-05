// src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { validateEmail, validatePassword, validateName, getErrorMessage } from '../utils/errorHandler';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    gender: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({ 
    name: false, 
    email: false, 
    password: false, 
    confirmPassword: false,
    gender: false 
  });
  const [validationErrors, setValidationErrors] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    gender: '' 
  });
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'name') {
      const validation = validateName(value);
      error = validation.valid ? '' : validation.message;
    } else if (name === 'email') {
      const validation = validateEmail(value);
      error = validation.valid ? '' : validation.message;
    } else if (name === 'password') {
      const validation = validatePassword(value);
      error = validation.valid ? '' : validation.message;
    } else if (name === 'confirmPassword') {
      if (!value) {
        error = 'Please confirm your password';
      } else if (value !== formData.password) {
        error = 'Passwords do not match';
      }
    } else if (name === 'gender') {
      if (!value) {
        error = 'Please select your gender';
      }
    }
    
    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const nameValid = validateName(formData.name).valid;
    const emailValid = validateEmail(formData.email).valid;
    const passwordValid = validatePassword(formData.password).valid;
    const confirmValid = formData.confirmPassword === formData.password && formData.password.length >= 8;
    const genderValid = formData.gender !== '';
    return nameValid && emailValid && passwordValid && confirmValid && genderValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched and validate
    const allTouched = { name: true, email: true, password: true, confirmPassword: true, gender: true };
    setTouched(allTouched);
    
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    
    const errors = {
      name: nameValidation.valid ? '' : nameValidation.message,
      email: emailValidation.valid ? '' : emailValidation.message,
      password: passwordValidation.valid ? '' : passwordValidation.message,
      confirmPassword: formData.confirmPassword !== formData.password ? 'Passwords do not match' : '',
      gender: !formData.gender ? 'Please select your gender' : ''
    };
    
    setValidationErrors(errors);
    
    if (Object.values(errors).some(err => err !== '')) {
      return;
    }
    
    setLoading(true);
    try {
      await registerUser(formData.name, formData.email, formData.password, formData.gender);
      navigate('/login');
    } catch (err) {
      const errorInfo = getErrorMessage(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Left Side - Form */}
      <Box
        sx={{
          width: { xs: '100%', lg: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          bgcolor: 'white'
        }}
      >
        <Box sx={{ maxWidth: 460, width: '100%' }}>
          {/* Header */}
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '2rem', md: '2.75rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                letterSpacing: '-0.03em',
                lineHeight: 1.2
              }}
            >
              Get Started
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '0.01em' }}>
              Create your account in seconds
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#1e293b', fontSize: '0.875rem' }}>
              Full Name *
            </Typography>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              autoComplete="name"
              autoFocus
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && !!validationErrors.name}
              helperText={touched.name && validationErrors.name}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: '#d1d5db'
                    }
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    boxShadow: '0 0 0 4px rgba(102,126,234,0.1)',
                    '& fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px'
                    }
                  }
                },
                '& input': {
                  fontSize: '0.9375rem',
                  py: 1.25,
                  color: '#1e293b'
                }
              }}
            />

            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#1e293b', fontSize: '0.875rem' }}>
              Email Address *
            </Typography>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && !!validationErrors.email}
              helperText={touched.email && validationErrors.email}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: '#d1d5db'
                    }
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    boxShadow: '0 0 0 4px rgba(102,126,234,0.1)',
                    '& fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px'
                    }
                  }
                },
                '& input': {
                  fontSize: '0.9375rem',
                  py: 1.25,
                  color: '#1e293b'
                }
              }}
            />

            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#1e293b', fontSize: '0.875rem' }}>
              Password *
            </Typography>
            <TextField
              required
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && !!validationErrors.password}
              helperText={touched.password && validationErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: '#d1d5db'
                    }
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    boxShadow: '0 0 0 4px rgba(102,126,234,0.1)',
                    '& fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px'
                    }
                  }
                },
                '& input': {
                  fontSize: '0.9375rem',
                  py: 1.25,
                  color: '#1e293b'
                }
              }}
            />

            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#1e293b', fontSize: '0.875rem' }}>
              Confirm Password *
            </Typography>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && !!validationErrors.confirmPassword}
              helperText={touched.confirmPassword && validationErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: '#d1d5db'
                    }
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    boxShadow: '0 0 0 4px rgba(102,126,234,0.1)',
                    '& fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px'
                    }
                  }
                },
                '& input': {
                  fontSize: '0.9375rem',
                  py: 1.25,
                  color: '#1e293b'
                }
              }}
            />

            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#1e293b', fontSize: '0.875rem' }}>
              Gender *
            </Typography>
            <TextField
              select
              required
              fullWidth
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.gender && !!validationErrors.gender}
              helperText={touched.gender && validationErrors.gender}
              SelectProps={{
                native: true,
              }}
              sx={{
                mb: 3.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#fafafa',
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: '#d1d5db'
                    }
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    boxShadow: '0 0 0 4px rgba(102,126,234,0.1)',
                    '& fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px'
                    }
                  }
                },
                '& select': {
                  fontSize: '0.9375rem',
                  py: 1.25,
                  color: '#1e293b'
                }
              }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </TextField>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !isFormValid()}
              sx={{
                py: 1.75,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                mb: 3,
                background: (!loading && isFormValid()) 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#cbd5e1',
                color: (!loading && isFormValid()) ? 'white' : '#64748b',
                boxShadow: (!loading && isFormValid()) 
                  ? '0 4px 14px rgba(102,126,234,0.4)'
                  : 'none',
                cursor: (!loading && isFormValid()) ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: (!loading && isFormValid())
                    ? 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                    : '#cbd5e1',
                  boxShadow: (!loading && isFormValid()) 
                    ? '0 6px 20px rgba(102,126,234,0.5)'
                    : 'none',
                  transform: (!loading && isFormValid()) ? 'translateY(-2px)' : 'none'
                },
                '&:active': {
                  transform: (!loading && isFormValid()) ? 'translateY(0px)' : 'none',
                  boxShadow: (!loading && isFormValid()) ? '0 2px 8px rgba(102,126,234,0.3)' : 'none'
                },
                '&.Mui-disabled': {
                  background: '#cbd5e1',
                  color: '#64748b',
                  boxShadow: 'none',
                  opacity: 0.7
                }
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #e2e8f0' }}>
              <Typography variant="body2" color="#64748b" sx={{ fontSize: '0.95rem' }}>
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    color: '#667eea',
                    fontWeight: 600, 
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#5568d3',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Hero Section */}
      <Box
        sx={{
          width: '50%',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          color: 'white',
          p: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Dot pattern */}
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          opacity: 0.6
        }} />
        
        {/* Soft glow effects */}
        <Box sx={{ 
          position: 'absolute', 
          top: '-10%', 
          right: '-5%', 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(60px)'
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: '-10%', 
          left: '-5%', 
          width: '350px', 
          height: '350px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.08)',
          filter: 'blur(70px)'
        }} />
        
        <Box sx={{ textAlign: 'center', maxWidth: 500, zIndex: 1 }}>
          {/* Geometric illustration - different from login */}
          <Box sx={{ 
            position: 'relative',
            width: 180,
            height: 180,
            margin: '0 auto 3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Hexagon shape */}
            <Box sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'rgba(255,255,255,0.15)',
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              backdropFilter: 'blur(10px)',
              animation: 'pulse 3s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' }
              }
            }} />
            
            {/* Inner diamond */}
            <Box sx={{
              position: 'absolute',
              width: '65%',
              height: '65%',
              background: 'rgba(255,255,255,0.25)',
              transform: 'rotate(45deg)',
              borderRadius: '8px',
              backdropFilter: 'blur(5px)'
            }} />
            
            {/* Center icon */}
            <Box sx={{
              position: 'relative',
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'white',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }}>
              <AccountCircleIcon sx={{ fontSize: 32, color: '#764ba2' }} />
            </Box>
          </Box>
          
          <Typography variant="h3" fontWeight="700" gutterBottom sx={{ fontSize: '2.75rem', mb: 2.5, lineHeight: 1.2 }}>
            Begin Your Career Path
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, lineHeight: 1.7, fontSize: '1.125rem', fontWeight: 400, maxWidth: 380, mx: 'auto' }}>
            Create your profile, showcase your skills, and apply to jobs that match your experience
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;

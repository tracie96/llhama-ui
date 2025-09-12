import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { PersonAdd, ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { authService, SignupRequest } from '../services/auth';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupRequest>({
    username: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await authService.signup(formData);
      
      if (response.status === 'success') {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: 500, width: '100%', mx: 2 }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <PersonAdd sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom color="success.main">
              Account Created Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your account has been created. You will be redirected to the login page shortly.
            </Typography>
            <CircularProgress size={24} />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Card
        elevation={8}
        sx={{
          maxWidth: 500,
          width: '100%',
          mx: 2,
          background: 'white',
          borderRadius: 4,
          boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<ArrowBack />}
              sx={{ color: 'primary.main', mr: 2, textTransform: 'none' }}
            >
              Back
            </Button>
            <PersonAdd sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Sign Up
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center' }}>
            Create your account to access the Cassava Disease Classifier
          </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleToggleConfirmPasswordVisibility}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0px 4px 12px rgba(46, 125, 50, 0.3)',
                  '&:hover': {
                    boxShadow: '0px 6px 16px rgba(46, 125, 50, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)',
                    boxShadow: 'none',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
    </Box>
  );
};

export default SignUp;

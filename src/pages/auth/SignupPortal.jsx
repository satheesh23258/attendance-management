import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  InputAdornment,
  IconButton,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Business,
  LocationOn,
  Phone,
  CheckCircle,
  AccountCircle,
  Badge,
  Work
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import ModernAuthLayout from './ModernAuthLayout';

export default function SignupPortal() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    branchName: '',
    branchLocation: '',
    employeeId: '',
    department: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP States
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      setError('Please enter an email address first.');
      return;
    }
    setVerificationLoading(true);
    setError('');
    try {
      await authAPI.sendVerificationOtp({ identifier: formData.email, type: 'email' });
      setEmailOtpSent(true);
      setSuccess('Verification code sent to your email!');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtpCode) {
      setError('Please enter the verification code.');
      return;
    }
    setVerificationLoading(true);
    setError('');
    try {
      await authAPI.verifyOtp({ identifier: formData.email, otp: emailOtpCode, purpose: 'verify_email' });
      setEmailVerified(true);
      setEmailOtpSent(false);
      setSuccess('Email successfully verified!');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) {
      setError('You must verify your email before registering.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        branchName: formData.branchName,
        branchLocation: formData.branchLocation,
        employeeId: formData.employeeId,
        department: formData.department
      });
      
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernAuthLayout isSignup={true}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="800" sx={{ color: '#1a202c', mb: 1 }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Join the Employee Management System
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <FormControl fullWidth size="small">
          <InputLabel>Role Selection</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Role Selection"
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="hr">HR Representative</MenuItem>
            <MenuItem value="admin">Administrator</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth required size="small"
            label="First Name" name="firstName"
            value={formData.firstName} onChange={handleChange}
          />
          <TextField
            fullWidth required size="small"
            label="Last Name" name="lastName"
            value={formData.lastName} onChange={handleChange}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            fullWidth required size="small"
            label="Email Address" name="email" type="email"
            value={formData.email} onChange={handleChange}
            disabled={emailVerified}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment>,
            }}
          />
          
          {formData.email && !emailVerified && (
            <Box>
              {!emailOtpSent ? (
                <Button 
                  size="small" variant="outlined" 
                  onClick={handleSendEmailOtp} disabled={verificationLoading}
                >
                  {verificationLoading ? 'Sending...' : 'Verify Email'}
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small" label="OTP Code" value={emailOtpCode}
                    onChange={(e) => setEmailOtpCode(e.target.value)}
                  />
                  <Button 
                    variant="contained" size="small" 
                    onClick={handleVerifyEmailOtp} disabled={verificationLoading || !emailOtpCode}
                  >
                    Verify
                  </Button>
                </Box>
              )}
            </Box>
          )}
          
          {emailVerified && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#00c853', fontSize: '0.85rem' }}>
              <CheckCircle fontSize="small" /> Email Verified
            </Box>
          )}
        </Box>

        <TextField
          fullWidth required size="small"
          label="Phone Number" name="phone"
          value={formData.phone} onChange={handleChange}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Phone fontSize="small" /></InputAdornment>,
          }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth required size="small"
            label="Employee ID" name="employeeId" placeholder="e.g. EMP85890"
            value={formData.employeeId} onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Badge fontSize="small" /></InputAdornment>,
            }}
          />
          <TextField
            fullWidth required size="small"
            label="Department" name="department" placeholder="e.g. IT"
            value={formData.department} onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Work fontSize="small" /></InputAdornment>,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth required size="small"
            label="Branch Name" name="branchName" placeholder="e.g. AXN"
            value={formData.branchName} onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Business fontSize="small" /></InputAdornment>,
            }}
          />
          <TextField
            fullWidth required size="small"
            label="Branch Location" name="branchLocation" placeholder="e.g. Tirupur"
            value={formData.branchLocation} onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LocationOn fontSize="small" /></InputAdornment>,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth required size="small"
            label="Password" name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password} onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth required size="small"
            label="Confirm Password" name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword} onChange={handleChange}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.2, mt: 1,
            bgcolor: '#00c853',
            color: '#fff',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 4px 14px 0 rgba(0, 200, 83, 0.39)',
            '&:hover': { bgcolor: '#00a844' }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
        </Button>
      </form>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link href="/login" sx={{ color: '#00c853', fontWeight: 600, textDecoration: 'none' }}>
            Sign In Here
          </Link>
        </Typography>
      </Box>
    </ModernAuthLayout>
  );
}

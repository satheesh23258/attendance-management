import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Alert,
  Tabs,
  Tab,
  Box,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  AdminPanelSettings,
  People
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ModernAuthLayout from './ModernAuthLayout';

const ROLE_TABS = [
  { label: 'Employee', _val: 'employee', icon: <Person fontSize="small" /> },
  { label: 'HR', _val: 'hr', icon: <People fontSize="small" /> },
  { label: 'Admin', _val: 'admin', icon: <AdminPanelSettings fontSize="small" /> },
];

export default function LoginPortal() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0); // 0: employee, 1: hr, 2: admin
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedRole = ROLE_TABS[activeTab]._val;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login({ email: formData.email, password: formData.password }, selectedRole);
      
      if (!result.success) {
        setError(result.error || `Invalid ${selectedRole} credentials. Please try again.`);
        setLoading(false);
        return;
      }

      // Successful login route
      const role = (result.user?.role || '').toLowerCase();
      const hybrid = result.user?.hybridPermissions;
      const possessesHybridTarget = hybrid?.roles?.includes(selectedRole);

      // If user logs in physically as employee but selected Admin/HR tab (and possesses hybrid), route there
      let routeRole = role;
      if (possessesHybridTarget) routeRole = selectedRole;

      const dashboard =
        routeRole === 'admin'
          ? '/dashboard/admin'
          : routeRole === 'hr'
            ? '/dashboard/hr'
            : '/dashboard/employee';

      navigate(dashboard, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernAuthLayout isSignup={false}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="800" sx={{ color: '#1a202c', mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to your account to continue
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Role Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        centered
        sx={{
          mb: 4,
          minHeight: 48,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            backgroundColor: '#00c853'
          }
        }}
      >
        {ROLE_TABS.map((tab, idx) => (
          <Tab 
            key={idx}
            icon={tab.icon} 
            iconPosition="start" 
            label={tab.label} 
            sx={{ fontWeight: 600, color: '#64748b', '&.Mui-selected': { color: '#00c853' } }} 
          />
        ))}
      </Tabs>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          required
          label="Email Address"
          name="email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            )
          }}
        />

        <TextField
          fullWidth
          required
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff sx={{ color: '#94a3b8' }} /> : <Visibility sx={{ color: '#94a3b8' }} />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Box sx={{ textAlign: 'right', mb: 3 }}>
          <Link href="/forgot-password" variant="body2" sx={{ color: '#00c853', fontWeight: 600, textDecoration: 'none' }}>
            Forgot Password?
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            py: 1.5,
            bgcolor: '#00c853',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 4px 14px 0 rgba(0, 200, 83, 0.39)',
            '&:hover': {
              bgcolor: '#00a844',
              boxShadow: '0 6px 20px rgba(0, 200, 83, 0.23)'
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : `Sign In as ${ROLE_TABS[activeTab].label}`}
        </Button>
      </form>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link href="/signup" sx={{ color: '#00c853', fontWeight: 600, textDecoration: 'none' }}>
            Create an account
          </Link>
        </Typography>
      </Box>
    </ModernAuthLayout>
  );
}

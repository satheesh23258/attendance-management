import React, { useState } from 'react'
import { authAPI } from '../../services/api'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  AdminPanelSettings,
  PersonAdd,
  Security
} from '@mui/icons-material'

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      await authAPI.register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: 'admin',
        department: formData.department,
        phone: formData.phone,
      })
      setSuccess('Admin account created successfully! Redirecting to login...')
      setTimeout(() => {
        window.location.href = '/login/admin'
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 2
    }}>
      <Container maxWidth="md">
        <Card sx={{ 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{ 
                bgcolor: '#d32f2f', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2 
              }}>
                <PersonAdd sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" color="#d32f2f" gutterBottom>
                Admin Registration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new administrator account
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Error/Success Messages */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Box>

              <TextField
                fullWidth
                label="Admin Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                placeholder="admin@company.com"
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                sx={{ mb: 2 }}
                placeholder="+1 (555) 123-4567"
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  label="Department"
                >
                  <MenuItem value="IT">Information Technology</MenuItem>
                  <MenuItem value="Management">Management</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                helperText="Minimum 8 characters"
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#b71c1c' },
                  py: 1.5,
                  fontSize: '16px'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Admin Account'}
              </Button>
            </form>

            {/* Navigation Links */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an admin account?{' '}
                <Button 
                  href="/login/admin" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  Sign In
                </Button>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Want to register as different role?{' '}
                <Button 
                  href="/signup/hr" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  HR Signup
                </Button>
                {' | '}
                <Button 
                  href="/signup/employee" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  Employee Signup
                </Button>
              </Typography>
            </Box>

            {/* Admin Privileges Notice */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Security sx={{ fontSize: 16, color: '#d32f2f' }} />
                <Typography variant="body2" color="#d32f2f" fontWeight="bold">
                  Admin Privileges
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                This account will have full system access including user management, 
                system settings, and administrative controls.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default AdminSignup

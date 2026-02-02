import React, { useState } from 'react'
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
  Divider
} from '@mui/material'
import {
  AdminPanelSettings,
  Security,
  Lock
} from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    const result = await login({ email: formData.email, password: formData.password })
    setLoading(false)

    if (!result.success) {
      setError(result.error || 'Invalid admin credentials. Please try again.')
      return
    }

    const role = (result.user?.role || '').toLowerCase()
    const dashboard =
      role === 'admin'
        ? '/dashboard/admin'
        : role === 'hr'
          ? '/dashboard/hr'
          : '/dashboard/employee'

    setSuccess('Login successful! Redirecting...')
    navigate(dashboard, { replace: true })
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
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
                <AdminPanelSettings sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" color="#d32f2f" gutterBottom>
                Admin Portal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System Administrator Login
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

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Admin Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder="admin@company.com"
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder="Enter your password"
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
                {loading ? 'Signing in...' : 'Sign In as Admin'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Demo Credentials:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: admin@company.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Password: admin123
              </Typography>
            </Box>

            {/* Navigation Links */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Not an admin?{' '}
                <Button 
                  href="/login/hr" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  HR Login
                </Button>
                {' | '}
                <Button 
                  href="/login/employee" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  Employee Login
                </Button>
              </Typography>
            </Box>

            {/* Security Notice */}
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="caption" color="text.secondary">
                Secure admin access with full system privileges
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default AdminLogin

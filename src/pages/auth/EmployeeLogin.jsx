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
  Person,
  Work,
  Lock
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const EmployeeLogin = () => {
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
      setError(result.error || 'Invalid employee credentials. Please try again.')
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
      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
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
                bgcolor: '#1976d2', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2 
              }}>
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" color="#1976d2" gutterBottom>
                Employee Portal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Employee Login
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
                label="Employee Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder="mike@company.com"
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 1 }}
                placeholder="Enter your password"
              />
              
              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Button
                  href="/forgot-password"
                  size="small"
                  sx={{ textTransform: 'none', color: '#1976d2' }}
                >
                  Forgot Password?
                </Button>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' },
                  py: 1.5,
                  fontSize: '16px'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In as Employee'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Demo Credentials:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: mike@company.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Password: employee123
              </Typography>
            </Box>

            {/* Navigation Links */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Not an employee?{' '}
                <Button 
                  href="/login/admin" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  Admin Login
                </Button>
                {' | '}
                <Button 
                  href="/login/hr" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  HR Login
                </Button>
              </Typography>
            </Box>

            {/* Employee Features */}
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Work sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="caption" color="text.secondary">
                Access your tasks, attendance, and profile
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default EmployeeLogin

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
  InputAdornment,
} from '@mui/material'
import { LockOpen, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material'

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.email || !formData.code || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required')
      return
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      setError('Password must contain uppercase, lowercase, and numbers')
      return
    }

    setLoading(true)

    try {
      await authAPI.resetPassword({
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword,
      })
      setSuccess('Password reset successfully! Redirecting to login...')
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  bgcolor: '#667eea',
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <LockOpen sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" color="#667eea" gutterBottom>
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter the OTP and your new password
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

            {!success && (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                  placeholder="you@company.com"
                />

                <TextField
                  fullWidth
                  label="OTP Code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                  placeholder="000000"
                  maxLength="6"
                />

                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                  helperText="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#764ba2' },
                    py: 1.5,
                    fontSize: '16px',
                  }}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            )}

            {/* Back to Login Link */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                href="/login"
                startIcon={<ArrowBack />}
                color="primary"
                sx={{ textTransform: 'none' }}
              >
                Back to Login
              </Button>
            </Box>

            {/* Security Notice */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                🔒 Your password will be securely hashed before storage
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ⏱️ OTP code expires in 5 minutes
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default ResetPassword

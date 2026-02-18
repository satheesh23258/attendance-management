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
} from '@mui/material'
import { LockReset, ArrowBack } from '@mui/icons-material'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email) {
      setError('Email is required')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.forgotPassword({ email })
      setOtpSent(true)
      setSuccess('OTP sent to your email if account exists')
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.')
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
                <LockReset sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" color="#667eea" gutterBottom>
                Forgot Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your email to receive an OTP code
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

            {!otpSent && (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  placeholder="you@company.com"
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
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            )}

            {otpSent && (
              <Box sx={{ textAlign: 'center' }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  If an account exists with this email, you will receive an OTP code shortly.
                  Check your inbox and spam folder.
                </Alert>
                <Button
                  href="/reset-password"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#764ba2' },
                    py: 1.5,
                  }}
                >
                  Continue to Reset Password
                </Button>
              </Box>
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
              <Typography variant="caption" color="text.secondary">
                🔒 For security, we don't confirm if an email exists in our system.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default ForgotPassword

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
  People,
  PersonAdd,
  Business
} from '@mui/icons-material'

const HRSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Human Resources',
    phone: '',
    employeeId: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

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
      // Before registering, ensure email is verified via OTP
      if (!emailVerified) {
        // send OTP and show OTP input
        await authAPI.sendOtp({ email: formData.email })
        setOtpSent(true)
        setResendTimer(60)
        setLoading(false)
        return
      }

      // Email already verified — proceed with registration
      await authAPI.register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: 'hr',
        department: formData.department,
        phone: formData.phone,
        employeeId: formData.employeeId,
      })
      setSuccess('HR account created successfully! Redirecting to login...')
      setTimeout(() => {
        window.location.href = '/login/hr'
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // OTP verify handler
  const handleVerifyOtp = async () => {
    setOtpLoading(true)
    setError('')
    try {
      await authAPI.verifyOtp({ email: formData.email, code: otpCode })
      setEmailVerified(true)
      setOtpSent(false)
      setOtpCode('')
      setSuccess('Email verified — completing registration...')
      // proceed to submit the registration
      setLoading(true)
      await authAPI.register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: 'hr',
        department: formData.department,
        phone: formData.phone,
        employeeId: formData.employeeId,
      })
      setTimeout(() => window.location.href = '/login/hr', 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed')
    } finally {
      setOtpLoading(false)
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResend = async () => {
    setError('')
    try {
      await authAPI.sendOtp({ email: formData.email })
      setResendTimer(60)
    } catch (err) {
      setError('Failed to resend OTP')
    }
  }

  // countdown for resend timer
  React.useEffect(() => {
    if (resendTimer <= 0) return
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [resendTimer])

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
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
                bgcolor: '#ff9800', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2 
              }}>
                <PersonAdd sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" color="#ff9800" gutterBottom>
                HR Registration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new HR account
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
                label="HR Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                placeholder="hr@company.com"
              />

              {/* OTP input shown after OTP is sent */}
              {otpSent && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Enter the 6-digit code sent to <strong>{formData.email}</strong>
                  </Typography>
                  <TextField
                    fullWidth
                    label="Verification Code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" onClick={handleVerifyOtp} disabled={otpLoading || otpCode.length < 6}>
                      {otpLoading ? 'Verifying...' : 'Verify & Complete'}
                    </Button>
                    <Button variant="outlined" onClick={handleResend} disabled={resendTimer > 0}>
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                    </Button>
                  </Box>
                </Box>
              )}

              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                sx={{ mb: 2 }}
                placeholder="HR001"
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
                  <MenuItem value="Human Resources">Human Resources</MenuItem>
                  <MenuItem value="Recruitment">Recruitment</MenuItem>
                  <MenuItem value="Training & Development">Training & Development</MenuItem>
                  <MenuItem value="Compensation & Benefits">Compensation & Benefits</MenuItem>
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
                disabled={loading || otpLoading}
                sx={{ 
                  bgcolor: '#ff9800',
                  '&:hover': { bgcolor: '#f57c00' },
                  py: 1.5,
                  fontSize: '16px'
                }}
              >
                {loading ? 'Creating Account...' : otpSent ? 'Check Email for OTP' : 'Create HR Account'}
              </Button>
            </form>

            {/* Navigation Links */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an HR account?{' '}
                <Button 
                  href="/login/hr" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  Sign In
                </Button>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Want to register as different role?{' '}
                <Button 
                  href="/signup/admin" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  Admin Signup
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

            {/* HR Features Notice */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Business sx={{ fontSize: 16, color: '#ff9800' }} />
                <Typography variant="body2" color="#ff9800" fontWeight="bold">
                  HR Features
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Access employee management, attendance tracking, performance reviews, 
                and HR analytics tools.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default HRSignup

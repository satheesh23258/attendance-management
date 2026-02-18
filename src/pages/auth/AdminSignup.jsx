import React, { useState } from 'react'
import { authAPI } from '../../services/api'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, PageContainer, Divider } from '../../components/ui'

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
        role: 'admin',
        department: formData.department,
        phone: formData.phone,
      })
      setTimeout(() => window.location.href = '/login/admin', 1200)
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
    <PageContainer maxWidth="md" padding="lg" className="pt-20 pb-10">
      <Card elevated className="w-full">
        <CardHeader>
          <CardTitle>Admin Registration</CardTitle>
          <p className="text-sm text-text-secondary mt-2">Create an administrator account with full system access</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 bg-error-50 border-2 border-error rounded-md">
              <p className="text-error font-medium text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border-2 border-success rounded-md">
              <p className="text-success font-medium text-sm">{success}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="text"
                label="First Name"
                placeholder="Alex"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <Input
                type="text"
                label="Last Name"
                placeholder="Admin"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <Input
              type="email"
              label="Email Address"
              placeholder="admin@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            {/* OTP Verification */}
            {otpSent && (
              <div className="p-4 bg-error-50 border-2 border-error rounded-md space-y-3">
                <p className="text-sm text-text-primary">
                  Enter the 6-digit code sent to <strong>{formData.email}</strong>
                </p>
                <Input
                  type="text"
                  label="Verification Code"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.slice(0, 6))}
                  maxLength="6"
                />
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="md"
                    loading={otpLoading}
                    disabled={otpLoading || otpCode.length < 6}
                    onClick={handleVerifyOtp}
                  >
                    Verify & Complete
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    disabled={resendTimer > 0}
                    onClick={handleResend}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                  </Button>
                </div>
              </div>
            )}

            {/* Phone */}
            <Input
              type="text"
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border-2 border-border rounded-md text-text-primary focus:outline-none focus:border-error focus:ring-2 focus:ring-red-100 transition-all"
              >
                <option value="">Select Department</option>
                <option value="IT">Information Technology</option>
                <option value="Management">Management</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Password */}
            <Input
              type="password"
              label="Password"
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              helperText="At least 8 characters, uppercase, lowercase, and number"
              required
            />

            {/* Confirm Password */}
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="danger"
              size="md"
              fullWidth
              loading={loading}
              disabled={loading}
              className="mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </Button>
          </form>
        </CardContent>

        <Divider />

        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <a href="/login/admin" className="text-brand-primary font-medium hover:text-brand-primary-dark">
              Sign In
            </a>
          </p>
          <p className="text-sm text-text-secondary">
            Register as different role?{' '}
            <a href="/signup/hr" className="text-brand-primary font-medium hover:text-brand-primary-dark">
              HR
            </a>
            {' | '}
            <a href="/signup/employee" className="text-brand-primary font-medium hover:text-brand-primary-dark">
              Employee
            </a>
          </p>

          {/* Features Notice */}
          <div className="mt-4 p-3 bg-error-50 rounded-md border-l-4 border-error">
            <h4 className="text-sm font-bold text-error mb-1">Admin Privileges</h4>
            <p className="text-xs text-text-secondary">
              Full system access including user management, system settings, and administrative controls.
            </p>
          </div>
        </CardFooter>
      </Card>
    </PageContainer>
  )

export default AdminSignup

import React, { useState } from 'react'
import { authAPI } from '../../services/api'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, PageContainer, Divider } from '../../components/ui'

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
    <PageContainer maxWidth="sm" padding="lg" className="pt-20 pb-10 min-h-screen flex items-center justify-center">
      <Card elevated className="w-full">
        <CardHeader className="bg-gradient-to-r from-brand-primary to-brand-secondary">
          <div className="text-center">
            <div className="text-4xl mb-3">🔓</div>
            <CardTitle className="text-white">Reset Your Password</CardTitle>
            <p className="text-sm text-brand-primary-100 mt-2">
              Enter the OTP and your new password
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 bg-error-50 border-2 border-error rounded-md">
              <p className="text-sm text-error font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-4 bg-success-50 border-2 border-success rounded-md">
              <p className="text-sm text-success font-medium">{success}</p>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
              />

              <Input
                type="text"
                label="OTP Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="000000"
                maxLength="6"
                required
              />

              <Input
                type="password"
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                helperText="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
                required
              />

              <Input
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>

        <Divider />

        <CardFooter className="flex flex-col items-center gap-3">
          <a href="/login" className="text-sm text-brand-primary hover:text-brand-secondary transition-colors">
            ← Back to Login
          </a>
          <div className="text-xs text-brand-secondary text-center space-y-1">
            <p>🔒 Your password will be securely hashed before storage</p>
            <p>⏱️ OTP code expires in 5 minutes</p>
          </div>
        </CardFooter>
      </Card>
    </PageContainer>
  )
}

export default ResetPassword

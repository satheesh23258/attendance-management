import React, { useState } from 'react'
import { authAPI } from '../../services/api'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, PageContainer, Divider } from '../../components/ui'

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
    <PageContainer maxWidth="sm" padding="lg" className="pt-20 pb-10 min-h-screen flex items-center justify-center">
      <Card elevated className="w-full">
        <CardHeader className="bg-gradient-to-r from-brand-primary to-brand-secondary">
          <div className="text-center">
            <div className="text-4xl mb-3">🔐</div>
            <CardTitle className="text-white">Reset Your Password</CardTitle>
            <p className="text-sm text-brand-primary-100 mt-2">
              Enter your email to receive an OTP code
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

          {!otpSent && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="Email Address"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {otpSent && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-info-50 border-2 border-info rounded-md">
                <p className="text-sm text-info font-medium">
                  If an account exists with this email, you will receive an OTP code shortly.
                  <br />
                  Check your inbox and spam folder.
                </p>
              </div>
              <Button
                href="/reset-password"
                variant="primary"
                size="md"
                fullWidth
              >
                Continue to Reset Password
              </Button>
            </div>
          )}
        </CardContent>

        <Divider />

        <CardFooter className="flex flex-col items-center gap-3">
          <a href="/login" className="text-sm text-brand-primary hover:text-brand-secondary transition-colors">
            ← Back to Login
          </a>
          <p className="text-xs text-brand-secondary text-center">
            🔒 For security, we don't confirm if an email exists in our system.
          </p>
        </CardFooter>
      </Card>
    </PageContainer>
  )
}

export default ForgotPassword

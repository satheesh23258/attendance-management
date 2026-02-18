import React, { useState } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, PageContainer, Divider } from '../../components/ui'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const HRLogin = () => {
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
      setError(result.error || 'Invalid HR credentials. Please try again.')
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
    <PageContainer maxWidth="sm" padding="lg" className="pt-20 pb-10 min-h-screen flex items-center justify-center">
      <Card elevated className="w-full">
        <CardHeader>
          <CardTitle>HR Portal</CardTitle>
          <p className="text-sm text-text-secondary mt-2">Human Resources Login</p>
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="hr@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-text-primary">Password</label>
                <a href="/forgot-password" className="text-xs text-warning hover:text-orange-600 font-medium">
                  Forgot?
                </a>
              </div>
              <Input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
              disabled={loading}
              className="mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In as HR'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-4 p-3 bg-surface rounded-md border-2 border-border">
            <h3 className="text-sm font-bold text-text-primary mb-2">Demo Credentials</h3>
            <p className="text-xs text-text-secondary">Email: hr@company.com</p>
            <p className="text-xs text-text-secondary">Password: hr123</p>
          </div>
        </CardContent>

        <Divider />

        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-text-secondary">
            Not HR?
            <a href="/login/admin" className="text-brand-primary font-medium hover:text-brand-primary-dark ml-1">
              Admin Login
            </a>
            {' | '}
            <a href="/login/employee" className="text-brand-primary font-medium hover:text-brand-primary-dark ml-1">
              Employee Login
            </a>
          </p>

          <div className="flex items-start gap-2 text-xs text-text-secondary">
            <svg className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L9.9 4.05a7 7 0 01-4.85-4.05zM9.5 1.937c-4.84.317-8.75 4.25-8.75 9.063 0 .563.036 1.12.103 1.67l7.568-7.568c-.427-.305-.87-.56-1.32-.745z" clipRule="evenodd" />
            </svg>
            <span>Access employee management and HR analytics</span>
          </div>
        </CardFooter>
      </Card>
    </PageContainer>
  )
}

export default HRLogin

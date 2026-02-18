import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { PageContainer } from '../../components/ui/PageContainer'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Divider } from '../../components/ui/PageContainer'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const result = await login(formData)
    if (result.success) {
      // Redirect based on user role
      const user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))
      if (user.role === 'admin') {
        navigate('/admin')
      } else if (user.role === 'hr') {
        navigate('/hr')
      } else {
        navigate('/employee')
      }
    }
  }

  return (
    <PageContainer maxWidth="sm" padding="lg" className="pt-20 pb-8 min-h-screen flex items-center justify-center">
      <Card elevated className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
          <p className="text-center text-sm text-text-secondary mt-2">Enter your credentials to access the system</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {errors.general && (
            <div className="p-3 bg-error-50 border-2 border-error rounded-md">
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@company.com"
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              disabled={isLoading}
            />

            <Button type="submit" variant="primary" size="md" fullWidth disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account? <Link to="/register" className="text-brand-primary hover:underline">Sign Up</Link>
            </p>
          </div>

          <Divider />

          <div className="text-center text-sm text-text-secondary space-y-1">
            <div>Demo Credentials:</div>
            <div>Admin: admin@company.com / admin123</div>
            <div>HR: hr@company.com / hr123</div>
            <div>Employee: mike@company.com / employee123</div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

export default Login

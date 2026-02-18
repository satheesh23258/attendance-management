import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { PageContainer } from '../../components/ui/PageContainer'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Divider } from '../../components/ui/PageContainer'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    role: 'employee'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const departments = [
    'IT',
    'Human Resources',
    'Sales',
    'Marketing',
    'Finance',
    'Operations',
    'Customer Support'
  ]

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
    
    if (!formData.name) {
      newErrors.name = 'Name is required'
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})
    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role || 'employee',
        department: formData.department,
        phone: formData.phone,
      })
      alert('Registration successful! Please login with your credentials.')
      navigate('/login')
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Registration failed. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <PageContainer maxWidth="md" padding="lg" className="pt-20 pb-8">
      <Card elevated className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
          <p className="text-center text-sm text-text-secondary mt-2">Create your account to get started</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {errors.general && (
            <div className="p-3 bg-error-50 border-2 border-error rounded-md">
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Your full name"
              disabled={isLoading}
            />

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
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="e.g. +1 555 555 5555"
              disabled={isLoading}
            />

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border-2 rounded-md text-text-primary"
                disabled={isLoading}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-sm text-error mt-2">{errors.department}</p>}
            </div>

            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText="Min 6 characters"
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            <Button type="submit" variant="primary" size="md" fullWidth disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-text-secondary">Already have an account? <Link to="/login" className="text-brand-primary hover:underline">Sign In</Link></p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

export default Register

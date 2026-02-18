import React from 'react'
import { PageContainer } from '../../components/ui/PageContainer'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const LoginPortal = () => {
  const loginOptions = [
    {
      title: 'Admin Login',
      description: 'System Administrator Access',
      icon: <AdminPanelSettings />,
      color: '#d32f2f',
      bgColor: '#ffebee',
      route: '/login/admin',
      features: ['Full System Control', 'User Management', 'System Settings', 'Reports']
    },
    {
      title: 'HR Login',
      description: 'Human Resources Portal',
      icon: <People />,
      color: '#ff9800',
      bgColor: '#fff3e0',
      route: '/login/hr',
      features: ['Employee Management', 'Attendance Tracking', 'Performance Reviews', 'Analytics']
    },
    {
      title: 'Employee Login',
      description: 'Employee Portal',
      icon: <Person />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
      route: '/login/employee',
      features: ['Task Management', 'Check In/Out', 'Location Tracking', 'Profile']
    }
  ]

  return (
    <PageContainer maxWidth="4xl" padding="lg" className="pt-20 pb-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl font-bold text-brand-primary">A</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Employee Management System</h1>
        <p className="text-sm text-text-secondary mt-2">Choose your role to access the system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loginOptions.map((option, index) => (
          <Card key={index} elevated className="overflow-hidden">
            <CardContent>
              <div className="text-center mb-3">
                <div className="w-16 h-16 rounded-md mx-auto mb-3" style={{ background: option.color }}>
                  <div className="w-full h-full flex items-center justify-center text-white">{option.icon}</div>
                </div>
                <h3 className="text-lg font-bold" style={{ color: option.color }}>{option.title}</h3>
                <p className="text-sm text-text-secondary">{option.description}</p>
              </div>

              <div className="mb-4 min-h-[120px]">
                <p className="text-sm text-text-secondary font-medium">Access Features:</p>
                {option.features.map((feature, idx) => (
                  <p className="text-xs text-text-secondary" key={idx}>• {feature}</p>
                ))}
              </div>

              <Button href={option.route} variant="outline" fullWidth>
                Sign In
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="bg-surface p-4 rounded-md">
          <h4 className="text-lg font-medium">Demo Credentials</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-sm text-text-secondary"><strong>Admin:</strong><br/>admin@company.com<br/>admin123</div>
            <div className="text-sm text-text-secondary"><strong>HR:</strong><br/>hr@company.com<br/>hr123</div>
            <div className="text-sm text-text-secondary"><strong>Employee:</strong><br/>mike@company.com<br/>employee123</div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-secondary">Don't have an account? <a href="/signup" className="text-brand-primary hover:underline">Sign Up Here</a></p>
      </div>
    </PageContainer>
  )
}

export default LoginPortal

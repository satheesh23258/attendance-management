import React from 'react'
import { PageContainer } from '../../components/ui/PageContainer'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const SignupPortal = () => {
  const signupOptions = [
    {
      title: 'Admin Registration',
      description: 'Create System Administrator Account',
      icon: <AdminPanelSettings />,
      color: '#d32f2f',
      bgColor: '#ffebee',
      route: '/signup/admin',
      features: ['Full System Control', 'User Management', 'System Settings', 'Administrative Access'],
      requirements: ['Management approval', 'System access clearance', 'Security training']
    },
    {
      title: 'HR Registration',
      description: 'Create HR Account',
      icon: <People />,
      color: '#ff9800',
      bgColor: '#fff3e0',
      route: '/signup/hr',
      features: ['Employee Management', 'Attendance Tracking', 'Performance Reviews', 'HR Analytics'],
      requirements: ['HR department approval', 'HR certification', 'Data privacy training']
    },
    {
      title: 'Employee Registration',
      description: 'Create Employee Account',
      icon: <Person />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
      route: '/signup/employee',
      features: ['Task Management', 'Check In/Out', 'Location Tracking', 'Personal Profile'],
      requirements: ['Employment verification', 'Department assignment', 'Onboarding completion']
    }
  ]

  return (
    <PageContainer maxWidth="4xl" padding="lg" className="pt-20 pb-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
          <span className="text-3xl font-bold text-brand-primary">A</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Create Your Account</h1>
        <p className="text-sm text-text-secondary mt-2">Choose your role to register for the system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {signupOptions.map((option, index) => (
          <Card key={index} elevated className="overflow-hidden">
            <CardContent>
              <div className="text-center mb-3">
                <div className="w-16 h-16 rounded-md mx-auto mb-3" style={{ background: option.color }}>
                  <div className="w-full h-full flex items-center justify-center text-white">{option.icon}</div>
                </div>
                <h3 className="text-lg font-bold" style={{ color: option.color }}>{option.title}</h3>
                <p className="text-sm text-text-secondary">{option.description}</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-text-secondary font-medium">Account Features:</p>
                {option.features.map((feature, idx) => (
                  <p className="text-xs text-text-secondary" key={idx}>• {feature}</p>
                ))}
              </div>

              <div className="mb-4 p-3 rounded-md" style={{ background: option.bgColor }}>
                <p className="text-sm font-medium" style={{ color: option.color }}>Requirements:</p>
                {option.requirements.map((req, idx) => (
                  <p className="text-xs text-text-secondary" key={idx}>✓ {req}</p>
                ))}
              </div>

              <Button href={option.route} variant="outline" fullWidth>
                Sign Up
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="bg-surface p-4 rounded-md">
          <h4 className="text-lg font-medium">Important Notice</h4>
          <p className="text-sm text-text-secondary">Account registration requires approval from your department administrator. Please ensure you have the necessary permissions before proceeding with registration.</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-secondary">Already have an account? <a href="/login" className="text-brand-primary hover:underline">Sign In Here</a></p>
      </div>
    </PageContainer>
  )
}

export default SignupPortal

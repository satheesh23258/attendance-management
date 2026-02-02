import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Avatar,
  Grid,
  Paper
} from '@mui/material'
import {
  AdminPanelSettings,
  People,
  Person,
  PersonAdd
} from '@mui/icons-material'

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
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Avatar sx={{ 
            bgcolor: 'white', 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 3 
          }}>
            <PersonAdd sx={{ fontSize: 40, color: '#667eea' }} />
          </Avatar>
          <Typography variant="h3" color="white" gutterBottom fontWeight="bold">
            Create Your Account
          </Typography>
          <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
            Choose your role to register for the system
          </Typography>
        </Box>

        {/* Signup Options */}
        <Grid container spacing={4}>
          {signupOptions.map((option, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                },
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Icon and Title */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar sx={{ 
                      bgcolor: option.color, 
                      width: 70, 
                      height: 70, 
                      mx: 'auto', 
                      mb: 2 
                    }}>
                      {option.icon}
                    </Avatar>
                    <Typography variant="h5" color={option.color} gutterBottom fontWeight="bold">
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Account Features:</strong>
                    </Typography>
                    {option.features.map((feature, idx) => (
                      <Typography variant="caption" color="text.secondary" key={idx} sx={{ display: 'block', mb: 0.5 }}>
                        • {feature}
                      </Typography>
                    ))}
                  </Box>

                  {/* Requirements */}
                  <Box sx={{ mb: 3, p: 2, bgcolor: option.bgColor, borderRadius: 1 }}>
                    <Typography variant="caption" color={option.color} gutterBottom>
                      <strong>Requirements:</strong>
                    </Typography>
                    {option.requirements.map((req, idx) => (
                      <Typography variant="caption" color="text.secondary" key={idx} sx={{ display: 'block', mb: 0.5 }}>
                        ✓ {req}
                      </Typography>
                    ))}
                  </Box>

                  {/* Signup Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    href={option.route}
                    sx={{ 
                      bgcolor: option.color,
                      '&:hover': { bgcolor: option.color, opacity: 0.9 },
                      py: 1.5,
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    Sign Up
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Important Notice */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: 'rgba(255,255,255,0.1)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Typography variant="h6" color="white" gutterBottom>
              Important Notice
            </Typography>
            <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
              Account registration requires approval from your department administrator. 
              Please ensure you have the necessary permissions before proceeding with registration.
            </Typography>
          </Paper>
        </Box>

        {/* Login Links */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
            Already have an account?{' '}
            <Button 
              href="/login" 
              sx={{ 
                color: 'white', 
                textTransform: 'none',
                textDecoration: 'underline',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Sign In Here
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default SignupPortal

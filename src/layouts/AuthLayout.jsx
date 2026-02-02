import React from 'react'
import { Box, Container, Paper, Typography } from '@mui/material'

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Employee Management System
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Attendance, Service & Location Tracking
            </Typography>
          </Box>
          {children}
        </Paper>
      </Container>
    </Box>
  )
}

export default AuthLayout

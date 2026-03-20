import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function ModernAuthLayout({ children, isSignup }) {
  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
    }}>
      {/* Left side: Background Image & Company Info */}
      <Box sx={{
        flex: { xs: 0, md: 5.5 },
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        position: 'relative',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 6,
        color: '#fff',
      }}>
        <Box sx={{
          mb: 4, 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: 3,
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-1px', mb: 1 }}>
            Employee Management System
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
            Modern Attendance, HR & Operations Platform
          </Typography>
        </Box>
      </Box>

      {/* Right side: Glassmorphism Auth Panel */}
      <Box sx={{
        flex: { xs: 12, md: 6.5 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        position: 'relative',
        p: { xs: 2, sm: 4, md: 6 }
      }}>
        <Paper elevation={0} sx={{
          width: '100%',
          maxWidth: 550,
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        }}>
          {children}
        </Paper>
      </Box>
    </Box>
  );
}

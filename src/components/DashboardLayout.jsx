import React from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Container
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import UserProfile from './UserProfile'
import { useTheme } from '../contexts/ThemeContext'

const DashboardLayout = ({ children, title }) => {
  const location = useLocation()
  const { colors } = useTheme()

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x)
    
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.875rem' }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1
          
          return isLast ? (
            <Typography key={name} color="text.primary" sx={{ fontWeight: 500 }}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
          ) : (
            <MuiLink
              component={Link}
              to={routeTo}
              underline="hover"
              color="inherit"
              key={name}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </MuiLink>
          )
        })}
      </Breadcrumbs>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: colors.background.paper,
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          color: '#1e293b'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          {/* Left side - Title and Breadcrumbs */}
          <Box sx={{ flex: 1 }}>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                {title}
              </Typography>
            )}
            {generateBreadcrumbs()}
          </Box>

          {/* Right side - User Profile */}
          <UserProfile />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, backgroundColor: colors.background.default }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default DashboardLayout

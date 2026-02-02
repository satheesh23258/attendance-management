import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem
} from '@mui/material'
import {
  Notifications,
  Settings,
  ExitToApp,
  TrendingUp,
  People,
  Schedule,
  Assignment,
  LocationOn,
  Assessment,
  Refresh,
  Download,
  ArrowBack
} from '@mui/icons-material'
import { useParams } from 'react-router-dom'

const EnhancedDashboard = ({ userRole, userName, onLogout }) => {
  const { role } = useParams()
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get role from props or URL params
  const currentRole = userRole || role || 'employee'
  const currentUserName = userName || 'Demo User'

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [currentRole])

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  const getRoleColor = () => {
    switch (currentRole) {
      case 'admin': return '#d32f2f'
      case 'hr': return '#ff9800'
      case 'employee': return '#1976d2'
      default: return '#666666'
    }
  }

  const getRoleIcon = () => {
    switch (currentRole) {
      case 'admin': return '👨‍💼'
      case 'hr': return '👥'
      case 'employee': return '👤'
      default: return '👤'
    }
  }

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ fontSize: 32, opacity: 0.7 }}>{icon}</Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" color={color} sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Box sx={{ 
          backgroundColor: getRoleColor(), 
          color: 'white', 
          p: 3, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={() => window.history.back()}>
              <ArrowBack />
            </IconButton>
            <Avatar sx={{ bgcolor: 'white', color: getRoleColor() }}>
              {getRoleIcon()}
            </Avatar>
            <Box>
              <Typography variant="h4">
                {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Dashboard
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Welcome back, {currentUserName}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 3 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
            Loading dashboard...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: getRoleColor(), 
        color: 'white', 
        p: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={() => window.history.back()}>
            <ArrowBack />
          </IconButton>
          <Avatar sx={{ bgcolor: 'white', color: getRoleColor() }}>
            {getRoleIcon()}
          </Avatar>
          <Box>
            <Typography variant="h4">
              {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Dashboard
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Welcome back, {currentUserName}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notifications */}
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Refresh */}
          <IconButton color="inherit">
            <Refresh />
          </IconButton>

          {/* User Menu */}
          <IconButton color="inherit" onClick={handleMenuClick}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'white', color: getRoleColor() }}>
              {currentUserName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Dashboard Statistics
        </Typography>
        
        <Grid container spacing={3}>
          {currentRole === 'admin' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Total Employees" 
                  value="156" 
                  subtitle="Active workforce"
                  icon="👥"
                  color="#d32f2f"
                        <>
                          <Grid item xs={6}>
                            <Button variant="outlined" fullWidth startIcon={<Schedule />}>
                              Check In/Out
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button variant="outlined" fullWidth startIcon={<LocationOn />}>
                              My Location
                            </Button>
                          </Grid>
                        </>
                      )}
                      <Grid item xs={6}>
                        <Button variant="outlined" fullWidth startIcon={<Download />}>
                          Export Data
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button variant="outlined" fullWidth startIcon={<FilterList />}>
                          Advanced Filters
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Box>

      {/* Notifications Dialog */}
      <Dialog open={openNotificationDialog} onClose={() => setOpenNotificationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Notifications color={notification.read ? 'disabled' : 'primary'} />
                </ListItemIcon>
                <ListItemText
                  primary={notification.title}
                  secondary={`${notification.message} • ${notification.time}`}
                  primaryTypographyProps={{
                    fontWeight: notification.read ? 'normal' : 'bold'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotificationDialog(false)}>Close</Button>
          <Button variant="contained">Mark All as Read</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EnhancedDashboard

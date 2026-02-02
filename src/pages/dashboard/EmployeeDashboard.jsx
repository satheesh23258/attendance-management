import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Avatar,
  Paper,
  Alert
} from '@mui/material'
import {
  AccessTime,
  Assignment,
  LocationOn,
  CheckCircle,
  Schedule,
  PlayArrow,
  Stop,
  Notifications,
  TrendingUp
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { mockServices, mockAttendance, mockNotifications } from '../../services/mockData'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [myServices, setMyServices] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Get today's attendance for current user
    const today = new Date().toISOString().split('T')[0]
    const attendance = mockAttendance.find(a => 
      a.employeeId === user?.id && a.date === today
    )
    setTodayAttendance(attendance)
    setIsCheckedIn(attendance && !attendance.checkOut)

    // Get user's services
    const userServices = mockServices.filter(s => s.assignedTo === user?.id)
    setMyServices(userServices)

    // Get recent notifications
    setNotifications(mockNotifications.slice(0, 3))

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [user])

  const navigate = useNavigate()

  const handleCheckIn = () => {
    // Simulate check-in
    setIsCheckedIn(true)
    setTodayAttendance({
      checkIn: currentTime.toLocaleTimeString(),
      status: 'present'
    })
  }

  const handleCheckOut = () => {
    // Simulate check-out
    setIsCheckedIn(false)
    setTodayAttendance(prev => ({
      ...prev,
      checkOut: currentTime.toLocaleTimeString()
    }))
  }

  const getServiceColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ed6c02'
      case 'in_progress':
        return '#1976d2'
      case 'completed':
        return '#2e7d32'
      default:
        return '#757575'
    }
  }

  const getServicePriority = (priority) => {
    switch (priority) {
      case 'high':
        return '#d32f2f'
      case 'medium':
        return '#ed6c02'
      case 'low':
        return '#2e7d32'
      default:
        return '#757575'
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Employee Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" mb={3}>
        Welcome back, {user?.name}! Here's your overview for today.
      </Typography>

      {/* Welcome Alert */}
      {!todayAttendance && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Don't forget to check in when you arrive at work!
        </Alert>
      )}

      {/* Quick Actions */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Time
                  </Typography>
                  <Typography variant="h4">
                    {currentTime.toLocaleTimeString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: isCheckedIn ? '#2e7d32' : '#ed6c02' }}>
                  {isCheckedIn ? <CheckCircle /> : <Schedule />}
                </Avatar>
              </Box>
              
              {todayAttendance ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Check-in: {todayAttendance.checkIn}
                  </Typography>
                  {todayAttendance.checkOut && (
                    <Typography variant="body2" color="text.secondary">
                      Check-out: {todayAttendance.checkOut}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Not checked in yet
                </Typography>
              )}
              
              <Box mt={2}>
                {!isCheckedIn ? (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayArrow />}
                    onClick={handleCheckIn}
                    disabled={!!todayAttendance?.checkOut}
                  >
                    Check In
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Stop />}
                    onClick={handleCheckOut}
                    color="error"
                  >
                    Check Out
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Services
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Services
                  </Typography>
                  <Typography variant="h4">
                    {myServices.filter(s => s.status === 'in_progress').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                  <Assignment />
                </Avatar>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Pending: {myServices.filter(s => s.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed: {myServices.filter(s => s.status === 'completed').length}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                startIcon={<Assignment />}
                onClick={() => navigate('/employee/services')}
              >
                View All Services
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Services and Notifications */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Assigned Services
              </Typography>
              <List>
                {myServices.slice(0, 3).map((service) => (
                  <ListItem key={service.id} alignItems="flex-start">
                    <ListItemIcon>
                      <Assignment color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2">
                            {service.title}
                          </Typography>
                          <Box>
                            <Chip
                              label={service.status}
                              size="small"
                              sx={{
                                backgroundColor: getServiceColor(service.status),
                                color: 'white',
                                mr: 1
                              }}
                            />
                            <Chip
                              label={service.priority}
                              size="small"
                              sx={{
                                backgroundColor: getServicePriority(service.priority),
                                color: 'white'
                              }}
                            />
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {service.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Due: {new Date(service.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              {myServices.length > 3 && (
                  <Box textAlign="center" mt={2}>
                  <Button
                    variant="text"
                    onClick={() => navigate('/employee/services')}
                  >
                    View All Services
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Notifications
              </Typography>
              <List>
                {notifications.map((notification) => (
                  <ListItem key={notification.id} alignItems="flex-start">
                    <ListItemIcon>
                      <Notifications color={notification.isRead ? 'disabled' : 'primary'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Box textAlign="center" mt={2}>
                <Button
                  variant="text"
                  onClick={() => navigate('/employee/notifications')}
                >
                  View All Notifications
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
                  <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AccessTime />}
                onClick={() => navigate('/employee/attendance')}
              >
                Attendance History
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<LocationOn />}
                onClick={() => navigate('/employee/location')}
              >
                My Location
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Assignment />}
                onClick={() => navigate('/employee/services')}
              >
                My Services
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<TrendingUp />}
                onClick={() => navigate('/employee/profile')}
              >
                My Profile
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EmployeeDashboard

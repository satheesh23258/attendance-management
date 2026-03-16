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
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Badge,
  IconButton
} from '@mui/material'
import {
  AccessTime,
  Assignment,
  LocationOn,
  TrendingUp,
  CheckCircle,
  Schedule,
  PlayArrow,
  Stop,
  Notifications,
  People,
  Event,
  Security,
  Person,
  Assessment,
  EventNote,
  Timeline,
  ArrowBack,
  ReceiptLong,
  ContactSupport
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { attendanceAPI, serviceAPI, notificationAPI } from '../../services/api'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/DashboardLayout'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const { colors } = useTheme()
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [myServices, setMyServices] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Initialize with default values first
    setTodayAttendance({
      checkIn: null,
      checkOut: null,
      status: 'Absent'
    })
    setIsCheckedIn(false)

    const loadEmployeeData = async () => {
      try {
        // Fetch today's attendance for current user
        const attendanceRes = await attendanceAPI.getMyTodayAttendance()
        const userAttendance = attendanceRes.data || null
        
        setTodayAttendance(userAttendance)
        setIsCheckedIn(userAttendance?.checkIn && !userAttendance?.checkOut)

        // Fetch actual services assigned to me
        const servicesRes = await serviceAPI.getMyServices()
        setMyServices(servicesRes.data || [])

        // Fetch real notifications
        const notifRes = await notificationAPI.getAll()
        setNotifications(notifRes.data?.data || notifRes.data || [])
      } catch (error) {
        console.warn('Failed to load employee data:', error.message)
      }
    }

    loadEmployeeData()

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [user])

  const navigate = useNavigate()

  const handleCheckIn = () => navigate('/employee/checkinout')
  const handleCheckOut = () => navigate('/employee/checkinout')

  const getServiceColor = (status) => {
    switch (status) {
      case 'pending':
        return colors.secondary.main
      case 'in_progress':
        return colors.primary.main
      case 'completed':
        return '#00c853'
      default:
        return '#000000'
    }
  }

  const getServicePriority = (priority) => {
    switch (priority) {
      case 'high':
        return '#000000'
      case 'medium':
        return '#00c853'
      case 'low':
        return '#00c853'
      default:
        return '#000000'
    }
  }

  return (
    <DashboardLayout title="Employee Dashboard">
      {/* Header Banner */}
      <Box sx={{
        background: '#00c853',
        color: 'white',
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            title="Go back"
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Employee Dashboard
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Welcome back, {user?.name || 'Employee'}! Manage your attendance and services here.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user?.hybridPermissions?.permissions?.canManageAttendance && (
            <Button
              variant="contained"
              color="inherit"
              startIcon={<AccessTime />}
              onClick={() => navigate('/hr/attendance-management')}
              sx={{ 
                bgcolor: 'white', 
                color: '#00c853', 
                fontWeight: 'bold',
                mr: 2,
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Manage Attendance
            </Button>
          )}
          <Box sx={{ textAlign: 'right' }}>
             <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 600 }}>
                System Role: EMPLOYEE PORTAL
             </Typography>
             <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Status: Active Session
             </Typography>
          </Box>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { text: 'My Attendance', icon: <CheckCircle />, path: '/employee/checkinout', color: '#00c853' },
          { text: 'My Profile', icon: <Person />, path: '/employee/profile', color: '#00c853' },
          { text: 'Expense Claims', icon: <ReceiptLong />, path: '/employee/expenses', color: '#00c853' },
          { text: 'Attendance History', icon: <AccessTime />, path: '/employee/attendance', color: '#00c853' }
        ].map((action, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                bgcolor: 'white',
                border: `1px solid ${action.color}`,
                boxShadow: `0 4px 12px ${action.color}15`,
                '&:hover': { transform: 'translateY(-4px)', transition: '0.3s', bgcolor: action.color, '& *': { color: 'white' } }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ color: action.color, mb: 1.5 }}>
                  {action.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#333' }}>
                  {action.text}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Welcome Alert */}
      {!todayAttendance?.checkIn && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Don't forget to check in when you arrive at work!
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Attendance Status
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Current Time
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary.main }}>
                    {currentTime.toLocaleTimeString()}
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: isCheckedIn ? '#00c853' : colors.secondary.main,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  {isCheckedIn ? <CheckCircle fontSize="large" /> : <Schedule fontSize="large" />}
                </Avatar>
              </Box>

              <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 2, mb: 3 }}>
                {todayAttendance ? (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">CHECK-IN</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{todayAttendance.checkIn || '--:--'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">CHECK-OUT</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{todayAttendance.checkOut || '--:--'}</Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                    No attendance record found for today
                  </Typography>
                )}
              </Box>

              <Box>
                {todayAttendance?.checkOut ? (
                  <Button
                    variant="contained"
                    fullWidth
                    disabled
                    startIcon={<CheckCircle />}
                    sx={{ py: 1.5, borderRadius: 2, bgcolor: '#e0e0e0 !important' }}
                  >
                    Shift Completed
                  </Button>
                ) : !isCheckedIn ? (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayArrow />}
                    onClick={handleCheckIn}
                    sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Check In Now
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Stop />}
                    onClick={handleCheckOut}
                    color="error"
                    sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Check Out Now
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                My Services
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Active Tasks
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary.main }}>
                    {myServices.filter(s => s.status === 'in_progress').length}
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: colors.primary.main,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  <Assignment fontSize="large" />
                </Avatar>
              </Box>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#fef9c3', p: 1.5, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#854d0e' }}>
                      {myServices.filter(s => s.status === 'pending').length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#854d0e' }}>Pending</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#dcfce7', p: 1.5, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#166534' }}>
                      {myServices.filter(s => s.status === 'completed').length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#166534' }}>Completed</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Assignment />}
                onClick={() => navigate('/employee/services')}
                sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                View Service Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Notifications */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Notifications
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/employee/notifications')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <List>
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification, index) => (
                    <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 48 }}>
                        {notification.type === 'attendance' && <AccessTime color="primary" />}
                        {notification.type === 'service' && <Assignment color="secondary" />}
                        {notification.type === 'leave' && <Schedule color="warning" />}
                        {notification.type === 'system' && <Error color="error" />}
                        {notification.type === 'general' && <Notifications color="action" />}
                        {!['attendance', 'service', 'leave', 'system', 'general'].includes(notification.type) && <Notifications color="action" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{notification.title}</Typography>}
                        secondary={
                          <Box component="span">
                            <Typography variant="body2" component="span" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.disabled" sx={{ mt: 0.5 }}>
                              {new Date(notification.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
                    No new notifications
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}

export default EmployeeDashboard

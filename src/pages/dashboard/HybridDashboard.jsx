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
  Badge
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
  TrendingUp,
  People,
  Event,
  Security,
  Person,
  Assessment,
  EventNote,
  Timeline,
  EventBusy as LeaveRequest
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  attendanceAPI,
  serviceAPI,
  notificationAPI,
  employeeAPI
} from '../../services/api'
import DashboardLayout from '../../components/DashboardLayout'
import axios from 'axios'

const HybridDashboard = () => {
  const { user } = useAuth()
  const { colors } = useTheme()
  const navigate = useNavigate()
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [myServices, setMyServices] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hybridPermission, setHybridPermission] = useState(null)

  useEffect(() => {
    fetchHybridPermission()
    fetchEmployeeData()
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const fetchHybridPermission = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/hybrid-permissions/my-permission', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHybridPermission(response.data)
    } catch (error) {
      console.error('Error fetching hybrid permission:', error)
    }
  }

  const fetchEmployeeData = async () => {
    try {
      // Get today's attendance for current user
      const attRes = await attendanceAPI.getTodayAttendance()
      if (attRes.data && attRes.data.length > 0) {
        setTodayAttendance(attRes.data[0])
        setIsCheckedIn(!attRes.data[0].checkOut)
      } else {
        setTodayAttendance(null)
        setIsCheckedIn(false)
      }

      // Get user's services
      const srvRes = await serviceAPI.getAll({ assignedTo: user?.id })
      setMyServices(srvRes.data || [])

      // Get recent notifications
      const notifRes = await notificationAPI.getAll({ limit: 3 })
      setNotifications(notifRes.data || [])
    } catch (error) {
      console.error('Error fetching employee data:', error)
    }
  }

  const handleCheckIn = async () => {
    try {
      const res = await attendanceAPI.checkIn({
        location: { latitude: 0, longitude: 0, address: 'Office' }
      })
      setIsCheckedIn(true)
      setTodayAttendance(res.data.attendance)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCheckOut = async () => {
    try {
      const res = await attendanceAPI.checkOut({
        location: { latitude: 0, longitude: 0, address: 'Office' }
      })
      setIsCheckedIn(false)
      setTodayAttendance(res.data.attendance)
    } catch (error) {
      console.error(error)
    }
  }

  const getServiceColor = (status) => {
    switch (status) {
      case 'pending': return colors.secondary.main
      case 'in_progress': return colors.primary.main
      case 'completed': return '#00c853'
      default: return '#000000'
    }
  }

  const getServicePriority = (priority) => {
    switch (priority) {
      case 'high': return '#000000'
      case 'medium': return '#00c853'
      case 'low': return '#00c853'
      default: return '#000000'
    }
  }

  return (
    <DashboardLayout title="Hybrid Dashboard">
      {/* Hybrid Permission Alert */}
      {hybridPermission && hybridPermission.hasHybridPermission && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small">
              View Details
            </Button>
          }
        >
          You have hybrid access with special permissions. Granted by {hybridPermission.permission?.grantedBy}.
        </Alert>
      )}

      {/* Employee Dashboard Content (Single View) */}
      <Box sx={{ p: 0 }}>
        <Typography variant="h5" gutterBottom sx={{ color: colors.primary.main, fontWeight: 600 }}>
          Employee Dashboard
        </Typography>
        
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
                  <Avatar sx={{ bgcolor: isCheckedIn ? colors.primary.main : colors.secondary.main }}>
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
        </Grid>

        {/* Special Hybrid Actions */}
        {hybridPermission?.permission?.permissions?.canManageAttendance && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2, color: colors.secondary.main, fontWeight: 600 }}>
              Special Permissions
            </Typography>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderLeft: `4px solid ${colors.primary.main}`, height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar sx={{ bgcolor: colors.primary.main }}>
                        <Assessment />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">Attendance Management</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monitor and manage employee records
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => navigate('/hr/attendance-management')}
                      sx={{ textTransform: 'none', borderRadius: 1.5 }}
                    >
                      Open Management
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              {hybridPermission?.permission?.permissions?.canAccessHR && (
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderLeft: `4px solid ${colors.secondary.main}`, height: '100%' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar sx={{ bgcolor: colors.secondary.main }}>
                          <LocationOn />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">Live Tracking</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Real-time employee location monitoring
                          </Typography>
                        </Box>
                      </Box>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        fullWidth 
                        onClick={() => navigate('/location/tracking')}
                        sx={{ textTransform: 'none', borderRadius: 1.5 }}
                      >
                        Open Monitoring
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Box>
    </DashboardLayout>
  )
}

export default HybridDashboard

import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Alert
} from '@mui/material'
import {
  AccessTime,
  LocationOn,
  CheckCircle,
  Schedule,
  TrendingUp,
  Assessment
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { mockAttendance, mockUsers } from '../../services/mockData'
import { toast } from 'react-hot-toast'

const AttendanceDashboard = () => {
  const { user } = useAuth()
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [recentAttendance, setRecentAttendance] = useState([])
  const currentTimeState = useState(new Date())
  const [currentTime, setCurrentTime] = currentTimeState

  useEffect(() => {
    // Get today's attendance for current user
    let storedAttendance = []
    try {
      storedAttendance = JSON.parse(localStorage.getItem('mockAttendance')) || []
    } catch (e) {
      storedAttendance = []
    }
    const today = new Date().toISOString().split('T')[0]
    const combined = [...storedAttendance, ...mockAttendance]
    const attendance = combined.find(a => a.employeeId === user?.id && a.date === today)
    setTodayAttendance(attendance)

    // Get recent attendance history (stored first)
    const recent = combined
      .filter(a => a.employeeId === user?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
    setRecentAttendance(recent)

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [user])

  // derive checked-in state from today's attendance
  const isCheckedIn = Boolean(todayAttendance && !todayAttendance.checkOut)

  const calculateMonthlyStats = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthAttendance = mockAttendance.filter(a => {
      const attendanceDate = new Date(a.date)
      return a.employeeId === user?.id && 
             attendanceDate.getMonth() === currentMonth &&
             attendanceDate.getFullYear() === currentYear
    })

    const presentDays = monthAttendance.filter(a => a.status === 'present').length
    const totalHours = monthAttendance.reduce((sum, a) => sum + (a.workingHours || 0), 0)
    const avgHours = presentDays > 0 ? (totalHours / presentDays).toFixed(1) : 0

    return {
      presentDays,
      totalHours,
      avgHours
    }
  }

  const monthlyStats = calculateMonthlyStats()

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#2e7d32'
      case 'absent':
        return '#d32f2f'
      case 'late':
        return '#ed6c02'
      default:
        return '#757575'
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Attendance Management
      </Typography>

      {/* Current Status Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: isCheckedIn ? '#2e7d32' : '#ed6c02',
                    mr: 2,
                    width: 64,
                    height: 64
                  }}
                >
                  {isCheckedIn ? <CheckCircle sx={{ fontSize: 32 }} /> : <Schedule sx={{ fontSize: 32 }} />}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {isCheckedIn ? 'Currently Checked In' : 'Not Checked In'}
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {currentTime.toLocaleTimeString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentTime.toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              {todayAttendance && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Today's Attendance
                  </Typography>
                  <Typography variant="h6">
                    Check-in: {todayAttendance.checkIn}
                  </Typography>
                  {todayAttendance.checkOut && (
                    <Typography variant="h6">
                      Check-out: {todayAttendance.checkOut}
                    </Typography>
                  )}
                  {todayAttendance.workingHours > 0 && (
                    <Typography variant="h6">
                      Working Hours: {todayAttendance.workingHours}h
                    </Typography>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Check-in/check-out removed */}
        </CardContent>
      </Card>

      {/* Monthly Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Present This Month
                  </Typography>
                  <Typography variant="h4">
                    {monthlyStats.presentDays}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Days
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Hours
                  </Typography>
                  <Typography variant="h4">
                    {monthlyStats.totalHours}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hours
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                  <AccessTime />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Average Hours
                  </Typography>
                  <Typography variant="h4">
                    {monthlyStats.avgHours}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Per day
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ed6c02', width: 56, height: 56 }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Attendance History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Attendance History
          </Typography>
          <List>
            {recentAttendance.map((record) => (
              <ListItem key={record.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getStatusColor(record.status) }}>
                    <AccessTime />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2">
                        {new Date(record.date).toLocaleDateString()}
                      </Typography>
                      <Chip
                        label={record.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(record.status),
                          color: 'white'
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Check-in: {record.checkIn} | Check-out: {record.checkOut || 'Not checked out'}
                      </Typography>
                      <Typography variant="body2">
                        Working Hours: {record.workingHours}h
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Location: {record.location?.address || 'N/A'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Check-in/check-out removed per request */}
    </Box>
  )
}

export default AttendanceDashboard

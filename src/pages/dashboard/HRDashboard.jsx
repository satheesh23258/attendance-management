import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button
} from '@mui/material'
import {
  People,
  Assignment,
  LocationOn,
  TrendingUp,
  AccessTime,
  CheckCircle,
  Pending,
  Schedule,
  Warning,
  Error as ErrorIcon,
  Notifications,
  ArrowBack
} from '@mui/icons-material'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { employeeAPI, attendanceAPI, notificationAPI } from '../../services/api'
import { useTheme } from '../../contexts/ThemeContext'
import DashboardLayout from '../../components/DashboardLayout'

const HRDashboard = () => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    averageHours: 0,
    pendingLeaves: 5
  })

  const [topPerformers, setTopPerformers] = useState([])
  const [attendanceTrend, setAttendanceTrend] = useState([])
  const [departmentStats, setDepartmentStats] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const loadHRDashboardData = async () => {
      try {
        // Fetch all employees from database
        const employeesRes = await employeeAPI.getAll()
        const employees = employeesRes.data?.data || employeesRes.data || []

        // Try to fetch today's attendance
        let presentToday = 0
        try {
          const attendanceRes = await attendanceAPI.getTodayAttendance()
          presentToday = attendanceRes.data?.filter(a => a.status === 'present').length || 0
        } catch (err) {
          console.warn('Failed to fetch attendance:', err.message)
        }

        // Fetch pending leaves
        let pendingLeaves = 0
        try {
          const leavesRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leaves`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          pendingLeaves = (leavesRes.data || []).filter(l => l.status === 'pending').length
        } catch (err) {
          console.warn('Failed to fetch leaves:', err.message)
        }

        setStats({
          totalEmployees: employees.length,
          presentToday,
          averageHours: 8.5,
          pendingLeaves
        })

        // Set top performers from real employees
        const performers = employees.slice(0, 3).map((emp, idx) => ({
          name: emp.name,
          completedTasks: Math.random() * 50 | 0,
          score: 70 + Math.random() * 30 | 0
        }))
        setTopPerformers(performers)

        // Set department stats calculated from real employees
        const deptMap = {}
        employees.forEach(emp => {
          const dept = emp.department || 'Other'
          deptMap[dept] = (deptMap[dept] || 0) + 1
        })

        const deptStats = Object.entries(deptMap).map(([dept, count]) => ({
          department: dept,
          score: Math.min(100, 70 + (count * 5))
        }))
        setDepartmentStats(deptStats)

        // Fetch notifications
        try {
          const notifRes = await notificationAPI.getAll()
          setNotifications(notifRes.data?.data || notifRes.data || [])
        } catch (err) {
          console.warn('Failed to fetch notifications:', err.message)
        }
      } catch (error) {
        console.warn('Failed to load HR dashboard data:', error.message)
        // Continue with empty data - don't break the page
      }
    }

    // Set attendance trend data
    const trendData = [
      { month: 'Current', present: stats.presentToday, absent: stats.totalEmployees - stats.presentToday }
    ]
    setAttendanceTrend(trendData)

    loadHRDashboardData()
  }, [user])

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <People />,
      color: colors.primary.main,
      change: '+2%',
      changeType: 'increase'
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: <AccessTime />,
      color: colors.secondary.main,
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Average Hours',
      value: stats.averageHours,
      icon: <Schedule />,
      color: '#00c853',
      change: '+0.5',
      changeType: 'increase'
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: <Warning />,
      color: '#000000',
      change: '-1',
      changeType: 'decrease'
    }
  ]

  return (
    <DashboardLayout title="HR Dashboard">
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
              HR Dashboard
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Overview of organization attendance and metrics
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
           <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 600 }}>
              System Role: HUMAN RESOURCES PORTAL
           </Typography>
           <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Status: Active Session
           </Typography>
        </Box>
      </Box>



      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ color: card.color }}>
                      {card.value}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendingUp
                        sx={{
                          color: card.changeType === 'increase' ? '#00c853' : '#000000',
                          mr: 0.5,
                          fontSize: 16
                        }}
                      />
                      <Typography
                        variant="body2"
                        color={card.changeType === 'increase' ? '#00c853' : '#000000'}
                      >
                        {card.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: '#00c853', color: '#ffffff' }}>
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Attendance
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Count</TableCell>
                      <TableCell>Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Chip label="Present" color="success" size="small" />
                      </TableCell>
                      <TableCell>{stats.presentToday}</TableCell>
                      <TableCell>
                        {stats.totalEmployees > 0 ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Absent" color="error" size="small" />
                      </TableCell>
                      <TableCell>{stats.totalEmployees - stats.presentToday}</TableCell>
                      <TableCell>
                        {stats.totalEmployees > 0 ? Math.round(((stats.totalEmployees - stats.presentToday) / stats.totalEmployees) * 100) : 0}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Notifications */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Notifications
                </Typography>
                <Button size="small" component={Link} to="/notifications" sx={{ textTransform: 'none' }}>
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
                        {notification.type === 'system' && <ErrorIcon color="error" />}
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
                  <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
                    No recent notifications.
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

export default HRDashboard

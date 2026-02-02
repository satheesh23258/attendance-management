import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import {
  People,
  AccessTime,
  TrendingUp,
  Assignment,
  CheckCircle,
  Warning,
  Schedule,
  LocationOn
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts'
import { mockUsers, mockAttendance, mockReports } from '../../services/mockData'

const HRDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    averageHours: 0,
    pendingLeaves: 5
  })

  const [attendanceTrend, setAttendanceTrend] = useState([])
  const [topPerformers, setTopPerformers] = useState([])
  const [departmentStats, setDepartmentStats] = useState([])
  const [recentAttendance, setRecentAttendance] = useState([])

  useEffect(() => {
    // Calculate stats
    const presentToday = mockAttendance.filter(a => 
      a.date === new Date().toISOString().split('T')[0] && a.status === 'present'
    ).length

    const averageHours = mockAttendance.reduce((acc, a) => acc + a.workingHours, 0) / mockAttendance.length

    setStats({
      totalEmployees: mockUsers.length,
      presentToday,
      averageHours: averageHours.toFixed(1),
      pendingLeaves: 5
    })

    // Set attendance trend data
    setAttendanceTrend(mockReports.attendanceStats.monthlyData)

    // Set top performers
    setTopPerformers(mockReports.performanceStats.topPerformers)

    // Set department stats
    setDepartmentStats(mockReports.performanceStats.departmentPerformance)

    // Set recent attendance
    const todayAttendance = mockAttendance.filter(a => 
      a.date === new Date().toISOString().split('T')[0]
    ).slice(0, 5)
    setRecentAttendance(todayAttendance)
  }, [])

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <People />,
      color: '#1976d2',
      subtitle: 'Active workforce'
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: <CheckCircle />,
      color: '#2e7d32',
      subtitle: `${((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}% attendance rate`
    },
    {
      title: 'Avg Working Hours',
      value: `${stats.averageHours}h`,
      icon: <Schedule />,
      color: '#ed6c02',
      subtitle: 'Daily average'
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: <Warning />,
      color: '#d32f2f',
      subtitle: 'Awaiting approval'
    }
  ]

  const getAttendanceColor = (status) => {
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
        HR Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" mb={3}>
        Manage workforce and monitor attendance patterns.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {card.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {card.subtitle}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: card.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance Trend (6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="present" 
                    stackId="1"
                    stroke="#2e7d32" 
                    fill="#2e7d32"
                    fillOpacity={0.6}
                    name="Present"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="absent" 
                    stackId="1"
                    stroke="#d32f2f" 
                    fill="#d32f2f"
                    fillOpacity={0.6}
                    name="Absent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Department Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentStats} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="department" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tables Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performers
              </Typography>
              <List>
                {topPerformers.map((performer, index) => (
                  <ListItem key={performer.name}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1976d2' }}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={performer.name}
                      secondary={`${performer.completedTasks} tasks completed`}
                    />
                    <Box textAlign="right">
                      <Typography variant="h6" color="primary">
                        {performer.score}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={performer.score}
                        sx={{ width: 100, mt: 1 }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Attendance
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Check In</TableCell>
                      <TableCell>Check Out</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.employeeName}</TableCell>
                        <TableCell>{record.checkIn}</TableCell>
                        <TableCell>{record.checkOut || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.status}
                            size="small"
                            sx={{
                              backgroundColor: getAttendanceColor(record.status),
                              color: 'white'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                startIcon={<People />}
                onClick={() => navigate('/admin/employees')}
              >
                Manage Employees
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Assignment />}
                onClick={() => navigate('/admin/services')}
              >
                View Services
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<LocationOn />}
                onClick={() => navigate('/location/live')}
              >
                Live Tracking
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<TrendingUp />}
                onClick={() => navigate('/admin/reports')}
              >
                View Reports
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default HRDashboard

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
  Chip,
  LinearProgress,
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
  Error
} from '@mui/icons-material'
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
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { mockUsers, mockServices, mockAttendance, mockReports } from '../../services/mockData'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    activeServices: 0,
    liveLocations: 0
  })

  const [recentActivities, setRecentActivities] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [serviceData, setServiceData] = useState([])

  useEffect(() => {
    // Calculate stats
    const presentToday = mockAttendance.filter(a => 
      a.date === new Date().toISOString().split('T')[0] && a.status === 'present'
    ).length

    const activeServices = mockServices.filter(s => 
      s.status === 'pending' || s.status === 'in_progress'
    ).length

    setStats({
      totalEmployees: mockUsers.length,
      presentToday,
      activeServices,
      liveLocations: 3 // Mock live locations
    })

    // Set recent activities
    const activities = [
      {
        id: 1,
        user: 'Mike Employee',
        action: 'Checked in',
        time: '09:00 AM',
        avatar: 'https://i.pravatar.cc/150?img=3',
        type: 'attendance'
      },
      {
        id: 2,
        user: 'Jane Developer',
        action: 'Completed service',
        time: '08:30 AM',
        avatar: 'https://i.pravatar.cc/150?img=4',
        type: 'service'
      },
      {
        id: 3,
        user: 'Sarah HR',
        action: 'Created new service',
        time: '08:00 AM',
        avatar: 'https://i.pravatar.cc/150?img=5',
        type: 'service'
      }
    ]
    setRecentActivities(activities)

    // Set chart data
    setAttendanceData(mockReports.attendanceStats.monthlyData)
    setServiceData(mockReports.serviceStats.monthlyData)
  }, [])

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <People />,
      color: '#1976d2',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: <AccessTime />,
      color: '#2e7d32',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Active Services',
      value: stats.activeServices,
      icon: <Assignment />,
      color: '#ed6c02',
      change: '-3%',
      changeType: 'decrease'
    },
    {
      title: 'Live Locations',
      value: stats.liveLocations,
      icon: <LocationOn />,
      color: '#9c27b0',
      change: '+8%',
      changeType: 'increase'
    }
  ]

  const pieData = [
    { name: 'Present', value: stats.presentToday, color: '#2e7d32' },
    { name: 'Absent', value: stats.totalEmployees - stats.presentToday, color: '#d32f2f' }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'attendance':
        return <AccessTime color="primary" />
      case 'service':
        return <Assignment color="secondary" />
      default:
        return <TrendingUp />
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" mb={3}>
        Welcome back! Here's an overview of your organization.
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
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendingUp 
                        sx={{ 
                          color: card.changeType === 'increase' ? '#2e7d32' : '#d32f2f',
                          mr: 0.5,
                          fontSize: 16
                        }} 
                      />
                      <Typography 
                        variant="body2" 
                        color={card.changeType === 'increase' ? '#2e7d32' : '#d32f2f'}
                      >
                        {card.change} from last month
                      </Typography>
                    </Box>
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
                Attendance Overview (6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#1976d2" 
                    strokeWidth={2}
                    name="Present"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="absent" 
                    stroke="#d32f2f" 
                    strokeWidth={2}
                    name="Absent"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Attendance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Service Statistics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Priority Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="high" stackId="a" fill="#d32f2f" name="High" />
                  <Bar dataKey="medium" stackId="a" fill="#ed6c02" name="Medium" />
                  <Bar dataKey="low" stackId="a" fill="#2e7d32" name="Low" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar src={activity.avatar}>
                        {activity.user.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2">
                            {activity.user}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" mt={0.5}>
                          {getActivityIcon(activity.type)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {activity.action}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
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
            {/** Use React Router navigate for client routing */}
            <Grid item xs={12} sm={6} md={3}>
              <ManageButton to="/admin/employees" startIcon={<People />} label="Manage Employees" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ManageButton to="/admin/services" startIcon={<Assignment />} label="View Services" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ManageButton to="/location/live" startIcon={<LocationOn />} label="Live Tracking" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ManageButton to="/admin/reports" startIcon={<TrendingUp />} label="View Reports" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminDashboard

// small helper component placed at end of file to keep import list tidy
function ManageButton({ to, startIcon, label }) {
  const navigate = useNavigate()
  return (
    <Button
      variant="contained"
      fullWidth
      startIcon={startIcon}
      onClick={() => navigate(to)}
    >
      {label}
    </Button>
  )
}

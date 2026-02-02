import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  LinearProgress,
  Chip
} from '@mui/material'
import {
  Download,
  Assignment,
  TrendingUp,
  Schedule,
  Person,
  Assessment,
  Category
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
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { mockServices, mockUsers, mockReports } from '../../services/mockData'

const ServiceAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [analyticsData, setAnalyticsData] = useState({
    monthlyTrend: [],
    categoryStats: [],
    employeeStats: [],
    completionRate: []
  })

  const categories = ['all', ...Array.from(new Set(mockServices.map(s => s.category)))]
  const statuses = ['all', 'pending', 'in_progress', 'completed']

  const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#9c27b0', '#795548']

  useEffect(() => {
    calculateAnalytics()
  }, [selectedPeriod, selectedCategory, selectedStatus])

  const calculateAnalytics = () => {
    // Filter services based on selections
    let filteredServices = mockServices

    if (selectedCategory !== 'all') {
      filteredServices = filteredServices.filter(s => s.category === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      filteredServices = filteredServices.filter(s => s.status === selectedStatus)
    }

    // Monthly trend data
    const monthlyTrend = mockReports.serviceStats.monthlyData

    // Category statistics
    const categoryStats = categories.filter(cat => cat !== 'all').map(category => {
      const categoryServices = mockServices.filter(s => s.category === category)
      const completed = categoryServices.filter(s => s.status === 'completed').length
      const inProgress = categoryServices.filter(s => s.status === 'in_progress').length
      const pending = categoryServices.filter(s => s.status === 'pending').length
      
      return {
        category,
        total: categoryServices.length,
        completed,
        inProgress,
        pending,
        completionRate: categoryServices.length > 0 ? (completed / categoryServices.length * 100).toFixed(1) : 0
      }
    })

    // Employee statistics
    const employeeStats = mockUsers.map(employee => {
      const employeeServices = mockServices.filter(s => s.assignedTo === employee.id)
      const completed = employeeServices.filter(s => s.status === 'completed').length
      const inProgress = employeeServices.filter(s => s.status === 'in_progress').length
      const pending = employeeServices.filter(s => s.status === 'pending').length
      
      // Calculate average completion time (mock data)
      const avgCompletionTime = completed > 0 ? Math.floor(Math.random() * 5) + 1 : 0
      
      return {
        id: employee.id,
        name: employee.name,
        department: employee.department,
        total: employeeServices.length,
        completed,
        inProgress,
        pending,
        completionRate: employeeServices.length > 0 ? (completed / employeeServices.length * 100).toFixed(1) : 0,
        avgCompletionTime
      }
    }).sort((a, b) => b.completionRate - a.completionRate)

    // Completion rate over time (mock data)
    const completionRate = [
      { month: 'Jan', rate: 85 },
      { month: 'Feb', rate: 88 },
      { month: 'Mar', rate: 92 },
      { month: 'Apr', rate: 87 },
      { month: 'May', rate: 90 },
      { month: 'Jun', rate: 94 }
    ]

    setAnalyticsData({
      monthlyTrend,
      categoryStats,
      employeeStats,
      completionRate
    })
  }

  const handleExport = (format) => {
    console.log(`Exporting service analytics as ${format}`)
    alert(`Service analytics exported as ${format.toUpperCase()}`)
  }

  const getEmployeeAvatar = (employeeId) => {
    const employee = mockUsers.find(u => u.id === employeeId)
    return employee ? employee.avatar : ''
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Service Analytics
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleExport('pdf')}
            sx={{ mr: 1 }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => handleExport('excel')}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="quarter">Last Quarter</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Status"
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {mockServices.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Services
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {mockServices.filter(s => s.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="info.main">
                  {mockServices.filter(s => s.status === 'in_progress').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">
                  {analyticsData.employeeStats.length > 0 
                    ? (analyticsData.employeeStats.reduce((sum, emp) => sum + parseFloat(emp.completionRate), 0) / analyticsData.employeeStats.length).toFixed(1)
                    : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Completion Rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Volume Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="high"
                    stackId="1"
                    stroke="#d32f2f"
                    fill="#d32f2f"
                    fillOpacity={0.6}
                    name="High Priority"
                  />
                  <Area
                    type="monotone"
                    dataKey="medium"
                    stackId="1"
                    stroke="#ed6c02"
                    fill="#ed6c02"
                    fillOpacity={0.6}
                    name="Medium Priority"
                  />
                  <Area
                    type="monotone"
                    dataKey="low"
                    stackId="1"
                    stroke="#2e7d32"
                    fill="#2e7d32"
                    fillOpacity={0.6}
                    name="Low Priority"
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
                Completion Rate Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.completionRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#1976d2"
                    strokeWidth={2}
                    name="Completion Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completionRate" fill="#1976d2" name="Completion Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: mockServices.filter(s => s.status === 'completed').length, color: '#2e7d32' },
                      { name: 'In Progress', value: mockServices.filter(s => s.status === 'in_progress').length, color: '#1976d2' },
                      { name: 'Pending', value: mockServices.filter(s => s.status === 'pending').length, color: '#ed6c02' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Completed', value: mockServices.filter(s => s.status === 'completed').length, color: '#2e7d32' },
                      { name: 'In Progress', value: mockServices.filter(s => s.status === 'in_progress').length, color: '#1976d2' },
                      { name: 'Pending', value: mockServices.filter(s => s.status === 'pending').length, color: '#ed6c02' }
                    ].map((entry, index) => (
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

      {/* Employee Performance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Employee Service Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Total Services</TableCell>
                  <TableCell>Completed</TableCell>
                  <TableCell>In Progress</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>Completion Rate</TableCell>
                  <TableCell>Avg Completion Time</TableCell>
                  <TableCell>Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.employeeStats.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={getEmployeeAvatar(employee.id)}
                          sx={{ mr: 2, width: 32, height: 32 }}
                        >
                          <Person />
                        </Avatar>
                        {employee.name}
                      </Box>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.total}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.completed}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.inProgress}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.pending}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {employee.completionRate}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(employee.completionRate)}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{employee.avgCompletionTime} days</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.completionRate >= 90 ? 'Excellent' : 
                               employee.completionRate >= 75 ? 'Good' :
                               employee.completionRate >= 60 ? 'Average' : 'Poor'}
                        size="small"
                        color={employee.completionRate >= 90 ? 'success' :
                               employee.completionRate >= 75 ? 'primary' :
                               employee.completionRate >= 60 ? 'warning' : 'error'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ServiceAnalytics

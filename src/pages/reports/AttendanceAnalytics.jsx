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
  TrendingUp,
  AccessTime,
  CalendarToday,
  Person,
  Assessment
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
import { mockAttendance, mockUsers, mockReports } from '../../services/mockData'

const AttendanceAnalytics = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [analyticsData, setAnalyticsData] = useState({
    monthlyTrend: [],
    departmentStats: [],
    employeeStats: [],
    weeklyPattern: []
  })

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const departments = ['all', ...Array.from(new Set(mockUsers.map(u => u.department)))]

  const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#9c27b0', '#795548']

  useEffect(() => {
    calculateAnalytics()
  }, [selectedMonth, selectedYear, selectedDepartment])

  const calculateAnalytics = () => {
    // Filter attendance data based on selections
    let filteredAttendance = mockAttendance

    if (selectedDepartment !== 'all') {
      const departmentEmployees = mockUsers
        .filter(u => u.department === selectedDepartment)
        .map(u => u.id)
      filteredAttendance = filteredAttendance.filter(a => 
        departmentEmployees.includes(a.employeeId)
      )
    }

    // Monthly trend data
    const monthlyTrend = mockReports.attendanceStats.monthlyData

    // Department statistics
    const departmentStats = mockReports.performanceStats.departmentPerformance

    // Employee statistics
    const employeeStats = mockUsers.map(employee => {
      const employeeAttendance = filteredAttendance.filter(a => a.employeeId === employee.id)
      const presentDays = employeeAttendance.filter(a => a.status === 'present').length
      const totalHours = employeeAttendance.reduce((sum, a) => sum + (a.workingHours || 0), 0)
      const avgHours = presentDays > 0 ? (totalHours / presentDays).toFixed(1) : 0
      const attendanceRate = employeeAttendance.length > 0 
        ? ((presentDays / employeeAttendance.length) * 100).toFixed(1) 
        : 0

      return {
        id: employee.id,
        name: employee.name,
        department: employee.department,
        presentDays,
        totalDays: employeeAttendance.length,
        avgHours: parseFloat(avgHours),
        attendanceRate: parseFloat(attendanceRate)
      }
    }).sort((a, b) => b.attendanceRate - a.attendanceRate)

    // Weekly pattern (mock data)
    const weeklyPattern = [
      { day: 'Monday', present: 95, absent: 5 },
      { day: 'Tuesday', present: 92, absent: 8 },
      { day: 'Wednesday', present: 88, absent: 12 },
      { day: 'Thursday', present: 90, absent: 10 },
      { day: 'Friday', present: 85, absent: 15 }
    ]

    setAnalyticsData({
      monthlyTrend,
      departmentStats,
      employeeStats,
      weeklyPattern
    })
  }

  const handleExport = (format) => {
    console.log(`Exporting attendance analytics as ${format}`)
    alert(`Attendance analytics exported as ${format.toUpperCase()}`)
  }

  const getEmployeeAvatar = (employeeId) => {
    const employee = mockUsers.find(u => u.id === employeeId)
    return employee ? employee.avatar : ''
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Attendance Analytics
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
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Month"
                >
                  {months.map((month, index) => (
                    <MenuItem key={month} value={index}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Year"
                >
                  {Array.from({ start: 2020, end: new Date().getFullYear() + 1 }, (_, i) => 2020 + i).map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
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
                  {analyticsData.employeeStats.length > 0 
                    ? (analyticsData.employeeStats.reduce((sum, emp) => sum + emp.attendanceRate, 0) / analyticsData.employeeStats.length).toFixed(1)
                    : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Attendance Rate
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
                  {analyticsData.employeeStats.filter(emp => emp.attendanceRate >= 90).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Excellent Attendance (90%+)
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
                  {analyticsData.employeeStats.length > 0 
                    ? (analyticsData.employeeStats.reduce((sum, emp) => sum + emp.avgHours, 0) / analyticsData.employeeStats.length).toFixed(1)
                    : 0}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Working Hours
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
                  {analyticsData.employeeStats.filter(emp => emp.attendanceRate < 75).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Need Improvement (&lt;75%)
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
                Monthly Attendance Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.monthlyTrend}>
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
                Weekly Pattern
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.weeklyPattern}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#2e7d32" name="Present %" />
                </BarChart>
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
                Department Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.departmentStats} layout="horizontal">
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

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Excellent (90%+)', value: analyticsData.employeeStats.filter(emp => emp.attendanceRate >= 90).length, color: '#2e7d32' },
                      { name: 'Good (80-89%)', value: analyticsData.employeeStats.filter(emp => emp.attendanceRate >= 80 && emp.attendanceRate < 90).length, color: '#1976d2' },
                      { name: 'Average (70-79%)', value: analyticsData.employeeStats.filter(emp => emp.attendanceRate >= 70 && emp.attendanceRate < 80).length, color: '#ed6c02' },
                      { name: 'Poor (<70%)', value: analyticsData.employeeStats.filter(emp => emp.attendanceRate < 70).length, color: '#d32f2f' }
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
                      { name: 'Excellent (90%+)', value: analyticsData.employeeStats.filter(emp => emp.attendanceRate >= 90).length, color: '#2e7d32' },
                      { name: 'Good (80-89%)', value: analyticsData.employeeStats.filter(emp => emp.attendanceRate >= 80 && emp.attendanceRate < 90).length, color: '#1976d2' },
                      { name: 'Average (70-79%)', value: analyticsData.employeeStats.filter(emp => emp.attendanceRate >= 70 && emp.attendanceRate < 80).length, color: '#ed6c02' },
                      { name: 'Poor (<70%)', value: analyticsData.employeeStats.filter(emp => emp.attendanceRate < 70).length, color: '#d32f2f' }
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

      {/* Employee Ranking Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Employee Attendance Ranking
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Present Days</TableCell>
                  <TableCell>Total Days</TableCell>
                  <TableCell>Avg Hours</TableCell>
                  <TableCell>Attendance Rate</TableCell>
                  <TableCell>Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.employeeStats.map((employee, index) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <Chip
                        label={`#${index + 1}`}
                        color={index < 3 ? 'primary' : 'default'}
                        variant={index < 3 ? 'filled' : 'outlined'}
                        size="small"
                      />
                    </TableCell>
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
                    <TableCell>{employee.presentDays}</TableCell>
                    <TableCell>{employee.totalDays}</TableCell>
                    <TableCell>{employee.avgHours}h</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {employee.attendanceRate}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={employee.attendanceRate}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.attendanceRate >= 90 ? 'Excellent' : 
                               employee.attendanceRate >= 80 ? 'Good' :
                               employee.attendanceRate >= 70 ? 'Average' : 'Poor'}
                        size="small"
                        color={employee.attendanceRate >= 90 ? 'success' :
                               employee.attendanceRate >= 80 ? 'primary' :
                               employee.attendanceRate >= 70 ? 'warning' : 'error'}
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

export default AttendanceAnalytics

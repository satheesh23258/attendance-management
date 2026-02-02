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
  TextField,
  Chip,
  Avatar,
  LinearProgress,
  IconButton
} from '@mui/material'
import {
  Download,
  FilterList,
  DateRange,
  AccessTime,
  TrendingUp,
  Assessment,
  CalendarToday
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
  Bar
} from 'recharts'
import { mockAttendance, mockUsers, mockReports } from '../../services/mockData'

const AttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [chartData, setChartData] = useState([])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ start: 2020, end: new Date().getFullYear() + 1 }, (_, i) => 2020 + i)

  useEffect(() => {
    setAttendanceData(mockAttendance)
    setFilteredData(mockAttendance)
    setChartData(mockReports.attendanceStats.monthlyData)
  }, [])

  useEffect(() => {
    filterData()
  }, [selectedMonth, selectedYear, selectedEmployee, attendanceData])

  const filterData = () => {
    let filtered = attendanceData

    // Filter by month and year
    filtered = filtered.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getMonth() === selectedMonth && 
             recordDate.getFullYear() === selectedYear
    })

    // Filter by employee
    if (selectedEmployee !== 'all') {
      filtered = filtered.filter(record => record.employeeId === parseInt(selectedEmployee))
    }

    setFilteredData(filtered)
  }

  const calculateStats = () => {
    const totalDays = filteredData.length
    const presentDays = filteredData.filter(r => r.status === 'present').length
    const absentDays = filteredData.filter(r => r.status === 'absent').length
    const totalHours = filteredData.reduce((sum, r) => sum + (r.workingHours || 0), 0)
    const avgHours = presentDays > 0 ? (totalHours / presentDays).toFixed(1) : 0

    return {
      totalDays,
      presentDays,
      absentDays,
      totalHours,
      avgHours,
      attendanceRate: totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0
    }
  }

  const stats = calculateStats()

  const getEmployeeName = (employeeId) => {
    const employee = mockUsers.find(u => u.id === employeeId)
    return employee ? employee.name : 'Unknown'
  }

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

  const handleExport = (format) => {
    // Simulate export functionality
    console.log(`Exporting attendance report as ${format}`)
    alert(`Attendance report exported as ${format.toUpperCase()}`)
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Attendance Reports
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
          <Typography variant="h6" gutterBottom>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filters
          </Typography>
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
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  label="Employee"
                >
                  <MenuItem value="all">All Employees</MenuItem>
                  {mockUsers.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Days
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalDays}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                  <CalendarToday />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Present Days
                  </Typography>
                  <Typography variant="h4">
                    {stats.presentDays}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.attendanceRate}% rate
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Absent Days
                  </Typography>
                  <Typography variant="h4">
                    {stats.absentDays}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#d32f2f', width: 56, height: 56 }}>
                  <Assessment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Avg Hours
                  </Typography>
                  <Typography variant="h4">
                    {stats.avgHours}h
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ed6c02', width: 56, height: 56 }}>
                  <AccessTime />
                </Avatar>
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
                Attendance Trend (6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#2e7d32" 
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
                Monthly Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'Present', value: stats.presentDays, fill: '#2e7d32' },
                  { name: 'Absent', value: stats.absentDays, fill: '#d32f2f' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Attendance Records
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Working Hours</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                          {getEmployeeName(record.employeeId).charAt(0)}
                        </Avatar>
                        {getEmployeeName(record.employeeId)}
                      </Box>
                    </TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut || '-'}</TableCell>
                    <TableCell>{record.workingHours}h</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(record.status),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>{record.location?.address || '-'}</TableCell>
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

export default AttendanceReport

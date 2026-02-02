import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  LinearProgress
} from '@mui/material'
import {
  ArrowBack,
  Download,
  FilterList,
  CalendarToday,
  AccessTime,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material'

const AttendanceReports = () => {
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      date: '2024-01-26',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      status: 'Present',
      duration: '9h 0m',
      overtime: '0h 0m',
      department: 'Engineering'
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      date: '2024-01-26',
      checkIn: '08:45 AM',
      checkOut: '06:15 PM',
      status: 'Present',
      duration: '9h 30m',
      overtime: '0h 30m',
      department: 'HR'
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      date: '2024-01-26',
      checkIn: '09:15 AM',
      checkOut: '05:45 PM',
      status: 'Late',
      duration: '8h 30m',
      overtime: '0h 0m',
      department: 'Sales'
    },
    {
      id: 4,
      employeeName: 'Sarah Williams',
      employeeId: 'EMP004',
      date: '2024-01-26',
      checkIn: '--',
      checkOut: '--',
      status: 'Absent',
      duration: '0h 0m',
      overtime: '0h 0m',
      department: 'Marketing'
    },
    {
      id: 5,
      employeeName: 'Tom Brown',
      employeeId: 'EMP005',
      date: '2024-01-26',
      checkIn: '08:30 AM',
      checkOut: '07:30 PM',
      status: 'Present',
      duration: '11h 0m',
      overtime: '2h 0m',
      department: 'Engineering'
    }
  ])

  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleBack = () => {
    window.history.back()
  }

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setOpenDialog(true)
  }

  const handleExport = () => {
    alert('Export functionality would download attendance data as CSV/Excel file')
  }

  const filteredData = attendanceData.filter(record => {
    return (
      (!filterDepartment || record.department === filterDepartment) &&
      (!filterStatus || record.status === filterStatus) &&
      (!filterDate || record.date === filterDate)
    )
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'success'
      case 'Late': return 'warning'
      case 'Absent': return 'error'
      case 'Half Day': return 'info'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <CheckCircle color="success" />
      case 'Late': return <Schedule color="warning" />
      case 'Absent': return <Cancel color="error" />
      case 'Half Day': return <AccessTime color="info" />
      default: return <CalendarToday />
    }
  }

  const departments = ['All', 'Engineering', 'HR', 'Sales', 'Marketing', 'Finance']
  const statuses = ['All', 'Present', 'Late', 'Absent', 'Half Day']

  const getStatistics = () => {
    const total = filteredData.length
    const present = filteredData.filter(r => r.status === 'Present').length
    const late = filteredData.filter(r => r.status === 'Late').length
    const absent = filteredData.filter(r => r.status === 'Absent').length
    const avgAttendance = total > 0 ? ((present / total) * 100).toFixed(1) : 0

    return { total, present, late, absent, avgAttendance }
  }

  const stats = getStatistics()

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: '#ed6c02', 
        color: 'white', 
        p: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            Attendance Reports
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="inherit"
          startIcon={<Download />}
          onClick={handleExport}
        >
          Export Report
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Records
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {stats.present}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Present
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {stats.late}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Late
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {stats.absent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Rate */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Overall Attendance Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={parseFloat(stats.avgAttendance)} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="h6" color="primary">
                {stats.avgAttendance}%
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    label="Department"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept === 'All' ? '' : dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status === 'All' ? '' : status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setFilterDepartment('')
                    setFilterStatus('')
                    setFilterDate('')
                  }}
                  sx={{ height: '56px' }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Attendance Records
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Overtime</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {record.employeeName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {record.employeeId} • {record.department}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>{record.duration}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color={record.overtime !== '0h 0m' ? 'warning.main' : 'text.secondary'}>
                          {record.overtime}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(record.status)}
                          <Chip 
                            label={record.status}
                            color={getStatusColor(record.status)}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleViewDetails(record)}
                          size="small"
                        >
                          <FilterList />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Attendance Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  value={selectedRecord.employeeName}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  value={selectedRecord.employeeId}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  value={selectedRecord.date}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Status"
                  value={selectedRecord.status}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Check In"
                  value={selectedRecord.checkIn}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Check Out"
                  value={selectedRecord.checkOut}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Duration"
                  value={selectedRecord.duration}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Overtime"
                  value={selectedRecord.overtime}
                  disabled
                  margin="normal"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AttendanceReports

import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
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
  LinearProgress,
  Rating
} from '@mui/material'
import {
  ArrowBack,
  TrendingUp,
  TrendingDown,
  Star,
  Person,
  Assessment,
  FilterList,
  Visibility
} from '@mui/icons-material'

const Performance = () => {
  const [performanceData, setPerformanceData] = useState([
    {
      id: 1,
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      overallRating: 4.8,
      quality: 4.5,
      productivity: 4.9,
      teamwork: 4.7,
      punctuality: 4.8,
      initiative: 4.6,
      reviewPeriod: 'Q4 2023',
      reviewer: 'Jane Smith',
      strengths: ['Excellent problem solving', 'Strong technical skills', 'Good team player'],
      improvements: ['Time management', 'Documentation'],
      goals: ['Complete advanced certification', 'Mentor junior developers']
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      department: 'HR',
      position: 'HR Manager',
      overallRating: 4.5,
      quality: 4.7,
      productivity: 4.3,
      teamwork: 4.8,
      punctuality: 4.9,
      initiative: 4.4,
      reviewPeriod: 'Q4 2023',
      reviewer: 'Mike Wilson',
      strengths: ['Excellent communication', 'Leadership skills', 'Process improvement'],
      improvements: ['Strategic planning', 'Data analysis'],
      goals: ['Implement HR analytics', 'Develop leadership training']
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      department: 'Sales',
      position: 'Sales Representative',
      overallRating: 3.8,
      quality: 3.5,
      productivity: 4.2,
      teamwork: 3.9,
      punctuality: 3.7,
      initiative: 3.6,
      reviewPeriod: 'Q4 2023',
      reviewer: 'Sarah Williams',
      strengths: ['Customer relationship', 'Sales skills', 'Persistence'],
      improvements: ['Product knowledge', 'Closing techniques'],
      goals: ['Increase sales by 15%', 'Complete product training']
    },
    {
      id: 4,
      employeeName: 'Sarah Williams',
      employeeId: 'EMP004',
      department: 'Marketing',
      position: 'Marketing Specialist',
      overallRating: 4.2,
      quality: 4.3,
      productivity: 4.1,
      teamwork: 4.4,
      punctuality: 4.0,
      initiative: 4.5,
      reviewPeriod: 'Q4 2023',
      reviewer: 'Tom Brown',
      strengths: ['Creative thinking', 'Campaign management', 'Analytics'],
      improvements: ['Budget management', 'Cross-functional collaboration'],
      goals: ['Launch 3 successful campaigns', 'Improve ROI by 10%']
    }
  ])

  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterRating, setFilterRating] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const handleBack = () => {
    window.history.back()
  }

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee)
    setOpenDialog(true)
  }

  const filteredData = performanceData.filter(employee => {
    return (
      (!filterDepartment || employee.department === filterDepartment) &&
      (!filterRating || 
        (filterRating === '5' && employee.overallRating >= 4.5) ||
        (filterRating === '4' && employee.overallRating >= 3.5 && employee.overallRating < 4.5) ||
        (filterRating === '3' && employee.overallRating >= 2.5 && employee.overallRating < 3.5) ||
        (filterRating === '2' && employee.overallRating < 2.5)
      )
    )
  })

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success'
    if (rating >= 3.5) return 'primary'
    if (rating >= 2.5) return 'warning'
    return 'error'
  }

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'Excellent'
    if (rating >= 3.5) return 'Good'
    if (rating >= 2.5) return 'Average'
    return 'Poor'
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getStatistics = () => {
    const total = filteredData.length
    const excellent = filteredData.filter(e => e.overallRating >= 4.5).length
    const good = filteredData.filter(e => e.overallRating >= 3.5 && e.overallRating < 4.5).length
    const average = filteredData.filter(e => e.overallRating >= 2.5 && e.overallRating < 3.5).length
    const poor = filteredData.filter(e => e.overallRating < 2.5).length
    const avgRating = total > 0 ? (filteredData.reduce((sum, e) => sum + e.overallRating, 0) / total).toFixed(2) : 0

    return { total, excellent, good, average, poor, avgRating }
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
            Performance Management
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="inherit"
          startIcon={<Assessment />}
        >
          Generate Report
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
                  Total Reviews
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {stats.excellent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Excellent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.good}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Good
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {stats.avgRating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Distribution */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Distribution
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Excellent</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.excellent / stats.total) * 100} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                  <Typography variant="caption">{stats.excellent} employees</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Good</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.good / stats.total) * 100} 
                    color="primary"
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                  <Typography variant="caption">{stats.good} employees</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Average</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.average / stats.total) * 100} 
                    color="warning"
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                  <Typography variant="caption">{stats.average} employees</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Poor</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.poor / stats.total) * 100} 
                    color="error"
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                  <Typography variant="caption">{stats.poor} employees</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    label="Department"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Rating Range</InputLabel>
                  <Select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    label="Rating Range"
                  >
                    <MenuItem value="">All Ratings</MenuItem>
                    <MenuItem value="5">4.5 - 5.0 (Excellent)</MenuItem>
                    <MenuItem value="4">3.5 - 4.4 (Good)</MenuItem>
                    <MenuItem value="3">2.5 - 3.4 (Average)</MenuItem>
                    <MenuItem value="2">Below 2.5 (Poor)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Performance Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Reviews
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Overall Rating</TableCell>
                    <TableCell>Quality</TableCell>
                    <TableCell>Productivity</TableCell>
                    <TableCell>Teamwork</TableCell>
                    <TableCell>Review Period</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((employee) => (
                    <TableRow key={employee.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {getInitials(employee.employeeName)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {employee.employeeName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {employee.employeeId} • {employee.position}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={employee.overallRating} precision={0.1} readOnly size="small" />
                          <Chip 
                            label={`${employee.overallRating} (${getRatingText(employee.overallRating)})`}
                            color={getRatingColor(employee.overallRating)}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Rating value={employee.quality} precision={0.1} readOnly size="small" />
                      </TableCell>
                      <TableCell>
                        <Rating value={employee.productivity} precision={0.1} readOnly size="small" />
                      </TableCell>
                      <TableCell>
                        <Rating value={employee.teamwork} precision={0.1} readOnly size="small" />
                      </TableCell>
                      <TableCell>{employee.reviewPeriod}</TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleViewDetails(employee)}
                          size="small"
                        >
                          <Visibility />
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

      {/* Performance Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Performance Review Details</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Employee Name"
                    value={selectedEmployee.employeeName}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    value={selectedEmployee.employeeId}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={selectedEmployee.department}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    value={selectedEmployee.position}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Review Period"
                    value={selectedEmployee.reviewPeriod}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Reviewer"
                    value={selectedEmployee.reviewer}
                    disabled
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Performance Ratings
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Overall Rating</Typography>
                    <Rating value={selectedEmployee.overallRating} precision={0.1} readOnly />
                    <Typography variant="caption" color="text.secondary">
                      {selectedEmployee.overallRating} / 5.0
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Quality of Work</Typography>
                    <Rating value={selectedEmployee.quality} precision={0.1} readOnly />
                    <Typography variant="caption" color="text.secondary">
                      {selectedEmployee.quality} / 5.0
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Productivity</Typography>
                    <Rating value={selectedEmployee.productivity} precision={0.1} readOnly />
                    <Typography variant="caption" color="text.secondary">
                      {selectedEmployee.productivity} / 5.0
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Teamwork</Typography>
                    <Rating value={selectedEmployee.teamwork} precision={0.1} readOnly />
                    <Typography variant="caption" color="text.secondary">
                      {selectedEmployee.teamwork} / 5.0
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Strengths
              </Typography>
              <Box sx={{ mb: 3 }}>
                {selectedEmployee.strengths.map((strength, index) => (
                  <Chip key={index} label={strength} sx={{ mr: 1, mb: 1 }} color="success" />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Areas for Improvement
              </Typography>
              <Box sx={{ mb: 3 }}>
                {selectedEmployee.improvements.map((improvement, index) => (
                  <Chip key={index} label={improvement} sx={{ mr: 1, mb: 1 }} color="warning" />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Goals for Next Period
              </Typography>
              <Box>
                {selectedEmployee.goals.map((goal, index) => (
                  <Chip key={index} label={goal} sx={{ mr: 1, mb: 1 }} color="primary" />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Performance

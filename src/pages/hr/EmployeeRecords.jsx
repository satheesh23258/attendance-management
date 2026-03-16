import React, { useState, useEffect } from 'react'
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
  CircularProgress
} from '@mui/material'
import {
  ArrowBack,
  Search,
  Person,
  Email,
  Phone,
  Business,
  Visibility,
  Refresh
} from '@mui/icons-material'
import { useTheme } from '../../contexts/ThemeContext'
import { employeeAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/DashboardLayout'

const EmployeeRecords = () => {
  const { colors } = useTheme()
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await employeeAPI.getAll()
      setEmployees(response.data.data || response.data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Failed to load employee records')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee)
    setOpenDialog(true)
  }

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.employeeId && emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success'
      case 'On Leave': return 'warning'
      case 'Inactive': return 'error'
      default: return 'default'
    }
  }



  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <DashboardLayout title="Employee Management Records">
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
              Employee Management Records
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Comprehensive database of employee information
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" onClick={fetchEmployees} title="Refresh">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {employees.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {employees.filter(emp => emp.status === 'Active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {employees.filter(emp => emp.status === 'On Leave').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On Leave
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {employees.filter(emp => emp.status === 'Inactive').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inactive
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search employees by name, email, department, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Employee List
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Attendance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id || employee._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: colors.primary.main }}>
                            {getInitials(employee.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {employee.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>


                      <TableCell>{employee.attendance || '0%'}</TableCell>
                      <TableCell>
                        <Chip
                          label={employee.status || 'Active'}
                          color={getStatusColor(employee.status || 'Active')}
                          size="small"
                        />
                      </TableCell>
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
                  {filteredEmployees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No employees found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Employee Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  value={selectedEmployee.employeeId || 'N/A'}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Status"
                  value={selectedEmployee.status || 'Active'}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={selectedEmployee.name || ''}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedEmployee.email || ''}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedEmployee.phone || 'N/A'}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={selectedEmployee.department || ''}
                  disabled
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manager"
                  value={selectedEmployee.manager || 'N/A'}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Join Date"
                  value={selectedEmployee.joinDate ? new Date(selectedEmployee.joinDate).toLocaleDateString() : 'N/A'}
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
    </DashboardLayout>
  )
}

export default EmployeeRecords

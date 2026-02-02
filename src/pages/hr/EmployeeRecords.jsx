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
  TextField
} from '@mui/material'
import {
  ArrowBack,
  Search,
  Person,
  Email,
  Phone,
  Business,
  Visibility
} from '@mui/icons-material'

const EmployeeRecords = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      status: 'Active',
      joinDate: '2022-01-15',
      employeeId: 'EMP001',
      manager: 'Jane Smith',
      performance: 'Excellent',
      attendance: '95%'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '+1 (555) 234-5678',
      department: 'HR',
      position: 'HR Manager',
      status: 'Active',
      joinDate: '2021-03-20',
      employeeId: 'EMP002',
      manager: 'Mike Wilson',
      performance: 'Good',
      attendance: '98%'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Sales',
      position: 'Sales Representative',
      status: 'Active',
      joinDate: '2023-06-10',
      employeeId: 'EMP003',
      manager: 'Sarah Williams',
      performance: 'Good',
      attendance: '92%'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Marketing',
      position: 'Marketing Specialist',
      status: 'On Leave',
      joinDate: '2022-09-05',
      employeeId: 'EMP004',
      manager: 'Tom Brown',
      performance: 'Excellent',
      attendance: '94%'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)

  const handleBack = () => {
    window.history.back()
  }

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee)
    setOpenDialog(true)
  }

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success'
      case 'On Leave': return 'warning'
      case 'Inactive': return 'error'
      default: return 'default'
    }
  }

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent': return 'success'
      case 'Good': return 'primary'
      case 'Average': return 'warning'
      case 'Poor': return 'error'
      default: return 'default'
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

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
            Employee Records
          </Typography>
        </Box>
        <Typography variant="h6">
          HR Dashboard
        </Typography>
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
                  {employees.filter(emp => emp.performance === 'Excellent').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Excellent Performance
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
                    <TableCell>Position</TableCell>
                    <TableCell>Performance</TableCell>
                    <TableCell>Attendance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
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
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <Chip 
                          label={employee.performance}
                          color={getPerformanceColor(employee.performance)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{employee.attendance}</TableCell>
                      <TableCell>
                        <Chip 
                          label={employee.status}
                          color={getStatusColor(employee.status)}
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
            <Grid container spacing={2}>
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
                  label="Status"
                  value={selectedEmployee.status}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={selectedEmployee.name}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedEmployee.email}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedEmployee.phone}
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
                  label="Manager"
                  value={selectedEmployee.manager}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Join Date"
                  value={selectedEmployee.joinDate}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Performance"
                  value={selectedEmployee.performance}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Attendance Rate"
                  value={selectedEmployee.attendance}
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

export default EmployeeRecords

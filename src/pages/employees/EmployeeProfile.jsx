import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  ArrowBack,
  Email,
  Phone,
  Business,
  Badge,
  AccessTime,
  Assignment,
  LocationOn,
  Edit,
  Person
} from '@mui/icons-material'
import { mockUsers, mockAttendance, mockServices } from '../../services/mockData'

const EmployeeProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [serviceHistory, setServiceHistory] = useState([])

  useEffect(() => {
    const employeeData = mockUsers.find(emp => emp.id === parseInt(id))
    if (employeeData) {
      setEmployee(employeeData)
      
      // Get attendance history for this employee
      const empAttendance = mockAttendance.filter(a => a.employeeId === parseInt(id))
      setAttendanceHistory(empAttendance)
      
      // Get service history for this employee
      const empServices = mockServices.filter(s => s.assignedTo === parseInt(id))
      setServiceHistory(empServices)
    }
  }, [id])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleEdit = () => {
    navigate(`/admin/employees/edit/${id}`)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#d32f2f'
      case 'hr':
        return '#ed6c02'
      case 'employee':
        return '#1976d2'
      default:
        return '#757575'
    }
  }

  const getStatusColor = (isActive) => {
    return isActive ? '#2e7d32' : '#d32f2f'
  }

  const getServiceColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ed6c02'
      case 'in_progress':
        return '#1976d2'
      case 'completed':
        return '#2e7d32'
      default:
        return '#757575'
    }
  }

  if (!employee) {
    return (
      <Box>
        <Typography variant="h6">Employee not found</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/employees')}
          sx={{ mr: 2 }}
        >
          Back to Employees
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Employee Profile
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={handleEdit}
        >
          Edit Employee
        </Button>
      </Box>

      {/* Employee Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} textAlign="center">
              <Avatar
                src={employee.avatar}
                alt={employee.name}
                sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
              >
                <Person sx={{ fontSize: 80 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {employee.name}
              </Typography>
              <Box display="flex" justifyContent="center" gap={1} mb={2}>
                <Chip
                  label={employee.role.toUpperCase()}
                  sx={{
                    backgroundColor: getRoleColor(employee.role),
                    color: 'white'
                  }}
                />
                <Chip
                  label={employee.isActive ? 'ACTIVE' : 'INACTIVE'}
                  sx={{
                    backgroundColor: getStatusColor(employee.isActive),
                    color: 'white'
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Badge color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Employee ID"
                    secondary={employee.employeeId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={employee.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={employee.phone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Department"
                    secondary={employee.department}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Join Date"
                    secondary={new Date(employee.joinDate).toLocaleDateString()}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Attendance History" icon={<AccessTime />} />
          <Tab label="Service History" icon={<Assignment />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Attendance History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Working Hours</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut || '-'}</TableCell>
                      <TableCell>{record.workingHours}h</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          size="small"
                          sx={{
                            backgroundColor: record.status === 'present' ? '#2e7d32' : '#d32f2f',
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
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Service History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service Title</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Completed Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceHistory.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={service.priority}
                          size="small"
                          sx={{
                            backgroundColor: service.priority === 'high' ? '#d32f2f' : 
                                            service.priority === 'medium' ? '#ed6c02' : '#2e7d32',
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={service.status}
                          size="small"
                          sx={{
                            backgroundColor: getServiceColor(service.status),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(service.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(service.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {service.completedAt ? 
                          new Date(service.completedAt).toLocaleDateString() : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default EmployeeProfile

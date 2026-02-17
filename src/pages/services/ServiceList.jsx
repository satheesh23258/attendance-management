import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tooltip,
  Grid
} from '@mui/material'
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Assignment,
  Person,
  Schedule,
  LocationOn,
  FilterList,
  Visibility,
  ArrowBack
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { serviceAPI, employeeAPI } from '../../services/api'
// import { mockServices, mockUsers } from '../../services/mockData' // Removed mock data

const ServiceList = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  // Store employees for name lookup
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesRes, employeesRes] = await Promise.all([
        serviceAPI.getAll(),
        employeeAPI.getAll()
      ])

      const allServices = servicesRes.data || []
      const allEmployees = employeesRes.data.data || employeesRes.data || []

      setEmployees(allEmployees)

      // Filter based on role
      let userServices = allServices
      if (user?.role === 'employee') {
        userServices = allServices.filter(s => s.assignedTo === user.id)
      }
      setServices(userServices)
      setFilteredServices(userServices)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      // toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = services

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => service.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(service => service.priority === priorityFilter)
    }

    setFilteredServices(filtered)
  }, [searchTerm, statusFilter, priorityFilter, services])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleAddService = () => {
    navigate('/admin/services/new')
  }

  const handleEditService = (service) => {
    navigate(`/admin/services/edit/${service.id}`)
  }

  const handleViewService = (service) => {
    navigate(`/services/${service.id}`)
  }

  const handleDeleteClick = (service) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteConfirm = async () => {
    try {
      await serviceAPI.delete(serviceToDelete.id)
      setServices(prev => prev.filter(s => s.id !== serviceToDelete.id))
      setDeleteDialogOpen(false)
      setServiceToDelete(null)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setServiceToDelete(null)
  }

  const handleStatusUpdate = async (service, newStatus) => {
    try {
      await serviceAPI.updateStatus(service.id, newStatus)
      setServices(prev => prev.map(s =>
        s.id === service.id ? { ...s, status: newStatus } : s
      ))
      handleMenuClose()
    } catch (error) {
      console.error('Status update failed:', error)
    }
  }

  const handleMenuClick = (event, service) => {
    setAnchorEl(event.currentTarget)
    setSelectedService(service)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedService(null)
  }

  const getStatusColor = (status) => {
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#d32f2f'
      case 'medium':
        return '#ed6c02'
      case 'low':
        return '#2e7d32'
      default:
        return '#757575'
    }
  }

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(u => u.id === employeeId || u._id === employeeId)
    return employee ? employee.name : 'Unassigned'
  }

  const getEmployeeAvatar = (employeeId) => {
    const employee = employees.find(u => u.id === employeeId || u._id === employeeId)
    return employee ? employee.avatar : ''
  }

  const isAdmin = user?.role === 'admin'
  const isHR = user?.role === 'hr'

  const themeColor = user?.role === 'employee'
    ? '#2f80ed'
    : user?.role === 'admin'
      ? '#d32f2f'
      : user?.role === 'hr'
        ? '#f2c94c'
        : '#d32f2f'

  const themeTextColor = user?.role === 'hr' ? 'black' : 'white'

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{
        backgroundColor: themeColor,
        color: themeTextColor,
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={() => navigate(`/dashboard/${user?.role || 'employee'}`)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            Service Management
          </Typography>
        </Box>
        {(isAdmin || isHR) && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Add />}
            onClick={handleAddService}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            Create Service
          </Button>
        )}
      </Box>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search services..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                select
                label="Priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {filteredServices.length}
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
                <Typography variant="h4" color="warning.main">
                  {filteredServices.filter(s => s.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
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
                  {filteredServices.filter(s => s.status === 'in_progress').length}
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
                <Typography variant="h4" color="success.main">
                  {filteredServices.filter(s => s.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Services Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {service.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.category}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {service.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={getEmployeeAvatar(service.assignedTo)}
                          sx={{ mr: 2, width: 32, height: 32 }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {getEmployeeName(service.assignedTo)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {service.createdByName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={service.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(service.priority),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={service.status.replace('_', ' ')}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(service.status),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(service.dueDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Actions">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, service)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewService(selectedService)}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {(isAdmin || isHR) && (
          <>
            <MenuItem onClick={() => handleEditService(selectedService)}>
              <Edit sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleStatusUpdate(selectedService, 'pending')}>
              <Assignment sx={{ mr: 1 }} />
              Mark as Pending
            </MenuItem>
            <MenuItem onClick={() => handleStatusUpdate(selectedService, 'in_progress')}>
              <Schedule sx={{ mr: 1 }} />
              Mark as In Progress
            </MenuItem>
            <MenuItem onClick={() => handleStatusUpdate(selectedService, 'completed')}>
              <Assignment sx={{ mr: 1 }} />
              Mark as Completed
            </MenuItem>
            <MenuItem onClick={() => handleDeleteClick(selectedService)} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{serviceToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ServiceList

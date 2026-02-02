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
  Visibility
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { mockServices, mockUsers } from '../../services/mockData'

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

  useEffect(() => {
    // Filter services based on user role
    let userServices = mockServices
    if (user?.role === 'employee') {
      userServices = mockServices.filter(s => s.assignedTo === user.id)
    }
    setServices(userServices)
    setFilteredServices(userServices)
  }, [user])

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

  const handleDeleteConfirm = () => {
    setServices(prev => prev.filter(s => s.id !== serviceToDelete.id))
    setDeleteDialogOpen(false)
    setServiceToDelete(null)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setServiceToDelete(null)
  }

  const handleStatusUpdate = (service, newStatus) => {
    setServices(prev => prev.map(s =>
      s.id === service.id ? { ...s, status: newStatus } : s
    ))
    handleMenuClose()
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
    const employee = mockUsers.find(u => u.id === employeeId)
    return employee ? employee.name : 'Unassigned'
  }

  const getEmployeeAvatar = (employeeId) => {
    const employee = mockUsers.find(u => u.id === employeeId)
    return employee ? employee.avatar : ''
  }

  const isAdmin = user?.role === 'admin'
  const isHR = user?.role === 'hr'

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Service Management
        </Typography>
        {(isAdmin || isHR) && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddService}
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

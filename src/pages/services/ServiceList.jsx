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
  Person,
  Schedule,
  LocationOn,
  FilterList,
  Visibility,
  ArrowBack
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { serviceAPI, employeeAPI } from '../../services/api'
import { TrendingUp } from '@mui/icons-material'
import DashboardLayout from '../../components/DashboardLayout'

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
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')

  const currentPath = window.location.pathname
  const isAdmin = !!(user?.role === 'admin' || currentPath.includes('/admin/'))
  const isHR = !!(user?.role === 'hr' || currentPath.includes('/hr/'))
  const isEmployee = !!(user?.role === 'employee' || currentPath.includes('/employee/'))

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/services')
      return
    }
    fetchData()
  }, [user, isAdmin])

  const fetchData = async () => {
    try {
      setLoading(true)
      const serviceCall = (user?.role === 'employee') ? serviceAPI.getMyServices() : serviceAPI.getAll()
      
      const [servicesRes, employeesRes] = await Promise.all([
        serviceCall,
        employeeAPI.getAll()
      ])

      const allServices = servicesRes.data || []
      const allEmployees = employeesRes.data.data || employeesRes.data || []

      setEmployees(allEmployees)

      // Filter based on role as a fallback/safety
      let userServices = allServices
      if (user?.role === 'employee') {
        const employeeId = user.employeeId || user.id || user._id;
        userServices = allServices.filter(s => {
           const assignedId = (s.assignedTo && typeof s.assignedTo === 'object') 
             ? (s.assignedTo.id || s.assignedTo._id || s.assignedTo.toString()) 
             : s.assignedTo;
           return assignedId === employeeId;
        })
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
      filtered = filtered.filter(service => {
        const employeeName = getEmployeeName(service.assignedTo).toLowerCase()
        const search = searchTerm.toLowerCase()
        return (
          service.title.toLowerCase().includes(search) ||
          service.description.toLowerCase().includes(search) ||
          service.category.toLowerCase().includes(search) ||
          employeeName.includes(search) ||
          (service.assignedToName && service.assignedToName.toLowerCase().includes(search))
        )
      })
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
    const path = isAdmin ? `/admin/services/${service.id}` : `/services/${service.id}`
    navigate(path)
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
    // Don't clear selectedService here as it may be needed by dialogs
  }

  const handleAssignClick = (service) => {
    setSelectedService(service)
    setSelectedEmployeeId(service.assignedTo || '')
    setAssignDialogOpen(true)
    handleMenuClose()
  }

  const handleAssignConfirm = async () => {
    try {
      const response = await serviceAPI.assignService(selectedService.id, { employeeId: selectedEmployeeId })
      const updatedService = response.data
      // Update local state with the fully populated object from backend
      setServices(prev => prev.map(s =>
        s.id === selectedService.id ? updatedService : s
      ))
      setAssignDialogOpen(false)
      setSelectedService(null)
      setSelectedEmployeeId('')
    } catch (error) {
      console.error('Assignment failed:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#00c853'
      case 'in_progress':
        return '#00c853'
      case 'completed':
        return '#00c853'
      default:
        return '#000000'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#000000'
      case 'medium':
        return '#00c853'
      case 'low':
        return '#00c853'
      default:
        return '#000000'
    }
  }

  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'Unassigned'
    if (typeof employeeId === 'object') {
      if (employeeId.name) return employeeId.name;
      // If it's just a mongo object with an id, attempt lookup
      const id = employeeId.id || employeeId._id;
      const employee = employees.find(u => u.id === id || u._id === id);
      return employee ? employee.name : 'Unknown';
    }
    const employee = employees.find(u => u.id === employeeId || u._id === employeeId)
    return employee ? employee.name : 'Unknown'
  }

  const getEmployeeAvatar = (employeeId) => {
    if (!employeeId) return ''
    if (typeof employeeId === 'object') {
       if (employeeId.avatar) return employeeId.avatar;
       // If it's just a mongo object with an id, attempt lookup
       const id = employeeId.id || employeeId._id;
       const employee = employees.find(u => u.id === id || u._id === id);
       return employee ? employee.avatar : '';
    }
    const employee = employees.find(u => u.id === employeeId || u._id === employeeId)
    return employee ? employee.avatar : ''
  }

  const themeColor = isEmployee
    ? '#2f80ed'
    : isAdmin
      ? '#000000'
      : isHR
        ? '#000000'
        : '#000000'

  const themeTextColor = isHR ? 'black' : 'white'

  return (
    <DashboardLayout title="">
      <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        {/* Header */}
      <Box sx={{
        background: isEmployee
          ? '#00c853'
          : isAdmin
            ? '#00c853'
            : '#00c853',
        color: isHR ? 'black' : 'white',
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
            onClick={() => {
              const role = isAdmin ? 'admin' : (isHR ? 'hr' : (user?.role || 'employee'))
              navigate(`/dashboard/${role}`)
            }}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Service Management
              </Typography>
              <Chip
                label="Employee Portal"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {isEmployee ? 'View and track your assigned services' : 'Manage organizational service requests'}
            </Typography>
          </Box>
        </Box>
        {(isAdmin || isHR) && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Add />}
            onClick={handleAddService}
            sx={{
              backgroundColor: 'white',
              color: user?.role === 'hr' ? '#000000' : '#000000',
              '&:hover': { backgroundColor: '#f5f5f5' },
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Create Service
          </Button>
        )}
      </Box>

      {/* Main Content with Sidebars */}
      <Box px={3}>
        <Grid container spacing={3}>
          {/* Main Content Column */}
          <Grid item xs={12} md={9}>
            {/* Filters and Search */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
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
                  <Grid item xs={12} sm={6} md={3}>
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
                  <Grid item xs={12} sm={6} md={3}>
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

            {/* Services Table */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Assigned</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Status</TableCell>
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
                              <Typography variant="caption" color="text.secondary">
                                {service.category}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Avatar
                              src={getEmployeeAvatar(service.assignedTo)}
                              sx={{ width: 32, height: 32 }}
                            >
                              <Person sx={{ fontSize: 18 }} />
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={service.priority}
                              size="small"
                              sx={{
                                backgroundColor: getPriorityColor(service.priority),
                                color: 'white',
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={service.status.replace('_', ' ')}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(service.status),
                                color: 'white',
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, service)}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar Area */}
          <Grid item xs={12} md={3}>
            {/* Statistics Panel */}
            <Typography variant="h6" sx={{ mb: 2, mt: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp fontSize="small" /> Service Stats
            </Typography>

            <Card sx={{ mb: 2, borderLeft: '4px solid #00c853' }}>
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Total Services</Typography>
                  <Typography variant="h6" fontWeight="bold">{filteredServices.length}</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2, borderLeft: '4px solid #ffa000' }}>
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {filteredServices.filter(s => s.status === 'pending').length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2, borderLeft: '4px solid #2f80ed' }}>
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">In Progress</Typography>
                  <Typography variant="h6" fontWeight="bold" color="info.main">
                    {filteredServices.filter(s => s.status === 'in_progress').length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2, borderLeft: '4px solid #00c853' }}>
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Completed</Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {filteredServices.filter(s => s.status === 'completed').length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

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
            <MenuItem onClick={() => handleAssignClick(selectedService)}>
              <Person sx={{ mr: 1 }} />
              Assign Work
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

      {/* Assign Work Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Assign Service</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Select Employee"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp.id || emp._id} value={emp.id || emp._id}>
                  {emp.name} ({emp.department || 'N/A'})
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAssignDialogOpen(false); setSelectedService(null); }}>Cancel</Button>
          <Button onClick={handleAssignConfirm} color="primary" variant="contained">
            Confirm Assignment
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </DashboardLayout>
  )
}

export default ServiceList

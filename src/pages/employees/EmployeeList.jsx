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
  Tooltip
} from '@mui/material'
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Person,
  Email,
  Phone,
  Business,
  Visibility
} from '@mui/icons-material'
import { mockUsers } from '../../services/mockData'

const EmployeeList = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
    setEmployees(mockUsers)
    setFilteredEmployees(mockUsers)
  }, [])

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEmployees(filtered)
  }, [searchTerm, employees])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleAddEmployee = () => {
    navigate('/admin/employees/new')
  }

  const handleEditEmployee = (employee) => {
    navigate(`/admin/employees/edit/${employee.id}`)
  }

  const handleViewEmployee = (employee) => {
    navigate(`/employees/${employee.id}`)
  }

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee)
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteConfirm = () => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeToDelete.id))
    setDeleteDialogOpen(false)
    setEmployeeToDelete(null)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setEmployeeToDelete(null)
  }

  const handleToggleStatus = (employee) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === employee.id ? { ...emp, isActive: !emp.isActive } : emp
    ))
    handleMenuClose()
  }

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget)
    setSelectedEmployee(employee)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedEmployee(null)
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Employee Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddEmployee}
        >
          Add Employee
        </Button>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search employees by name, email, ID, or department..."
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
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={employee.avatar}
                          alt={employee.name}
                          sx={{ mr: 2 }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {employee.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.role.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getRoleColor(employee.role),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(employee.isActive),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Actions">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, employee)}
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
        <MenuItem onClick={() => handleViewEmployee(selectedEmployee)}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleEditEmployee(selectedEmployee)}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleToggleStatus(selectedEmployee)}>
          {selectedEmployee?.isActive ? (
            <>
              <Person sx={{ mr: 1 }} />
              Deactivate
            </>
          ) : (
            <>
              <Person sx={{ mr: 1 }} />
              Activate
            </>
          )}
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedEmployee)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
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
            Are you sure you want to delete {employeeToDelete?.name}? This action cannot be undone.
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

export default EmployeeList

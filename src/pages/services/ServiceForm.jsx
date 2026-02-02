import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material'
import {
  Save,
  Cancel,
  Assignment,
  Person,
  Schedule,
  LocationOn,
  Description
} from '@mui/icons-material'
import { mockServices, mockUsers } from '../../services/mockData'

const ServiceForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    assignedTo: '',
    dueDate: '',
    location: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    'IT Support',
    'Facilities',
    'Maintenance',
    'Security',
    'Transportation',
    'Cleaning',
    'Other'
  ]

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  useEffect(() => {
    if (isEdit) {
      const service = mockServices.find(s => s.id === parseInt(id))
      if (service) {
        setFormData({
          title: service.title,
          description: service.description,
          priority: service.priority,
          category: service.category,
          assignedTo: service.assignedTo.toString(),
          dueDate: service.dueDate.split('T')[0],
          location: service.location?.address || ''
        })
      }
    }
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Service title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign this service to someone'
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    } else {
      const dueDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, this would make an API call
      if (isEdit) {
        console.log('Updating service:', formData)
      } else {
        console.log('Creating service:', formData)
      }
      
      navigate('/admin/services')
    } catch (error) {
      setErrors({
        general: 'Failed to save service. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/services')
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit Service' : 'Create New Service'}
      </Typography>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Service Details */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Service Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  InputProps={{
                    startAdornment: (
                      <Assignment sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                    disabled={isLoading}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <Typography variant="caption" color="error">
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: (
                      <Description sx={{ mr: 1, mt: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                    disabled={isLoading}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.assignedTo}>
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    label="Assign To"
                    disabled={isLoading}
                  >
                    {mockUsers.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.assignedTo && (
                    <Typography variant="caption" color="error">
                      {errors.assignedTo}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location (Optional)"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (isEdit ? 'Update Service' : 'Create Service')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ServiceForm

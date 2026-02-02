import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  TextField,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Tab,
  Tabs
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  Business,
  Edit,
  PhotoCamera,
  Save,
  Cancel,
  Badge,
  AccessTime,
  Assignment,
  LocationOn
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { mockUsers, mockAttendance, mockServices } from '../../services/mockData'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    avatar: ''
  })
  const [avatarPreview, setAvatarPreview] = useState('')
  const [stats, setStats] = useState({
    totalAttendance: 0,
    presentDays: 0,
    totalServices: 0,
    completedServices: 0
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        avatar: user.avatar || ''
      })
      setAvatarPreview(user.avatar || '')
      
      // Calculate user statistics
      const userAttendance = mockAttendance.filter(a => a.employeeId === user.id)
      const userServices = mockServices.filter(s => s.assignedTo === user.id)
      
      setStats({
        totalAttendance: userAttendance.length,
        presentDays: userAttendance.filter(a => a.status === 'present').length,
        totalServices: userServices.length,
        completedServices: userServices.filter(s => s.status === 'completed').length
      })
    }
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        avatar: user.avatar || ''
      })
      setAvatarPreview(user.avatar || '')
    }
  }

  const handleSave = () => {
    // Update user context
    updateUser(formData)
    setIsEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
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

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Box position="relative" display="inline-block">
                  <Avatar
                    src={avatarPreview}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  >
                    <Person sx={{ fontSize: 60 }} />
                  </Avatar>
                  {isEditing && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark'
                        }
                      }}
                      component="label"
                    >
                      <PhotoCamera />
                      <input
                        accept="image/*"
                        type="file"
                        hidden
                        onChange={handleAvatarChange}
                      />
                    </IconButton>
                  )}
                </Box>
                
                <Typography variant="h5" gutterBottom>
                  {isEditing ? (
                    <TextField
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  ) : (
                    user?.name
                  )}
                </Typography>
                
                <Chip
                  label={user?.role?.toUpperCase()}
                  sx={{
                    backgroundColor: getRoleColor(user?.role),
                    color: 'white',
                    mb: 2
                  }}
                />
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Employee ID: {user?.employeeId || 'EMP001'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Department: {isEditing ? (
                    <TextField
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 1 }}
                    />
                  ) : (
                    user?.department
                  )}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={isEditing ? (
                      <TextField
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      user?.email
                    )}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={isEditing ? (
                      <TextField
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      user?.phone
                    )}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Role"
                    secondary={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  />
                </ListItem>
              </List>
              
              <Box mt={2}>
                {isEditing ? (
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      fullWidth
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    fullWidth
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics and Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Statistics" icon={<Badge />} />
              <Tab label="Recent Activity" icon={<AccessTime />} />
            </Tabs>
          </Paper>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography color="textSecondary" gutterBottom variant="overline">
                          Attendance Rate
                        </Typography>
                        <Typography variant="h4">
                          {stats.totalAttendance > 0 
                            ? Math.round((stats.presentDays / stats.totalAttendance) * 100)
                            : 0}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stats.presentDays} of {stats.totalAttendance} days
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}>
                        <AccessTime />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography color="textSecondary" gutterBottom variant="overline">
                          Service Completion
                        </Typography>
                        <Typography variant="h4">
                          {stats.totalServices > 0 
                            ? Math.round((stats.completedServices / stats.totalServices) * 100)
                            : 0}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stats.completedServices} of {stats.totalServices} services
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                        <Assignment />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography color="textSecondary" gutterBottom variant="overline">
                          Total Services
                        </Typography>
                        <Typography variant="h4">
                          {stats.totalServices}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Assigned to you
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#ed6c02', width: 56, height: 56 }}>
                        <Assignment />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography color="textSecondary" gutterBottom variant="overline">
                          Present Days
                        </Typography>
                        <Typography variant="h4">
                          {stats.presentDays}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This month
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#9c27b0', width: 56, height: 56 }}>
                        <Badge />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Checked in today"
                      secondary="09:00 AM - Office Main Building"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Assignment color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Completed service: Install New Software"
                      secondary="2 days ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location updated"
                      secondary="3 days ago - Client Site"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Person color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Profile updated"
                      secondary="1 week ago"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </TabPanel>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile

import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  IconButton,
  Badge,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material'
import {
  Notifications,
  MarkEmailRead,
  Delete,
  Search,
  FilterList,
  Assignment,
  AccessTime,
  Person,
  Warning,
  CheckCircle,
  Info
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { mockNotifications, mockUsers } from '../../services/mockData'

const NotificationsPage = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Load notifications from API for the logged-in user's employee record
    const load = async () => {
      if (!user) return
      try {
        // Find corresponding employee record so we can query by employee id
        const resEmp = await (await import('../../services/api')).employeeAPI.getAll()
        const employees = resEmp.data || []
        const emp = employees.find(e => e.email === user.email)
        const userId = emp ? (emp.id || emp._id) : null

        const params = userId ? { userId } : {}
        const res = await (await import('../../services/api')).notificationAPI.getAll(params)
        setNotifications(res.data)
        setFilteredNotifications(res.data)
      } catch (err) {
        console.error('Failed to load notifications:', err)
      }
    }

    load()
  }, [user])

  useEffect(() => {
    let filtered = notifications

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(notification => 
        statusFilter === 'read' ? notification.isRead : !notification.isRead
      )
    }

    setFilteredNotifications(filtered)
  }, [searchTerm, typeFilter, statusFilter, notifications])

  const handleMarkAsRead = async (notificationId) => {
    try {
      await (await import('../../services/api')).notificationAPI.markAsRead(notificationId)
      setNotifications(prev => prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ))
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await (await import('../../services/api')).notificationAPI.markAllAsRead()
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        isRead: true
      })))
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const handleDelete = (notificationId) => {
    // No server delete endpoint currently - keep local for now
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'service':
        return <Assignment color="primary" />
      case 'attendance':
        return <AccessTime color="warning" />
      case 'profile':
        return <Person color="info" />
      case 'system':
        return <Info color="secondary" />
      case 'warning':
        return <Warning color="error" />
      case 'success':
        return <CheckCircle color="success" />
      default:
        return <Notifications />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'service':
        return '#1976d2'
      case 'attendance':
        return '#ed6c02'
      case 'profile':
        return '#2e7d32'
      case 'system':
        return '#9c27b0'
      case 'warning':
        return '#d32f2f'
      case 'success':
        return '#2e7d32'
      default:
        return '#757575'
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Notifications
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
          <Button
            variant="outlined"
            startIcon={<MarkEmailRead />}
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </Button>
        </Box>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>
          
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="service">Service</MenuItem>
                <MenuItem value="attendance">Attendance</MenuItem>
                <MenuItem value="profile">Profile</MenuItem>
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="success">Success</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="read">Read</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {notifications.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Notifications
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
                  {unreadCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unread
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
                  {notifications.filter(n => n.isRead).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Read
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
                  {notifications.filter(n => n.type === 'service').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Service Related
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notifications List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Notifications ({filteredNotifications.length})
          </Typography>
          
          {filteredNotifications.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No notifications found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search terms
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: getNotificationColor(notification.type),
                          width: 48,
                          height: 48
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: notification.isRead ? 'normal' : 'bold'
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={notification.type}
                              size="small"
                              sx={{
                                backgroundColor: getNotificationColor(notification.type),
                                color: 'white'
                              }}
                            />
                            {!notification.isRead && (
                              <Chip
                                label="New"
                                size="small"
                                color="error"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: 'block' }}
                          >
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <Box display="flex" flexDirection="column" gap={1}>
                      {!notification.isRead && (
                        <IconButton
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                          size="small"
                        >
                          <MarkEmailRead />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => handleDelete(notification.id)}
                        title="Delete notification"
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItem>
                  
                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure how you receive notifications and what types of alerts you want to see.
          </Typography>
          <Button variant="outlined" href="/settings">
            Configure Settings
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default NotificationsPage

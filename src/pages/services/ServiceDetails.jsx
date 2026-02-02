import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material'
import {
  ArrowBack,
  Edit,
  Assignment,
  Person,
  Schedule,
  LocationOn,
  Description,
  CheckCircle,
  AccessTime,
  Comment,
  Send
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { mockServices, mockUsers } from '../../services/mockData'

const ServiceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [service, setService] = useState(null)
  const [assignedUser, setAssignedUser] = useState(null)
  const [createdByUser, setCreatedByUser] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)

  useEffect(() => {
    const serviceData = mockServices.find(s => s.id === parseInt(id))
    if (serviceData) {
      setService(serviceData)
      
      // Get user details
      const assigned = mockUsers.find(u => u.id === serviceData.assignedTo)
      setAssignedUser(assigned)
      
      const createdBy = mockUsers.find(u => u.id === serviceData.createdBy)
      setCreatedByUser(createdBy)
      
      // Mock comments
      setComments([
        {
          id: 1,
          userId: serviceData.createdBy,
          userName: serviceData.createdByName,
          userAvatar: createdBy?.avatar,
          comment: 'Please handle this service request as soon as possible.',
          timestamp: serviceData.createdAt,
          isCreator: true
        },
        {
          id: 2,
          userId: serviceData.assignedTo,
          userName: serviceData.assignedToName,
          userAvatar: assigned?.avatar,
          comment: 'I will start working on this immediately.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isCreator: false
        }
      ])
    }
  }, [id])

  const handleEdit = () => {
    navigate(`/admin/services/edit/${id}`)
  }

  const handleStatusUpdate = (newStatus) => {
    setService(prev => ({ ...prev, status: newStatus }))
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        comment: newComment,
        timestamp: new Date().toISOString(),
        isCreator: false
      }
      setComments(prev => [...prev, comment])
      setNewComment('')
      setCommentDialogOpen(false)
    }
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

  const isAdmin = user?.role === 'admin'
  const isHR = user?.role === 'hr'
  const isAssigned = service?.assignedTo === user?.id

  if (!service) {
    return (
      <Box>
        <Typography variant="h6">Service not found</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/services')}
          sx={{ mr: 2 }}
        >
          Back to Services
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Service Details
        </Typography>
        {(isAdmin || isHR) && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Edit Service
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Service Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {service.title}
              </Typography>
              
              <Box display="flex" gap={1} mb={2}>
                <Chip
                  label={service.priority}
                  sx={{
                    backgroundColor: getPriorityColor(service.priority),
                    color: 'white'
                  }}
                />
                <Chip
                  label={service.status.replace('_', ' ')}
                  sx={{
                    backgroundColor: getStatusColor(service.status),
                    color: 'white'
                  }}
                />
                <Chip
                  label={service.category}
                  variant="outlined"
                />
              </Box>

              <Typography variant="body1" paragraph>
                {service.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Assigned To
                      </Typography>
                      <Typography variant="body1">
                        {assignedUser?.name || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {assignedUser?.department}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Created By
                      </Typography>
                      <Typography variant="body1">
                        {createdByUser?.name || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {createdByUser?.department}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Schedule color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Due Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(service.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccessTime color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body1">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {service.location?.address && (
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1">
                          {service.location.address}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Status Update Actions */}
              {(isAdmin || isHR || isAssigned) && service.status !== 'completed' && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Update Status
                  </Typography>
                  <Box display="flex" gap={1}>
                    {service.status !== 'pending' && (
                      <Button
                        variant="outlined"
                        onClick={() => handleStatusUpdate('pending')}
                      >
                        Mark as Pending
                      </Button>
                    )}
                    {service.status !== 'in_progress' && (
                      <Button
                        variant="contained"
                        onClick={() => handleStatusUpdate('in_progress')}
                      >
                        Start Working
                      </Button>
                    )}
                    {service.status !== 'completed' && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate('completed')}
                        startIcon={<CheckCircle />}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Comments ({comments.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Comment />}
                  onClick={() => setCommentDialogOpen(true)}
                >
                  Add Comment
                </Button>
              </Box>
              
              <List>
                {comments.map((comment) => (
                  <ListItem key={comment.id} alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar
                        src={comment.userAvatar}
                        sx={{ width: 40, height: 40 }}
                      >
                        <Person />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">
                            {comment.userName}
                            {comment.isCreator && (
                              <Chip
                                label="Creator"
                                size="small"
                                sx={{ ml: 1 }}
                                variant="outlined"
                              />
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {comment.comment}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<Comment />}
                  onClick={() => setCommentDialogOpen(true)}
                  fullWidth
                >
                  Add Comment
                </Button>
                {(isAdmin || isHR) && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    fullWidth
                  >
                    Edit Service
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Service Timeline */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timeline
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Assignment color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Service Created"
                    secondary={new Date(service.createdAt).toLocaleString()}
                  />
                </ListItem>
                {service.status !== 'pending' && (
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Work Started"
                      secondary="2 hours ago"
                    />
                  </ListItem>
                )}
                {service.status === 'completed' && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Completed"
                      secondary={new Date(service.completedAt).toLocaleString()}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Comment Dialog */}
      <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddComment} variant="contained" startIcon={<Send />}>
            Post Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ServiceDetails

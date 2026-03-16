import React, { useState, useEffect } from 'react';
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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  Notifications,
  Send,
  Delete,
  Info,
  Warning,
  CheckCircle,
  AccessTime,
  Person,
  Schedule,
  FilterList,
  Refresh,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const ManageNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    targetRole: 'all',
    importance: 'normal',
    actionUrl: ''
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationAPI.getAll();
      setNotifications(res.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.message) {
      toast.error('Please fill in title and message');
      return;
    }

    try {
      await notificationAPI.create(formData);
      toast.success('Notification sent successfully!');
      setOpenDialog(false);
      setFormData({
        title: '',
        message: '',
        type: 'general',
        targetRole: 'all',
        importance: 'normal',
        actionUrl: ''
      });
      fetchNotifications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification for everyone?')) return;
    
    try {
      await notificationAPI.delete(id);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'attendance': return <AccessTime color="primary" />;
      case 'service': return <Info color="secondary" />;
      case 'system': return <Warning color="error" />;
      case 'leave': return <Schedule color="warning" />;
      case 'user': return <Person color="info" />;
      default: return <Notifications color="action" />;
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout title="Manage Notifications">
      {/* Header Banner */}
      <Box sx={{
        background: '#00c853',
        color: 'white',
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
            onClick={() => navigate(-1)}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Broadcasting Center
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Send alerts and updates to your team globally
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => setOpenDialog(true)}
          sx={{ 
            bgcolor: '#ffffff', 
            color: '#00c853', 
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#f5f5f5' },
            borderRadius: 2,
            px: 3
          }}
        >
          Create New
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, borderLeft: '6px solid #696cff' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Total Sent</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{notifications.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, borderLeft: '6px solid #ff3e1d' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Urgent Alerts</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {notifications.filter(n => n.importance === 'urgent').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, borderLeft: '6px solid #00c853' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Target Reach</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{notifications.filter(n => n.targetRole === 'all').length} / {notifications.length} Universal</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notifications List */}
      <Card sx={{ borderRadius: 3, minHeight: 400 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <Typography variant="h6" fontWeight="bold">Broadcast History</Typography>
          <IconButton onClick={fetchNotifications} size="small"><Refresh /></IconButton>
        </Box>
        {loading ? (
          <LinearProgress />
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 10, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 60, color: '#eee', mb: 2 }} />
            <Typography color="text.secondary">No broadcasted notifications yet.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map((notif, index) => (
              <React.Fragment key={notif.id || notif._id}>
                <ListItem 
                  sx={{ 
                    py: 2, 
                    px: 3,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' }
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: '#f0f2f5', border: '1px solid #eee' }}>
                      {getIcon(notif.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="subtitle1" fontWeight="bold">{notif.title}</Typography>
                        <Chip size="small" label={notif.targetRole.toUpperCase()} variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                        {notif.importance !== 'normal' && (
                          <Chip size="small" label={notif.importance.toUpperCase()} color={getImportanceColor(notif.importance)} sx={{ height: 20, fontSize: '0.65rem' }} />
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    }
                    secondary={notif.message}
                  />
                  <IconButton color="error" onClick={() => handleDelete(notif.id || notif._id)}>
                    <Delete />
                  </IconButton>
                </ListItem>
                {index < notifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>

      {/* Create Notification Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', pt: 3 }}>
          New Broadcast Message
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notification Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. System Maintenance"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message Content"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                placeholder="Type your message here..."
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Category"
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="attendance">Attendance</MenuItem>
                  <MenuItem value="service">Service</MenuItem>
                  <MenuItem value="leave">Leave Update</MenuItem>
                  <MenuItem value="system">System Alert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="importance"
                  value={formData.importance}
                  onChange={handleInputChange}
                  label="Priority"
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleInputChange}
                  label="Target Audience"
                >
                  <MenuItem value="all">Everyone</MenuItem>
                  <MenuItem value="employee">Employees Only</MenuItem>
                  <MenuItem value="hr">HR Department Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Action URL (Optional)"
                name="actionUrl"
                value={formData.actionUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/details"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit" fullWidth sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            sx={{ 
              borderRadius: 2, 
              bgcolor: '#00c853', 
              color: '#fff',
              '&:hover': { bgcolor: '#00a445' }
            }} 
            fullWidth
            startIcon={<Send />}
          >
            Send Broadcast
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ManageNotifications;

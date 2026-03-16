import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Divider,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material'
import {
  Download,
  Upload,
  Warning,
  CheckCircle,
  Stars,
  Receipt,
  Map,
  Work,
  AccountCircle,
  ArrowBack,
  Refresh,
  Edit,
  Badge,
  Description,
  AccountBalanceWallet,
  GpsFixed,
  Devices
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import toast from 'react-hot-toast'
import { authAPI, employeeAPI, attendanceAPI } from '../../services/api'

const MyProfileEnhanced = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tabValue, setTabValue] = useState(0)
  const [employeeData, setEmployeeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [todayAttendance, setTodayAttendance] = useState(null)

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true)
        const [meRes, attendRes] = await Promise.allSettled([
          employeeAPI.getMe(),
          attendanceAPI.getTodayAttendance()
        ])

        const meData = meRes.status === 'fulfilled' ? meRes.value.data : {}
        const todayAt = attendRes.status === 'fulfilled' ? attendRes.value.data : null
        setTodayAttendance(todayAt)

        setEmployeeData({
          ...user,
          ...meData,
          officeLocation: meData.officeLocation || { lat: 40.7128, lng: -74.006, radius: 100 }
        })
      } catch (error) {
        console.warn('Failed to fetch employee profile:', error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEmployeeData()
  }, [user])

  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    department: '',
    branchName: ''
  })

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }


  const handleEditProfile = () => {
    setEditData({
      name: employeeData?.name || '',
      phone: employeeData?.phone || '',
      department: employeeData?.department || '',
      branchName: employeeData?.branchName || ''
    })
    setOpenEditDialog(true)
  }

  const handleUpdateProfile = async () => {
    try {
      setLoading(true)
      const { data } = await authAPI.updateProfile(editData)
      
      // Merge user data and employee specific details
      const { employeeDetails, ...userData } = data
      setEmployeeData(prev => ({
        ...prev,
        ...userData,
        ...(employeeDetails || {})
      }))
      
      setOpenEditDialog(false)
      toast.success('Profile updated successfully')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LinearProgress color="primary" />

  return (
    <DashboardLayout title="My Profile">
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
            title="Go back"
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Employee Profile
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Detailed view of your employee records and performance
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" onClick={() => window.location.reload()} title="Refresh">
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            onClick={handleEditProfile}
            startIcon={<Edit />}
            sx={{ bgcolor: 'white', color: '#00c853', borderRadius: 2, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#f5f5f5' } }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <Grid container spacing={3}>
          {/* Header Card */}
          <Grid item xs={12}>
            <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 4, borderRadius: 4 }}>
              <Avatar 
                src={employeeData?.avatar} 
                sx={{ width: 120, height: 120, fontSize: '3rem', border: '4px solid #00c853' }}
              >
                {employeeData?.name ? employeeData.name[0] : 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" fontWeight="bold">{employeeData?.name}</Typography>
                <Typography variant="h6" color="text.secondary">{employeeData?.department} | {employeeData?.role}</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip icon={<Work />} label={`ID: ${employeeData?.employeeId || employeeData?.id?.slice(-6) || 'N/A'}`} size="small" />
                  <Chip icon={<Map />} label={employeeData?.isRemote ? "Remote" : "Office Based"} color="primary" variant="outlined" size="small" />
                  {todayAttendance ? (
                    <Chip 
                      label={todayAttendance.status === 'present' ? 'Present Today' : 'Late Today'} 
                      color={todayAttendance.status === 'present' ? 'success' : 'warning'}
                      size="small"
                      icon={<CheckCircle />}
                    />
                  ) : (
                    <Chip label="Not Marked Today" variant="outlined" color="error" size="small" icon={<Warning />} />
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Navigation Tabs */}
          <Grid item xs={12}>
            <Paper sx={{ borderRadius: 4 }}>
              <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ px: 2, pt: 1 }}>
                <Tab icon={<AccountCircle />} label="Overview" iconPosition="start" />
              </Tabs>
              <Divider />
              
              <Box sx={{ p: 4 }}>
                {/* Tab 0: Overview & Geo-fence */}
                {tabValue === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>Work Location (Geo-fence)</Typography>
                      <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <GpsFixed color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">Office Boundary Locking</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Your office location is set to: {employeeData?.officeLocation?.lat}, {employeeData?.officeLocation?.lng}.
                            Attendance marking is restricted within a {employeeData?.officeLocation?.radius}m radius.
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{ mt: 1, borderColor: '#00c853', color: '#000', '&:hover': { borderColor: '#00a445', bgcolor: 'rgba(0,200,83,0.04)' } }}
                            onClick={() => navigate('/employee/mylocation')}
                          >
                            View on Map
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                       <Typography variant="h6" gutterBottom>Personal Details</Typography>
                       <List size="small">
                          <ListItem><ListItemText primary="Email" secondary={employeeData?.email} /></ListItem>
                          <ListItem><ListItemText primary="Phone" secondary={employeeData?.phone} /></ListItem>
                       </List>
                    </Grid>
                  </Grid>
                )}

              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Personal Profile</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Department"
              value={editData.department}
              disabled={user.role !== 'admin'} // Only admin can change dept
              onChange={(e) => setEditData({ ...editData, department: e.target.value })}
            />
             <TextField
              fullWidth
              label="Branch Name"
              value={editData.branchName}
              onChange={(e) => setEditData({ ...editData, branchName: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProfile} disabled={loading}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}

export default MyProfileEnhanced

import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Button
} from '@mui/material'
import {
  LocationOn,
  MyLocation,
  Refresh,
  Person,
  AccessTime,
  Navigation,
  Timeline
} from '@mui/icons-material'
import { mockLocations, mockUsers } from '../../services/mockData'
import { attendanceAPI, employeeAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'

// Note: In a real application, you would need to:
// 1. Add Google Maps JavaScript API script to your index.html
// 2. Get a Google Maps API key
// 3. Install @googlemaps/react-wrapper or use the Google Maps JavaScript API directly

const LiveLocation = () => {
  const { user } = useAuth()
  const [locations, setLocations] = useState([])
  const [employeeMap, setEmployeeMap] = useState({})
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [showRoutes, setShowRoutes] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })
  const [mapZoom, setMapZoom] = useState(12)
  const mapRef = useRef(null)

  useEffect(() => {
    setLocations(mockLocations)
    // Map real employees by email so we can mark attendance in DB
    const loadEmployees = async () => {
      try {
        const res = await employeeAPI.getAll()
        const map = {}
        res.data.forEach((emp) => {
          map[emp.email] = emp
        })
        setEmployeeMap(map)
      } catch (err) {
        console.error('Failed to load employees for live location:', err)
      }
    }
    loadEmployees()
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      // In a real app, this would fetch from your API
      console.log('Updating live locations...')
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Initialize Google Map (mock implementation)
    initializeMap()
  }, [])

  const initializeMap = () => {
    // This is a mock implementation
    // In a real app, you would initialize the Google Maps JavaScript API here
    console.log('Initializing Google Maps...')
    console.log('Map center:', mapCenter)
    console.log('Map zoom:', mapZoom)
  }

  const handleRefresh = () => {
    // Simulate refreshing location data
    console.log('Refreshing location data...')
    setLocations(mockLocations)
  }

  const handleCenterOnUser = () => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setMapCenter(userLocation)
          setMapZoom(15)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
    }
  }

  const getEmployeeName = (employeeId) => {
    const employee = mockUsers.find(u => u.id === employeeId)
    return employee ? employee.name : 'Unknown'
  }

  const getEmployeeEmail = (employeeId) => {
    const employee = mockUsers.find(u => u.id === employeeId)
    return employee ? employee.email : null
  }

  const getEmployeeAvatar = (employeeId) => {
    const employee = mockUsers.find(u => u.id === employeeId)
    return employee ? employee.avatar : ''
  }

  const getStatusColor = (isActive) => {
    return isActive ? '#2e7d32' : '#d32f2f'
  }

  const filteredLocations = selectedEmployee === 'all' 
    ? locations 
    : locations.filter(loc => loc.employeeId === parseInt(selectedEmployee))

  const canMarkAttendance = user && (user.role === 'admin' || user.role === 'hr')

  const handleMarkAttendance = async (loc, status) => {
    if (!canMarkAttendance) return
    if (!status) return
    const email = getEmployeeEmail(loc.employeeId)
    const emp = email && employeeMap[email]
    if (!emp) {
      toast.error('Employee not found in system for this location')
      return
    }

    try {
      await attendanceAPI.mark({
        employeeId: emp.id,
        officeLat: 40.7128,   // example office coords (NYC)
        officeLng: -74.0060,
        radiusMeters: 500,    // 500m radius
        allowedStartTime: '09:30',
        statusOverride: status,
      })
      toast.success(`Attendance marked as ${status} for ${emp.name}`)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to mark attendance')
    }
  }

  // Mock map component (replace with actual Google Maps implementation)
  const MapComponent = () => (
    <Box
      sx={{
        height: 500,
        backgroundColor: '#f5f5f5',
        border: '2px dashed #ccc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Google Maps View
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
        This is a placeholder for the Google Maps integration.
        <br />
        In production, this would display an interactive map with live employee locations.
      </Typography>
      
      {/* Mock location markers */}
      {filteredLocations.map((location) => (
        <Box
          key={location.id}
          sx={{
            position: 'absolute',
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Avatar
            src={getEmployeeAvatar(location.employeeId)}
            sx={{
              width: 40,
              height: 40,
              border: `3px solid ${getStatusColor(location.isActive)}`,
              cursor: 'pointer'
            }}
            title={`${getEmployeeName(location.employeeId)} - ${location.address}`}
          >
            <Person />
          </Avatar>
        </Box>
      ))}
      
      <Typography variant="caption" color="text.secondary">
        Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)} | Zoom: {mapZoom}
      </Typography>
    </Box>
  )

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Live Location Tracking
        </Typography>
        <Box>
          <IconButton onClick={handleRefresh} title="Refresh">
            <Refresh />
          </IconButton>
          <IconButton onClick={handleCenterOnUser} title="Center on my location">
            <MyLocation />
          </IconButton>
        </Box>
      </Box>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Employee</InputLabel>
                <Select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  label="Filter by Employee"
                >
                  <MenuItem value="all">All Employees</MenuItem>
                  {mockUsers.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showRoutes}
                    onChange={(e) => setShowRoutes(e.target.checked)}
                  />
                }
                label="Show Routes"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                startIcon={<Timeline />}
                onClick={() => console.log('View route history')}
                fullWidth
              >
                Route History
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Map */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Live Map View
              </Typography>
              <MapComponent />
            </CardContent>
          </Card>
        </Grid>

        {/* Employee List */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Employees ({filteredLocations.filter(l => l.isActive).length})
              </Typography>
              <List>
                {filteredLocations.map((location) => (
                  <ListItem key={location.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        src={getEmployeeAvatar(location.employeeId)}
                        sx={{
                          border: `2px solid ${getStatusColor(location.isActive)}`
                        }}
                      >
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2">
                            {getEmployeeName(location.employeeId)}
                          </Typography>
                          <Chip
                            label={location.isActive ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(location.isActive),
                              color: 'white'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            <LocationOn sx={{ fontSize: 14, mr: 0.5 }} />
                            {location.address}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            <AccessTime sx={{ fontSize: 14, mr: 0.5 }} />
                            Last updated: {new Date(location.timestamp).toLocaleTimeString()}
                          </Typography>
                          {canMarkAttendance && (
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                color="success"
                                onClick={() => handleMarkAttendance(location, 'present')}
                              >
                                Mark Present
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => handleMarkAttendance(location, 'absent')}
                              >
                                Mark Absent
                              </Button>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Location Statistics */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Location Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {filteredLocations.filter(l => l.isActive).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Now
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="secondary">
                      {filteredLocations.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Tracked
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Instructions for Google Maps Setup */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Google Maps Setup Instructions
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            <ol>
              <li>Get a Google Maps JavaScript API key from the Google Cloud Console</li>
              <li>Add the Google Maps script to your index.html:</li>
              <code>
                {`<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>`}
              </code>
              <li>Install @googlemaps/react-wrapper or use the Google Maps JavaScript API directly</li>
              <li>Replace the MapComponent with actual Google Maps implementation</li>
              <li>Add markers, polylines, and other map features as needed</li>
            </ol>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LiveLocation

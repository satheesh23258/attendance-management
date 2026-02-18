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
  Timeline,
  ArrowBack
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { attendanceAPI, employeeAPI, locationAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'

// Note: In a real application, you would need to:
// 1. Add Google Maps JavaScript API script to your index.html
// 2. Get a Google Maps API key
// 3. Install @googlemaps/react-wrapper or use the Google Maps JavaScript API directly

const LiveLocation = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [employeeMap, setEmployeeMap] = useState({})
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [showRoutes, setShowRoutes] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })
  const [mapZoom, setMapZoom] = useState(12)
  const mapRef = useRef(null)

  useEffect(() => {
    fetchData()

    // Poll for updates
    const interval = setInterval(() => {
      fetchLiveLocations()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [empRes, locRes] = await Promise.all([
        employeeAPI.getAll(),
        locationAPI.getLiveLocations()
      ])

      const allEmployees = empRes.data.data || empRes.data || []
      setEmployees(allEmployees)

      const map = {}
      allEmployees.forEach((emp) => {
        map[emp.email] = emp
        map[emp.id] = emp
        map[emp._id] = emp
      })
      setEmployeeMap(map)

      if (locRes.data) {
        setLocations(locRes.data)
      }
    } catch (err) {
      console.error('Failed to load initial data:', err)
    }
  }

  const fetchLiveLocations = async () => {
    try {
      const res = await locationAPI.getLiveLocations()
      if (res.data) {
        setLocations(res.data)
      }
    } catch (error) {
      console.error('Failed to update locations:', error)
    }
  }

  useEffect(() => {
    // Initialize Google Map (real implementation below in MapComponent)
    initializeMap()
  }, [])

  const initializeMap = () => {
    // Legacy hook kept for compatibility. Actual map is initialized inside MapComponent.
    console.log('Initializing Google Maps... (deferred to MapComponent)')
  }

  const handleRefresh = () => {
    fetchLiveLocations()
    toast.success('Location data refreshed')
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
    const employee = employeeMap[employeeId] || employees.find(e => e.id === employeeId || e._id === employeeId)
    return employee ? employee.name : 'Unknown'
  }

  const getEmployeeEmail = (employeeId) => {
    const employee = employeeMap[employeeId] || employees.find(e => e.id === employeeId || e._id === employeeId)
    return employee ? employee.email : null
  }

  const getEmployeeAvatar = (employeeId) => {
    const employee = employeeMap[employeeId] || employees.find(e => e.id === employeeId || e._id === employeeId)
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

  // Google Maps implementation using the JS API (no extra package required)
  const MapComponent = () => {
    const mapElementRef = useRef(null)
    const mapRef = useRef(null)
    const markersRef = useRef([])
    const directionsServiceRef = useRef(null)
    const directionsRendererRef = useRef(null)

    // Read API key from Vite env var. Do NOT commit your .env with real keys.
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Missing Google Maps API key: set VITE_GOOGLE_MAPS_API_KEY in your .env')
    }

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve()
          return
        }
        const s = document.createElement('script')
        s.src = src
        s.async = true
        s.defer = true
        s.onload = resolve
        s.onerror = reject
        document.head.appendChild(s)
      })
    }

    // Initialize map once
    useEffect(() => {
      let mounted = true
      const src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
      loadScript(src)
        .then(() => {
          if (!mounted) return
          if (!mapRef.current && window.google && mapElementRef.current) {
            mapRef.current = new window.google.maps.Map(mapElementRef.current, {
              center: mapCenter,
              zoom: mapZoom
            })
            // Prepare directions refs
            directionsServiceRef.current = null
            directionsRendererRef.current = null

            // Create a simple search box (Places Autocomplete)
            const input = document.createElement('input')
            input.type = 'text'
            input.placeholder = 'Search places...'
            input.style.cssText = 'width:260px;padding:8px;border:1px solid #ccc;border-radius:4px;margin:8px;background:white;'
            mapElementRef.current.parentElement.appendChild(input)

            const autocomplete = new window.google.maps.places.Autocomplete(input)
            autocomplete.bindTo('bounds', mapRef.current)
            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace()
              if (!place.geometry) return
              const dest = place.geometry.location.toJSON()
              // Center map and show route
              mapRef.current.panTo(dest)
              mapRef.current.setZoom(14)
              showRouteTo(dest)
            })

            // Add a clear route button
            const btn = document.createElement('button')
            btn.textContent = 'Clear Route'
            btn.style.cssText = 'position:absolute;right:8px;top:8px;z-index:5;padding:8px;border-radius:6px;background:#fff;border:1px solid #ccc;cursor:pointer'
            mapElementRef.current.parentElement.appendChild(btn)
            btn.addEventListener('click', () => {
              if (directionsRendererRef.current) directionsRendererRef.current.setDirections({ routes: [] })
            })
          }
        })
        .catch((err) => {
          console.error('Failed to load Google Maps script:', err)
        })

      return () => { mounted = false }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update center and zoom
    useEffect(() => {
      if (mapRef.current) {
        mapRef.current.setCenter(mapCenter)
        mapRef.current.setZoom(mapZoom)
      }
    }, [mapCenter, mapZoom])

    // Update markers when locations change
    useEffect(() => {
      if (!mapRef.current || !window.google) return

      // Clear old markers
      markersRef.current.forEach((m) => m.setMap(null))
      markersRef.current = []

      filteredLocations.forEach((loc) => {
        if (!loc.lat || !loc.lng) return
        const position = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) }
        const marker = new window.google.maps.Marker({
          position,
          map: mapRef.current,
          title: `${getEmployeeName(loc.employeeId)}\n${loc.address}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: loc.isActive ? '#2e7d32' : '#d32f2f',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#ffffff'
          }
        })

        const info = new window.google.maps.InfoWindow({
          content: `<div style="min-width:160px"><strong>${getEmployeeName(loc.employeeId)}</strong><div style="font-size:12px">${loc.address}</div><div style="font-size:11px;color:#666">${new Date(loc.timestamp).toLocaleString()}</div></div>`
        })
        marker.addListener('click', () => {
          info.open({ anchor: marker, map: mapRef.current })
          // Draw directions from user's current location to this marker
          showRouteTo(position)
        })

        markersRef.current.push(marker)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredLocations])

    // Show route helper (uses directionsService/renderer)
    const showRouteTo = async (destination) => {
      if (!window.google || !mapRef.current) return

      // Get user's current location if available
      const getUserPos = () => new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          }, () => resolve(mapRef.current.getCenter().toJSON()))
        } else {
          resolve(mapRef.current.getCenter().toJSON())
        }
      })

      const origin = await getUserPos()

      if (!directionsServiceRef.current) directionsServiceRef.current = new window.google.maps.DirectionsService()
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          map: mapRef.current,
          suppressMarkers: false,
          polylineOptions: { strokeColor: '#1976d2', strokeWeight: 6 }
        })
      }

      directionsServiceRef.current.route({
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK') {
          directionsRendererRef.current.setDirections(result)
          // Fit bounds to route
          const bounds = new window.google.maps.LatLngBounds()
          const route = result.routes[0]
          route.overview_path.forEach(p => bounds.extend(p))
          mapRef.current.fitBounds(bounds)
        } else {
          console.error('Directions request failed:', status)
        }
      })
    }

    return (
      <Box sx={{ height: 500, position: 'relative' }}>
        <Box ref={mapElementRef} sx={{ height: '100%', width: '100%' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{
        background: user?.role === 'admin'
          ? 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
          : '#FFC107',
        color: user?.role === 'admin' ? 'white' : 'black',
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
              Live Location Tracking
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Monitor and track organization staff in real-time
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" onClick={handleRefresh} title="Refresh">
            <Refresh />
          </IconButton>
          <IconButton color="inherit" onClick={handleCenterOnUser} title="Center on my location">
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
                  {employees.map((employee) => (
                    <MenuItem key={employee.id || employee._id} value={employee.id || employee._id}>
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
                sx={{
                  color: user?.role === 'admin' ? '#d32f2f' : 'primary.main',
                  borderColor: user?.role === 'admin' ? '#d32f2f' : 'primary.main',
                  '&:hover': {
                    borderColor: user?.role === 'admin' ? '#b71c1c' : 'primary.dark',
                    bgcolor: user?.role === 'admin' ? 'rgba(211, 47, 47, 0.04)' : 'rgba(25, 118, 210, 0.04)'
                  }
                }}
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
                    <Typography variant="h4" sx={{ color: user?.role === 'admin' ? '#d32f2f' : 'primary.main' }}>
                      {filteredLocations.filter(l => l.isActive).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Now
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" sx={{ color: user?.role === 'admin' ? '#f44336' : 'secondary.main' }}>
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
                {`<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCy5HQVsFRhuA4-zyIeHFbhxUVJ_nYAnfY&libraries=places"></script>`}
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

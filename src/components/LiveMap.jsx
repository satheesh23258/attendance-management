import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, Typography, CircularProgress, IconButton } from '@mui/material';
import { Refresh, MyLocation } from '@mui/icons-material';
import { loadGoogleMaps } from '../utils/googleMapsLoader';
import { mapAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function LiveMap({ height = 400 }) {
  const { user } = useAuth();
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);

  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    let intervalId;
    const initMap = async () => {
      try {
        if (!mapRef.current) return;
        const google = await loadGoogleMaps();
        
        if (!googleMapRef.current) {
          googleMapRef.current = new google.maps.Map(mapRef.current, {
            zoom: 12,
            center: { lat: 40.7128, lng: -74.0060 }, // Default center
            mapTypeId: 'roadmap',
            gestureHandling: 'greedy',
          });
        }
        
        await fetchLocations();
        
        // Auto refresh every 5 seconds
        intervalId = setInterval(fetchLocations, 5000);
      } catch (err) {
        console.error('Map init error:', err);
        setMapError(err.message);
      }
    };

    initMap();
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (googleMapRef.current && locations.length > 0) {
      updateMapMarkers(locations);
    }
  }, [locations]);

  const fetchLocations = async () => {
    try {
      const { data } = await mapAPI.getMapLocations();
      setLocations(data || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch map locations', err);
      // Keep silent on interval to avoid spamming toasts
      if (isLoading) {
        setIsLoading(false);
        toast.error('Could not load live locations');
      }
    }
  };

  const getMarkerColorUrl = (role) => {
    switch (role) {
      case 'admin': return 'http://maps.google.com/mapfiles/ms/micons/red-dot.png';
      case 'hr': return 'http://maps.google.com/mapfiles/ms/micons/green-dot.png';
      case 'employee': return 'http://maps.google.com/mapfiles/ms/micons/blue-dot.png';
      default: return 'http://maps.google.com/mapfiles/ms/micons/blue-dot.png';
    }
  };

  const updateMapMarkers = (locs) => {
    if (!googleMapRef.current) return;

    // Clear existing markers logically to avoid memory leaks, but keeping them map-bound if updating
    const newKeys = new Set(locs.map(l => l.userId));
    Object.keys(markersRef.current).forEach(key => {
      if (!newKeys.has(key)) {
        markersRef.current[key].setMap(null);
        delete markersRef.current[key];
      }
    });

    const bounds = new window.google.maps.LatLngBounds();
    let boundsExtended = false;

    locs.forEach(loc => {
      const position = { lat: loc.lat, lng: loc.lng };
      bounds.extend(position);
      boundsExtended = true;

      if (markersRef.current[loc.userId]) {
        // Update existing marker
        markersRef.current[loc.userId].setPosition(position);
      } else {
        // Create new marker
        const marker = new window.google.maps.Marker({
          position,
          map: googleMapRef.current,
          title: loc.name,
          icon: getMarkerColorUrl(loc.role)
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding:4px;"><b>${loc.name}</b> (${loc.role})<br/>Click to view movement path</div>`
        });

        marker.addListener('mouseover', () => infoWindow.open(googleMapRef.current, marker));
        marker.addListener('mouseout', () => infoWindow.close());
        marker.addListener('click', () => handleShowPath(loc.userId));

        markersRef.current[loc.userId] = marker;
      }
    });

    // Only fit bounds on initial load if we don't have user interaction zooming
    // For simplicity, let's not auto-re-center every 5 seconds if they are dragging.
    // Instead we'll center on first load:
    if (boundsExtended && isLoading) {
      googleMapRef.current.fitBounds(bounds);
    }
  };

  const handleShowPath = async (targetUserId) => {
    try {
      const { data } = await mapAPI.getLocationHistory(targetUserId);
      
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      if (data && data.length > 1) {
        const path = data.map(pt => ({ lat: pt.lat, lng: pt.lng }));
        polylineRef.current = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map: googleMapRef.current
        });
        toast.success('Drawing movement path');
      } else {
        toast('Not enough movement data for this user', { icon: 'ℹ️' });
      }
    } catch (err) {
      toast.error('Could not fetch path history');
    }
  };

  const centerOnMe = () => {
    if (navigator.geolocation && googleMapRef.current) {
      navigator.geolocation.getCurrentPosition(position => {
        const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
        googleMapRef.current.setCenter(pos);
        googleMapRef.current.setZoom(15);
      });
    }
  };

  return (
    <Card sx={{ position: 'relative', overflow: 'hidden', height, width: '100%', borderRadius: 2 }}>
      {isLoading && !mapError && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
          <CircularProgress color="success" />
        </Box>
      )}
      {mapError && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#ffebee', zIndex: 10, p: 3 }}>
          <Typography color="error">Map Error: {mapError}</Typography>
        </Box>
      )}
      
      {/* Utility Overlays */}
      <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 5, display: 'flex', gap: 1 }}>
        <IconButton sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f0f0f0' }, boxShadow: 1 }} onClick={fetchLocations} title="Refresh Map">
          <Refresh color="success" />
        </IconButton>
        <IconButton sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f0f0f0' }, boxShadow: 1 }} onClick={centerOnMe} title="Center on Me">
          <MyLocation color="primary" />
        </IconButton>
      </Box>

      {/* Legend */}
      <Box sx={{ position: 'absolute', bottom: 24, left: 10, zIndex: 5, bgcolor: 'rgba(255,255,255,0.9)', p: 1, borderRadius: 1, boxShadow: 1, fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><img src="http://maps.google.com/mapfiles/ms/micons/red-dot.png" width="16" alt="admin" /> Admin</Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><img src="http://maps.google.com/mapfiles/ms/micons/green-dot.png" width="16" alt="hr" /> HR</Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><img src="http://maps.google.com/mapfiles/ms/micons/blue-dot.png" width="16" alt="employee" /> Employee</Box>
      </Box>

      <Box ref={mapRef} sx={{ height: '100%', width: '100%' }} />
    </Card>
  );
}

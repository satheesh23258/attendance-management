import React, { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import HRDashboard from '../pages/dashboard/HRDashboard'
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard'
import HybridDashboard from '../pages/dashboard/HybridDashboard'
import { RoleThemeProvider } from '../contexts/ThemeContext'
import { mapAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const WorkingDashboard = () => {
  const { role } = useParams()
  const { user } = useAuth()

  // Feature 1: Live Location Background Sync (Runs every 5 seconds)
  useEffect(() => {
    if (!user) return;
    
    const sendLocation = (position) => {
      mapAPI.updateLiveLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }).catch(err => {
        // silent fail on background sync
      });
    };

    const handleError = (error) => {
      console.warn('Geolocation Error:', error);
    };

    // Use watchPosition or setInterval. Due to browser throttling, setInterval might be better.
    // The spec asks for "send location every 5 seconds"
    let intervalId;
    if (navigator.geolocation) {
      // initial fetch
      navigator.geolocation.getCurrentPosition(sendLocation, handleError, { enableHighAccuracy: true });
      
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(sendLocation, handleError, { enableHighAccuracy: true });
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  switch ((role || '').toLowerCase()) {
    case 'admin':
      return (
        <RoleThemeProvider role="admin">
          <AdminDashboard />
        </RoleThemeProvider>
      )
    case 'hr':
      return (
        <RoleThemeProvider role="hr">
          <HRDashboard />
        </RoleThemeProvider>
      )
    case 'employee':
      return (
        <RoleThemeProvider role="employee">
          <EmployeeDashboard />
        </RoleThemeProvider>
      )
    case 'hybrid':
      return (
        <RoleThemeProvider role="hybrid">
          <HybridDashboard />
        </RoleThemeProvider>
      )
    default:
      // If role param missing or unknown, redirect to home/login
      return <Navigate to="/" replace />
  }
}

export default WorkingDashboard

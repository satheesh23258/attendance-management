import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const HRRoute = ({ children, permission }) => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const isHR = user?.role === 'hr';
  const isAdmin = user?.role === 'admin';
  
  // If no specific permission requested, default to canAccessHR for hybrid users
  const requiredPermission = permission || 'canAccessHR';
  const hasHybridPermission = user?.hybridPermissions?.hasAccess && user?.hybridPermissions?.permissions?.[requiredPermission];

  if (!isHR && !isAdmin && !hasHybridPermission) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default HRRoute

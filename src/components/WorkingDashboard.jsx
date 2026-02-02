import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import HRDashboard from '../pages/dashboard/HRDashboard'
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard'

const WorkingDashboard = () => {
  const { role } = useParams()

  switch ((role || '').toLowerCase()) {
    case 'admin':
      return <AdminDashboard />
    case 'hr':
      return <HRDashboard />
    case 'employee':
      return <EmployeeDashboard />
    default:
      // If role param missing or unknown, redirect to home/login
      return <Navigate to="/" replace />
  }
}

export default WorkingDashboard

import React from 'react'
import {
  Grid,
  Button,
  Box
} from '@mui/material'
import {
  AccessTime,
  LocationOn,
  Assignment,
  TrendingUp,
  Event,
  People,
  CheckCircle,
  Security
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

const QuickActions = ({ role }) => {
  const navigate = useNavigate()
  const { colors } = useTheme()

  const getEmployeeActions = () => [
    {
      label: 'Attendance History',
      icon: <AccessTime />,
      path: '/employee/attendance',
      color: 'primary'
    },
    {
      label: 'My Location',
      icon: <LocationOn />,
      path: '/employee/location',
      color: 'secondary'
    },
    {
      label: 'My Services',
      icon: <Assignment />,
      path: '/employee/services',
      color: 'success'
    },
    {
      label: 'My Profile',
      icon: <TrendingUp />,
      path: '/employee/profile',
      color: 'info'
    },
    {
      label: 'Leave Application',
      icon: <Event />,
      path: '/employee/leave-application',
      color: 'warning'
    }
  ]

  const getHRActions = () => [
    {
      label: 'Employee Records',
      icon: <People />,
      path: '/hr/employee-records',
      color: 'primary'
    },
    {
      label: 'Attendance Reports',
      icon: <Assignment />,
      path: '/hr/attendance-reports',
      color: 'secondary'
    },
    {
      label: 'Attendance Management',
      icon: <AccessTime />,
      path: '/hr/attendance-management',
      color: 'success'
    },
    {
      label: 'Performance Reviews',
      icon: <TrendingUp />,
      path: '/hr/performance',
      color: 'info'
    },
    {
      label: 'Live Tracking',
      icon: <LocationOn />,
      path: '/location/tracking',
      color: 'warning'
    },
    {
      label: 'Leave Application',
      icon: <Event />,
      path: '/hr/leave-application',
      color: 'info'
    }
  ]

  const getAdminActions = () => [
    {
      label: 'Manage Employees',
      icon: <People />,
      path: '/admin/manage-employees',
      color: 'error'
    },
    {
      label: 'Manage Hybrid Permissions',
      icon: <Security />,
      path: '/admin/manage-permissions',
      color: 'error'
    },
    {
      label: 'View Services',
      icon: <Assignment />,
      path: '/services',
      color: 'error'
    },
    {
      label: 'View Reports',
      icon: <TrendingUp />,
      path: '/admin/system-reports',
      color: 'error'
    },
    {
      label: 'Live Tracking',
      icon: <LocationOn />,
      path: '/location/tracking',
      color: 'error'
    }
  ]

  const getActions = () => {
    switch (role?.toLowerCase()) {
      case 'employee':
        return getEmployeeActions()
      case 'hr':
        return getHRActions()
      case 'admin':
        return getAdminActions()
      default:
        return []
    }
  }

  const actions = getActions()

  if (actions.length === 0) return null

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        backgroundColor: role === 'admin' ? '#d32f2f' : colors.background.paper, // Vibrant red background for admin
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: role === 'admin' ? '2px solid #d32f2f' : '1px solid #e2e8f0' // Thicker red border for admin
      }}
    >
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={actions.length > 4 ? 2 : 3} key={index}>
            <Button
              variant="contained"
              color={action.color}
              fullWidth
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
              }}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default QuickActions

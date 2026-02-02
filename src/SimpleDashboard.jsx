import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SimpleDashboard = () => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState('employee')

  useEffect(() => {
    const path = window.location.pathname
    const role = path.split('/')[2]
    if (role) {
      setUserRole(role)
    }
  }, [])

  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Dashboard'
      case 'hr':
        return 'HR Dashboard'
      default:
        return 'Employee Dashboard'
    }
  }

  const getRoleColor = () => {
    switch (userRole) {
      case 'admin':
        return '#d32f2f'
      case 'hr':
        return '#ed6c02'
      default:
        return '#1976d2'
    }
  }

  const getRoleFeatures = () => {
    switch (userRole) {
      case 'admin':
        return [
          { 
            icon: '👥', 
            title: 'Manage Employees', 
            desc: 'Add, edit, delete staff',
            path: '/admin/manage-employees'
          },
          { 
            icon: '📊', 
            title: 'System Reports', 
            desc: 'View all analytics',
            path: '/admin/reports'
          },
          { 
            icon: '⚙️', 
            title: 'System Settings', 
            desc: 'Configure system',
            path: '/admin/settings'
          },
          { 
            icon: '🔐', 
            title: 'User Management', 
            desc: 'Manage all users',
            path: '/admin/users'
          }
        ]
      case 'hr':
        return [
          { 
            icon: '👥', 
            title: 'Employee Records', 
            desc: 'View staff details',
            path: '/hr/employee-records'
          },
          { 
            icon: '📊', 
            title: 'Attendance Reports', 
            desc: 'Track attendance',
            path: '/hr/attendance-reports'
          },
          { 
            icon: '💼', 
            title: 'Performance', 
            desc: 'Employee performance',
            path: '/hr/performance'
          },
          { 
            icon: '📈', 
            title: 'Analytics', 
            desc: 'HR analytics',
            path: '/hr/analytics'
          }
        ]
      default:
        return [
          { 
            icon: '⏰', 
            title: 'Check In/Out', 
            desc: 'Mark attendance',
            path: '/employee/checkinout'
          },
          { 
            icon: '📋', 
            title: 'My Tasks', 
            desc: 'View assignments',
            path: '/employee/mytasks'
          },
          { 
            icon: '📍', 
            title: 'My Location', 
            desc: 'Location tracking',
            path: '/employee/mylocation'
          },
          { 
            icon: '👤', 
            title: 'My Profile', 
            desc: 'Personal details',
            path: '/employee/myprofile'
          }
        ]
    }
  }

  const handleFeatureClick = (path) => {
    navigate(path)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: getRoleColor(), 
        color: 'white', 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>Employee Management System</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {userRole.toUpperCase()} Dashboard
          </span>
          <button 
            style={{ 
              padding: '10px 20px', 
              background: 'white', 
              color: getRoleColor(), 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => window.location.href = '/login'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px' }}>
        <h2>Welcome to {getWelcomeMessage()}</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          🎉 Login successful! You are logged in as <strong>{userRole}</strong>.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {getRoleFeatures().map((feature, index) => (
            <div 
              key={index} 
              style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onClick={() => handleFeatureClick(feature.path)}
            >
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p style={{ color: '#666', margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Recent Activity</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              ✅ You successfully logged into the system as {userRole}
            </li>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              🎯 Welcome to your {getWelcomeMessage()}
            </li>
            <li style={{ padding: '10px 0' }}>
              🚀 Click on any feature above to get started
            </li>
          </ul>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Current Role: <strong style={{ color: getRoleColor() }}>{userRole.toUpperCase()}</strong>
          </p>
          <p style={{ color: '#999', fontSize: '14px' }}>
            URL: /dashboard/{userRole}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleDashboard

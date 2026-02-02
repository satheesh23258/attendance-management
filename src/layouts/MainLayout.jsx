import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  AccessTime,
  LocationOn,
  Assignment,
  Assessment,
  Notifications,
  Settings,
  AccountCircle,
  Logout,
  ChevronLeft
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

const drawerWidth = 240

const MainLayout = () => {
  const [open, setOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleProfileMenuClose()
  }

  const handleProfile = () => {
    navigate('/profile')
    handleProfileMenuClose()
  }

  const handleSettings = () => {
    navigate('/settings')
    handleProfileMenuClose()
  }

  const getMenuItems = () => {
    const items = [
      {
        text: 'Dashboard',
        icon: <Dashboard />,
        path: user?.role === 'admin' ? '/admin' : user?.role === 'hr' ? '/hr' : '/employee'
      }
    ]

    if (user?.role === 'admin') {
      items.push(
        { text: 'Employees', icon: <People />, path: '/admin/employees' },
        { text: 'Services', icon: <Assignment />, path: '/admin/services' },
        { text: 'Reports', icon: <Assessment />, path: '/admin/reports' }
      )
    }

    if (user?.role === 'hr') {
      items.push(
        { text: 'Employees', icon: <People />, path: '/hr/employees' },
        { text: 'Attendance', icon: <AccessTime />, path: '/hr/attendance' },
        { text: 'Reports', icon: <Assessment />, path: '/hr/reports' },
        { text: 'Analytics', icon: <Assessment />, path: '/hr/analytics' }
      )
    }

    if (user?.role === 'employee') {
      items.push(
        { text: 'Attendance', icon: <AccessTime />, path: '/employee/attendance' },
        { text: 'My Services', icon: <Assignment />, path: '/employee/services' },
        { text: 'Location', icon: <LocationOn />, path: '/employee/location' }
      )
    }

    items.push(
      { text: 'Live Location', icon: <LocationOn />, path: '/location/live' },
      { text: 'Notifications', icon: <Notifications />, path: '/notifications' }
    )

    return items
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: open ? `${drawerWidth}px` : 0,
          transition: 'width 0.3s, margin 0.3s'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Employee Management System
          </Typography>

          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={() => navigate('/notifications')}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{ width: 32, height: 32 }}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {user?.name}
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {getMenuItems().map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
          transition: 'width 0.3s'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout

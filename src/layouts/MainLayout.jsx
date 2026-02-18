import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import { useAuth } from '../contexts/AuthContext'

const MainLayout = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const menu = () => {
    const items = [
      { text: 'Dashboard', path: user?.role === 'admin' ? '/admin' : user?.role === 'hr' ? '/hr' : user?.role === 'employee' ? '/employee' : '/' }
    ]
    if (user?.hybrid) items.push({ text: 'Hybrid Dashboard', path: '/dashboard/hybrid' })
    if (user?.role === 'admin') items.push({ text: 'Employees', path: '/admin/employees' }, { text: 'Services', path: '/admin/services' }, { text: 'Reports', path: '/admin/reports' })
    if (user?.role === 'hr' || user?.hybrid) items.push({ text: 'Employees', path: '/hr/employees' }, { text: 'Attendance', path: '/hr/attendance' }, { text: 'Reports', path: '/hr/reports' })
    if (user?.role === 'employee') items.push({ text: 'Attendance', path: '/employee/attendance' }, { text: 'My Services', path: '/employee/services' }, { text: 'Location', path: '/employee/location' })
    items.push({ text: 'Live Location', path: '/location/live' }, { text: 'Notifications', path: '/notifications' })
    return items
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className={`hidden md:block w-60 border-r border-border h-[calc(100vh-64px)] sticky top-16 bg-white`}>
          <div className="p-4">
            <div className="text-sm font-medium mb-4">{user?.name}</div>
            <nav className="flex flex-col gap-1">
              {menu().map((item) => (
                <button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-brand-primary-50 transition-colors ${location.pathname === item.path ? 'bg-brand-primary-50 font-medium' : ''}`}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout

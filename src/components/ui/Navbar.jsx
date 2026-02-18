import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Navbar Component
 * Global navigation bar with logo, menu items, and user menu
 */
export const Navbar = ({
  logo = 'Attendance System',
  menuItems = [],
  userMenu = true,
  user = null,
  onLogout = () => {},
  className,
  ...props
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsUserMenuOpen(false)
    onLogout()
    navigate('/login')
  }

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0
        bg-white
        border-b-2 border-border
        shadow-sm
        z-50
        ${className}
      `}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-bold text-text-primary hidden sm:block">
              {logo}
            </span>
          </div>

          {/* Menu Items */}
          {menuItems.length > 0 && (
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => item.onClick?.()}
                  className="
                    px-4
                    py-2
                    text-text-primary
                    hover:bg-brand-primary-50
                    rounded-md
                    transition-colors duration-base
                    font-medium text-sm
                  "
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* User Menu */}
          {userMenu && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-md
                  hover:bg-brand-primary-50
                  transition-colors duration-base
                "
              >
                <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-text-primary font-medium hidden sm:block text-sm">
                  {user?.name || 'User'}
                </span>
                <svg
                  className={`w-4 h-4 text-text-tertiary transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-12
                    bg-white
                    border-2 border-border
                    rounded-md
                    shadow-md
                    min-w-max
                    py-2
                  "
                >
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      navigate('/profile')
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-2
                      text-text-primary
                      hover:bg-brand-primary-50
                      transition-colors
                      text-sm
                    "
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      navigate('/settings')
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-2
                      text-text-primary
                      hover:bg-brand-primary-50
                      transition-colors
                      text-sm
                    "
                  >
                    Settings
                  </button>

                  <div className="border-t border-border my-1" />

                  <button
                    onClick={handleLogout}
                    className="
                      w-full
                      text-left
                      px-4
                      py-2
                      text-error
                      hover:bg-error-50
                      transition-colors
                      text-sm
                      font-medium
                    "
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

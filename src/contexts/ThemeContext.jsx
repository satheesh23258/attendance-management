import React, { createContext, useContext, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const ThemeContext = createContext()

// Default theme for fallback
const defaultTheme = {
  theme: createTheme({
    palette: {
      primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0', contrastText: '#ffffff' },
      secondary: { main: '#2196f3', light: '#64b5f6', dark: '#1976d2', contrastText: '#ffffff' },
      background: { default: '#fafafa', paper: '#ffffff' },
      mode: 'light'
    }
  }),
  role: 'employee',
  colors: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0', contrastText: '#ffffff' },
    secondary: { main: '#2196f3', light: '#64b5f6', dark: '#1976d2', contrastText: '#ffffff' },
    background: { default: '#fafafa', paper: '#ffffff' },
    header: { main: '#1976d2', gradient: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)' }
  }
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  return context || defaultTheme
}

const roleThemes = {
  admin: {
    primary: {
      main: '#d32f2f', // Red
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#ffffff'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    header: {
      main: '#d32f2f',
      gradient: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
    }
  },
  hr: {
    primary: {
      main: '#f57c00', // Yellow/Orange
      light: '#ffb74d',
      dark: '#ef6c00',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#ffffff'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    header: {
      main: '#f57c00',
      gradient: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)'
    }
  },
  employee: {
    primary: {
      main: '#1976d2', // Blue
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    header: {
      main: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)'
    }
  },
  hybrid: {
    primary: {
      main: '#9c27b0', // Purple for hybrid
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#673ab7',
      light: '#9575cd',
      dark: '#512da8',
      contrastText: '#ffffff'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    header: {
      main: '#9c27b0',
      gradient: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 50%, #3f51b5 100%)'
    }
  }
}

export const RoleThemeProvider = ({ children, role }) => {
  const theme = useMemo(() => {
    const roleTheme = roleThemes[role] || roleThemes.employee
    
    // Minimal theme to avoid MUI conflicts
    return createTheme({
      palette: {
        primary: roleTheme.primary,
        secondary: roleTheme.secondary,
        background: roleTheme.background,
        mode: 'light'
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
          fontWeight: 600,
          fontSize: '2rem',
          lineHeight: 1.2
        },
        h6: {
          fontWeight: 600,
          fontSize: '1.25rem',
          lineHeight: 1.4
        },
        body1: {
          fontWeight: 400,
          fontSize: '1rem',
          lineHeight: 1.5
        }
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
              fontWeight: 500,
              padding: '8px 16px',
              fontSize: '0.875rem',
              boxShadow: 'none'
            },
            tableCell: {
              borderBottom: '1px solid #e2e8f0',
              fontSize: '0.875rem'
            },
            tableHeadCell: {
              backgroundColor: '#f8fafc',
              fontWeight: 600,
              color: '#1e293b'
            }
          }
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              borderBottom: '1px solid #e2e8f0',
              color: roleTheme.primary.main
            }
          }
        }
      }
    })
  }, [role])

  return (
    <ThemeContext.Provider value={{ theme, role, colors: roleThemes[role] || roleThemes.employee }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default RoleThemeProvider

import React, { createContext, useContext, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const ThemeContext = createContext()

// Default theme for fallback
const defaultTheme = {
  theme: createTheme({
    palette: {
      primary: { main: '#00c853', light: '#5efc82', dark: '#009624', contrastText: '#ffffff' },
      secondary: { main: '#000000', light: '#333333', dark: '#000000', contrastText: '#ffffff' },
      background: { default: '#ffffff', paper: '#ffffff' },
      mode: 'light'
    }
  }),
  role: 'employee',
  colors: {
    primary: { main: '#00c853', light: '#5efc82', dark: '#009624', contrastText: '#ffffff' },
    secondary: { main: '#000000', light: '#333333', dark: '#000000', contrastText: '#ffffff' },
    background: { default: '#ffffff', paper: '#ffffff' },
    header: { main: '#ffffff', gradient: 'none' }
  }
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  return context || defaultTheme
}

// Strictly matching green, white, black scheme for all roles
const uniformRoleTheme = {
  primary: {
    main: '#00c853', // vibrant green
    light: '#5efc82',
    dark: '#009624',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#000000', // black
    light: '#333333',
    dark: '#000000',
    contrastText: '#ffffff'
  },
  background: {
    default: '#f4f7f9', // pure white background (softened for default)
    paper: '#ffffff' // pure white paper
  },
  header: {
    main: '#ffffff',
    gradient: 'none' // remove gradients
  }
}

const roleThemes = {
  admin: uniformRoleTheme,
  hr: uniformRoleTheme,
  employee: uniformRoleTheme,
  hybrid: uniformRoleTheme
}

export const RoleThemeProvider = ({ children, role }) => {
  // Check local storage for theme preference, default to light
  const [mode, setMode] = React.useState(localStorage.getItem('themeMode') || 'light')

  const toggleColorMode = React.useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light'
      localStorage.setItem('themeMode', newMode)
      return newMode
    })
  }, [])

  const setExactThemeMode = React.useCallback((newMode) => {
    if (newMode === 'system') {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        newMode = isSystemDark ? 'dark' : 'light';
    }
    setMode(newMode)
    localStorage.setItem('themeMode', newMode)
  }, [])

  const theme = useMemo(() => {
    const isDark = mode === 'dark'
    const roleColors = roleThemes[role] || roleThemes.employee

    return createTheme({
      palette: {
        mode,
        primary: roleColors.primary,
        secondary: roleColors.secondary,
        background: {
          default: isDark ? '#121212' : '#f4f7f9',
          paper: isDark ? '#1e1e1e' : '#ffffff'
        },
      },
      typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: { textTransform: 'none', fontWeight: 600 }
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              transition: 'all 0.3s ease-in-out',
            },
            '*::-webkit-scrollbar': { width: '8px', height: '8px' },
            '*::-webkit-scrollbar-track': { background: isDark ? '#2c2c2c' : '#f1f1f1', borderRadius: '10px' },
            '*::-webkit-scrollbar-thumb': { background: isDark ? '#555' : '#c1c1c1', borderRadius: '10px' },
            '*::-webkit-scrollbar-thumb:hover': { background: isDark ? '#777' : '#a8a8a8' },
          }
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 20,
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.03)',
              background: isDark ? '#1e1e1e' : '#ffffff',
              border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
            }
          }
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              padding: '10px 24px',
            }
          }
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 14,
                backgroundColor: isDark ? '#2c2c2c' : '#f8fafc',
              }
            }
          }
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              backgroundColor: isDark ? '#2c2c2c' : '#f8fafc',
              fontWeight: 700,
            }
          }
        }
      }
    })
  }, [role, mode])

  return (
    <ThemeContext.Provider value={{ theme, role, mode, toggleColorMode, setExactThemeMode, colors: roleThemes[role] || roleThemes.employee }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default RoleThemeProvider

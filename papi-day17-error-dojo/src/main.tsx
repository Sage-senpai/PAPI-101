import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import './styles/global.css'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#D64545',
    },
    secondary: {
      main: '#4ECDC4',
      light: '#7AD9D2',
      dark: '#2FA6A0',
    },
    background: {
      default: '#0A0A14',
      paper: '#1A1A2E',
    },
    error: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#D64545',
    },
    warning: {
      main: '#FFD166',
      light: '#FFDA85',
      dark: '#E6BC5C',
    },
    success: {
      main: '#06D6A0',
      light: '#38DEB3',
      dark: '#05BC8B',
    },
    info: {
      main: '#118AB2',
      light: '#43A1C3',
      dark: '#0F7799',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Inter", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    fontFamilyMonospace: '"IBM Plex Mono", "Roboto Mono", monospace',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
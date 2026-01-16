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
      main: '#E6007A',
      light: '#FF1493',
      dark: '#B3005E',
    },
    secondary: {
      main: '#00B2FF',
      light: '#33C1FF',
      dark: '#008ECC',
    },
    background: {
      default: '#0A0A14',
      paper: '#1A1A2E',
    },
    success: {
      main: '#00D68F',
    },
    warning: {
      main: '#FFAA00',
    },
    error: {
      main: '#FF3D71',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Inter", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
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
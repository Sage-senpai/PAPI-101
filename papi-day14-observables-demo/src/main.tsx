//src/main
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
    },
    secondary: {
      main: '#00B2FF',
    },
    background: {
      default: '#0D0D0D',
      paper: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
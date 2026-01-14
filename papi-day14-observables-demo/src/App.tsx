//src/App.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material'
import {
  Refresh,
  PlayArrow,
  Stop,
  Warning,
  CheckCircle,
  Info,
  TrendingUp,
  Timeline,
} from '@mui/icons-material'
import BalanceTracker from './components/BalanceTracker'
import ComparisonTable from './components/ComparisonTable'
import './styles/global.css'

const App: React.FC = () => {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #E6007A 30%, #00B2FF 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Day 14: Observables vs Promises
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Real-time vs One-time Data Fetching with PAPI
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Chip
            icon={<Timeline />}
            label="Real-time Observables"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<Refresh />}
            label="One-time Promises"
            color="secondary"
            variant="outlined"
          />
        </Box>

        <Alert 
          severity="info" 
          sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}
          icon={<Info />}
        >
          <Typography variant="body1">
            This demo shows the difference between Promise-based (one-time) and Observable-based (real-time) data fetching.
            The Observable automatically updates when the blockchain state changes, while the Promise needs manual refreshing.
          </Typography>
        </Alert>
      </Box>

      {/* Connection Status */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: 'linear-gradient(135deg, rgba(230, 0, 122, 0.1) 0%, rgba(0, 178, 255, 0.1) 100%)',
          border: '1px solid rgba(230, 0, 122, 0.3)',
          borderRadius: 2,
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {connected ? (
                <>
                  <CheckCircle color="success" />
                  <Typography variant="h6">
                    Connected to Polkadot via PAPI Light Client
                  </Typography>
                </>
              ) : (
                <>
                  <Warning color="warning" />
                  <Typography variant="h6">
                    Click "Connect" to start tracking balances
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              startIcon={connected ? <Stop /> : <PlayArrow />}
              onClick={() => setConnected(!connected)}
              disabled={loading}
              sx={{
                background: connected 
                  ? 'linear-gradient(45deg, #FF416C 30%, #FF4B2B 90%)'
                  : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: connected 
                    ? 'linear-gradient(45deg, #FF416C 60%, #FF4B2B 90%)'
                    : 'linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)',
                },
              }}
            >
              {connected ? 'Disconnect' : 'Connect to Polkadot'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Fade in={connected} timeout={800}>
        <Box>
          {loading && (
            <Box sx={{ width: '100%', mb: 4 }}>
              <LinearProgress 
                sx={{ 
                  height: 8,
                  borderRadius: 4,
                  background: 'rgba(230, 0, 122, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #E6007A 30%, #00B2FF 90%)',
                  },
                }}
              />
            </Box>
          )}

          <BalanceTracker />

          <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Chip 
              label="Technical Comparison" 
              sx={{ px: 2, py: 1, fontSize: '1rem' }}
            />
          </Divider>

          <ComparisonTable />
        </Box>
      </Fade>

      {/* Footer */}
      <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Day 14 of #PAPI30Days Challenge • Built with Polkadot-API • 
          This demo connects to Polkadot Mainnet via light client
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 1 }}>
          Console logs will show Promise calls (once) vs Observable subscriptions (continuous)
        </Typography>
      </Box>
    </Container>
  )
}

export default App
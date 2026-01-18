import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Alert,
  Button,
  Fade,
  CircularProgress,
  Tooltip,
  IconButton,
  Divider,
} from '@mui/material'
import {
  NotificationsActive,
  Timeline,
  BarChart,
  FilterList,
  PlayArrow,
  Stop,
  Download,
  Settings,
  GitHub,
  Twitter,
  Bolt,
  AutoAwesome,
} from '@mui/icons-material'
import EventStream from './components/EventStream'
import EventStats from './components/EventStats'
import EventFilters from './components/EventFilters'
import ConnectionPanel from './components/ConnectionPanel'
import './styles/globals.css'

const App: React.FC = () => {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [totalEvents, setTotalEvents] = useState(0)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false)
      console.log('🚀 Polkadot Event Observatory initialized')
      console.log('📅 Day 16: Real-time Event Handling')
      console.log('🔗 Preparing to connect to Polkadot mainnet...')
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleConnect = async () => {
    if (connected) {
      console.log('🛑 Disconnecting from Polkadot...')
      setConnected(false)
      return
    }

    setLoading(true)
    console.log('🔗 Connecting to Polkadot mainnet...')
    console.log('📡 Initializing light client connection...')
    console.log('🎯 Setting up event subscriptions...')

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    setConnected(true)
    setLoading(false)
    console.log('✅ Connected to Polkadot mainnet!')
    console.log('👂 Listening for real-time events...')
    console.log('🔔 Event streams activated')
  }

  if (loading && !connected) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0A0A14 0%, #1A1A2E 100%)',
        }}
      >
        <Box className="pulse" sx={{ mb: 4 }}>
          <NotificationsActive sx={{ fontSize: 80, color: '#E6007A' }} />
        </Box>
        <Typography variant="h4" className="gradient-text" sx={{ mb: 2 }}>
          Polkadot Event Observatory
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Initializing real-time event monitoring...
        </Typography>
        <CircularProgress sx={{ color: '#00B2FF' }} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, rgba(230, 0, 122, 0.1) 0%, rgba(0, 178, 255, 0.1) 100%)',
          border: '1px solid rgba(230, 0, 122, 0.3)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(230, 0, 122, 0.1) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />
        
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
              <NotificationsActive sx={{ mr: 2, fontSize: 40, color: '#E6007A' }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                <span className="gradient-text">Day 16: Event Handling</span>
              </Typography>
              <Chip
                label="Real-time"
                sx={{ ml: 2, bgcolor: 'rgba(0, 214, 143, 0.2)', color: '#00D68F' }}
                icon={<Bolt />}
              />
            </Box>
            
            <Typography variant="h5" sx={{ mb: 3, color: 'text.secondary', position: 'relative', zIndex: 1 }}>
              Polkadot Event Observatory
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, position: 'relative', zIndex: 1 }}>
              <Chip icon={<Timeline />} label="Live Event Stream" color="primary" variant="outlined" />
              <Chip icon={<BarChart />} label="Real-time Analytics" color="secondary" variant="outlined" />
              <Chip icon={<FilterList />} label="Smart Filtering" color="success" variant="outlined" />
              <Chip icon={<AutoAwesome />} label="No Polling" color="warning" variant="outlined" />
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
              Monitor real blockchain events as they happen on Polkadot mainnet. 
              No polling, no refreshing - just pure real-time event streaming powered by PAPI.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative', zIndex: 1 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={connected ? <Stop /> : <PlayArrow />}
                onClick={handleConnect}
                sx={{
                  background: connected 
                    ? 'linear-gradient(45deg, #FF3D71 30%, #FF416C 90%)'
                    : 'linear-gradient(45deg, #00D68F 30%, #00B2FF 90%)',
                  '&:hover': {
                    background: connected 
                      ? 'linear-gradient(45deg, #FF3D71 60%, #FF416C 90%)'
                      : 'linear-gradient(45deg, #00D68F 60%, #00B2FF 90%)',
                  },
                }}
              >
                {connected ? 'Stop Monitoring' : 'Start Monitoring'}
              </Button>
              
              {connected && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Download />}
                  onClick={() => console.log('Exporting events...')}
                >
                  Export Events
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Connection Status */}
      <ConnectionPanel connected={connected} />

      {/* Main Content */}
      <Fade in={connected} timeout={800}>
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <EventStream onEventCountChange={setTotalEvents} />
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Grid container spacing={4} direction="column">
                <Grid item>
                  <EventFilters />
                </Grid>
                <Grid item>
                  <EventStats totalEvents={totalEvents} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Footer */}
      <Paper
        sx={{
          mt: 6,
          p: 3,
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              🎯 Day 16: Event Handling Mastery | #PAPI30Days Challenge
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="View source code">
                <IconButton color="primary">
                  <GitHub />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share on Twitter">
                <IconButton color="primary">
                  <Twitter />
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton color="primary">
                  <Settings />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
          🔥 Watching real Polkadot mainnet events • No polling • Real-time delivery • Type-safe event handling
          <br />
          📊 Connected to Polkadot via PAPI light client • Events: {totalEvents} and counting...
        </Typography>
      </Paper>
    </Container>
  )
}

export default App
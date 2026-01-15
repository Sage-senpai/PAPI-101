//src/App.tsx
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Alert,
  Divider,
  Button,
  Fade,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material'
import {
  RocketLaunch,
  AutoAwesome,
  Timeline,
  CompareArrows,
  Terminal,
  GitHub,
  Twitter,
  Download,
  CloudSync,
  Bolt,
} from '@mui/icons-material'
import ChainDashboard from './components/ChainDashboard'
import TransactionCenter from './components/TransactionCenter'
import StatsPanel from './components/StatsPanel'
import ConsolePanel from './components/ConsolePanel'
import './styles/global.css'

const App: React.FC = () => {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    // Simulate connection setup
    const timer = setTimeout(() => {
      setLoading(false)
      console.log('🚀 Week 2 Recap App initialized')
      console.log('📅 Day 15: Multi-Chain Balance Commander')
      console.log('🔗 Connecting to Polkadot & Kusama networks...')
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    console.log('🔄 Initializing multi-chain connection...')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setConnected(true)
    setLoading(false)
    console.log('✅ Connected to Polkadot & Kusama networks!')
    console.log('🌉 Multi-chain mode activated')
    console.log('📡 Observing chain data in real-time...')
  }

  if (loading) {
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
        <Box className="float-animation" sx={{ mb: 4 }}>
          <RocketLaunch sx={{ fontSize: 80, color: '#E6007A' }} />
        </Box>
        <Typography variant="h4" className="gradient-text" sx={{ mb: 2 }}>
          Week 2 Recap: Initializing...
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Loading Multi-Chain Balance Commander
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
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(230, 0, 122, 0.1) 0%, transparent 70%)',
          }}
        />
        
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RocketLaunch sx={{ mr: 2, fontSize: 40, color: '#E6007A' }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                <span className="gradient-text">Week 2 Recap</span>
              </Typography>
              <Chip
                label="Day 15"
                sx={{ ml: 2, bgcolor: 'rgba(0, 178, 255, 0.2)', color: '#00B2FF' }}
              />
            </Box>
            
            <Typography variant="h5" sx={{ mb: 3, color: 'text.secondary' }}>
              Multi-Chain Balance Commander
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <Chip icon={<AutoAwesome />} label="Real-time Balances" color="primary" variant="outlined" />
              <Chip icon={<CompareArrows />} label="Cross-chain Transactions" color="secondary" variant="outlined" />
              <Chip icon={<Timeline />} label="Observable Streams" color="success" variant="outlined" />
              <Chip icon={<Bolt />} label="Week 2 Skills" color="warning" variant="outlined" />
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              A showcase of everything learned in Week 2: Reading data, sending transactions, 
              multi-chain setup, and reactive programming with Observables.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={connected ? <CloudSync /> : <Bolt />}
                onClick={handleConnect}
                sx={{
                  background: connected 
                    ? 'linear-gradient(45deg, #00D68F 30%, #00B2FF 90%)'
                    : 'linear-gradient(45deg, #E6007A 30%, #FF1493 90%)',
                  '&:hover': {
                    background: connected 
                      ? 'linear-gradient(45deg, #00D68F 60%, #00B2FF 90%)'
                      : 'linear-gradient(45deg, #E6007A 60%, #FF1493 90%)',
                  },
                }}
              >
                {connected ? 'Connected' : 'Connect Chains'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<Terminal />}
                onClick={() => window.open('#console', '_self')}
              >
                View Console Logs
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Connection Status */}
      {connected && (
        <Fade in={connected} timeout={1000}>
          <Alert
            severity="success"
            sx={{ mb: 4 }}
            icon={<AutoAwesome />}
            action={
              <Button color="inherit" size="small">
                Dashboard Ready
              </Button>
            }
          >
            <Typography variant="body1">
              ✅ Connected to Polkadot & Kusama | 🔄 Real-time updates active | 
              💸 Transaction system online | 🌉 Cross-chain mode enabled
            </Typography>
          </Alert>
        </Fade>
      )}

      {/* Main Content */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <ChainDashboard />
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <TransactionCenter />
        </Grid>
      </Grid>

      {/* Stats and Console Section */}
      <Box sx={{ mt: 4 }}>
        <StatsPanel />
        <ConsolePanel />
      </Box>

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
              🎯 Week 2 Recap Complete | #PAPI30Days Challenge | Day 15
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
              <Tooltip title="Export logs">
                <IconButton color="primary">
                  <Download />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
          🔥 You've mastered: Chain data reading • Transaction sending • Multi-chain setup • Observables • Signing methods
          <br />
          🚀 Week 3 preview: Events • Error handling • Advanced transactions • dApp building
        </Typography>
      </Paper>
    </Container>
  )
}

export default App
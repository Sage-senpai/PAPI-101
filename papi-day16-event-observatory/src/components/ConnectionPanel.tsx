// src/components/ConnectionPanel.tsx
import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Chip,
  Alert,
  AlertTitle,
  Fade,
} from '@mui/material'
import {
  CheckCircle,
  Info,
  Warning,
} from '@mui/icons-material'

interface ConnectionPanelProps {
  connected: boolean
  useMock?: boolean
}

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({ connected, useMock = false }) => {
  if (!connected) return null

  return (
    <Fade in={connected} timeout={600}>
      <Alert
        severity={useMock ? 'warning' : 'success'}
        icon={useMock ? <Warning /> : <CheckCircle />}
        sx={{
          mb: 4,
          background: useMock 
            ? 'linear-gradient(135deg, rgba(255, 170, 0, 0.1) 0%, rgba(255, 61, 113, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(0, 214, 143, 0.1) 0%, rgba(0, 178, 255, 0.1) 100%)',
          border: useMock 
            ? '1px solid rgba(255, 170, 0, 0.3)'
            : '1px solid rgba(0, 214, 143, 0.3)',
          borderRadius: 2,
        }}
      >
        <AlertTitle sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {useMock ? 'Connected to Mock Network (Fallback Mode)' : 'Connected to Polkadot Mainnet'}
        </AlertTitle>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {useMock 
            ? 'Real PAPI connection unavailable. Using simulated blockchain events for demonstration.'
            : 'Event stream is active. Monitoring real Polkadot blockchain events via PAPI.'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CheckCircle sx={{ fontSize: 16 }} />}
            label={useMock ? 'Mock Data Active' : 'Live Connection'} 
            size="small" 
            sx={{ 
              bgcolor: useMock ? 'rgba(255, 170, 0, 0.2)' : 'rgba(0, 214, 143, 0.2)', 
              color: useMock ? '#FFAA00' : '#00D68F' 
            }}
          />
          <Chip 
            icon={<Info sx={{ fontSize: 16 }} />}
            label={useMock ? 'Simulated Events' : 'Real-time Events'} 
            size="small" 
            sx={{ bgcolor: 'rgba(0, 178, 255, 0.2)', color: '#00B2FF' }}
          />
          {!useMock && (
            <Chip 
              label="Polkadot Mainnet" 
              size="small" 
              sx={{ bgcolor: 'rgba(230, 0, 122, 0.2)', color: '#E6007A' }}
            />
          )}
        </Box>
      </Alert>
    </Fade>
  )
}

export default ConnectionPanel
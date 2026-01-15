//src/components/ConsolePanel.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  Button,
  Divider,
  Fade,
} from '@mui/material'
import {
  Terminal,
  ClearAll,
  PlayArrow,
  Pause,
  ContentCopy,
  Download,
  FiberManualRecord,
  Warning,
  CheckCircle,
  Error,
  Info,
} from '@mui/icons-material'

interface LogEntry {
  id: number
  timestamp: Date
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  icon: React.ReactNode
}

const ConsolePanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      timestamp: new Date(),
      message: '🚀 Week 2 Recap App initialized',
      type: 'info',
      icon: <Info />,
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000),
      message: '📅 Day 15: Multi-Chain Balance Commander',
      type: 'info',
      icon: <Info />,
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 2000),
      message: '🔗 Connecting to Polkadot & Kusama networks...',
      type: 'info',
      icon: <FiberManualRecord />,
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 3000),
      message: '✅ Connected to Polkadot & Kusama networks!',
      type: 'success',
      icon: <CheckCircle />,
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 4000),
      message: '🌉 Multi-chain mode activated',
      type: 'success',
      icon: <CheckCircle />,
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 5000),
      message: '📡 Observing chain data in real-time...',
      type: 'info',
      icon: <FiberManualRecord />,
    },
  ])
  
  const [isPaused, setIsPaused] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const consoleEndRef = useRef<HTMLDivElement>(null)
  const logCounter = useRef(logs.length)

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    if (isPaused) return
    
    const icons = {
      info: <Info />,
      success: <CheckCircle />,
      warning: <Warning />,
      error: <Error />,
    }

    const newLog: LogEntry = {
      id: ++logCounter.current,
      timestamp: new Date(),
      message,
      type,
      icon: icons[type],
    }

    setLogs(prev => [...prev.slice(-19), newLog]) // Keep last 20 logs
  }

  useEffect(() => {
    if (autoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  // Simulate live logs
  useEffect(() => {
    if (isPaused) return

    const intervals = [
      setInterval(() => {
        const messages = [
          '🔄 Balance update received via Observable',
          '📊 Processing multi-chain data...',
          '💾 Caching chain state...',
          '🔍 Validating transaction data...',
          '📡 Listening for new blocks...',
        ]
        addLog(messages[Math.floor(Math.random() * messages.length)], 'info')
      }, 3000),

      setInterval(() => {
        addLog('✅ Balance stream updated successfully', 'success')
      }, 5000),

      setInterval(() => {
        addLog('⚠️ Network latency detected, adjusting...', 'warning')
      }, 8000),
    ]

    return () => intervals.forEach(clearInterval)
  }, [isPaused])

  const clearLogs = () => {
    console.log('🧹 Clearing console logs...')
    setLogs([])
    logCounter.current = 0
  }

  const copyLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toLocaleTimeString()}] ${log.message}`
    ).join('\n')
    
    navigator.clipboard.writeText(logText)
    console.log('📋 Console logs copied to clipboard')
    addLog('Console logs copied to clipboard', 'success')
  }

  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toISOString()}] ${log.message}`
    ).join('\n')
    
    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `papi-week2-logs-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    
    console.log('💾 Logs exported to file')
    addLog('Logs exported successfully', 'success')
  }

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'info': return '#00B2FF'
      case 'success': return '#00D68F'
      case 'warning': return '#FFAA00'
      case 'error': return '#FF3D71'
      default: return '#E2E2E2'
    }
  }

  return (
    <Paper
      id="console"
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        fontFamily: '"Roboto Mono", monospace',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Terminal sx={{ fontSize: 32, color: '#00B2FF' }} />
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Developer Console
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time logs showing Week 2 concepts in action
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<FiberManualRecord />}
            label={`${logs.length} logs`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Tooltip title={isPaused ? "Resume logs" : "Pause logs"}>
            <IconButton size="small" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <PlayArrow /> : <Pause />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear logs">
            <IconButton size="small" onClick={clearLogs}>
              <ClearAll />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy logs">
            <IconButton size="small" onClick={copyLogs}>
              <ContentCopy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export logs">
            <IconButton size="small" onClick={exportLogs}>
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Console Output */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          bgcolor: '#000',
          border: '1px solid rgba(0, 178, 255, 0.3)',
          borderRadius: 2,
          height: 400,
          overflow: 'auto',
          fontFamily: '"Roboto Mono", monospace',
          fontSize: '0.875rem',
        }}
      >
        <Box sx={{ color: '#00D68F', mb: 1 }}>
          $ node papi-week2-recap.js
        </Box>
        
        {logs.map((log) => (
          <Fade in={true} key={log.id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: 1,
                color: getTypeColor(log.type),
              }}
            >
              <Box sx={{ mr: 1.5, mt: 0.5, color: getTypeColor(log.type) }}>
                {log.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box component="span" sx={{ color: '#888', mr: 2, fontSize: '0.8rem' }}>
                  [{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                </Box>
                <Box component="span">
                  {log.message}
                </Box>
              </Box>
            </Box>
          </Fade>
        ))}
        <div ref={consoleEndRef} />
      </Paper>

      {/* Console Controls */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Type a command or message..."
          size="small"
          fullWidth
          disabled={isPaused}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const input = e.currentTarget.value
              if (input.trim()) {
                addLog(`$ ${input}`, 'info')
                e.currentTarget.value = ''
              }
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: '"Roboto Mono", monospace',
            },
          }}
        />
        
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const testCommands = [
              'check_balances',
              'simulate_transaction',
              'toggle_observable',
              'multi_chain_status',
              'week2_skills_summary',
            ]
            const cmd = testCommands[Math.floor(Math.random() * testCommands.length)]
            addLog(`$ ${cmd}`, 'info')
          }}
          disabled={isPaused}
        >
          Test Command
        </Button>
      </Box>

      {/* Status Bar */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          {isPaused ? '⏸️ Logs paused' : '▶️ Live logging active'} • Showing {logs.length} entries
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Console filters: INFO • SUCCESS • WARNING • ERROR
        </Typography>
      </Box>
    </Paper>
  )
}

export default ConsolePanel
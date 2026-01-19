// papi-day17-error-dojo/src/components/ConsolePanel.tsx
import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Collapse,
  Chip,
} from '@mui/material'
import {
  Terminal,
  ExpandMore,
  ExpandLess,
  Delete,
  ContentCopy,
} from '@mui/icons-material'

interface ConsoleLog {
  id: number
  message: string
  timestamp: string
  type: 'log' | 'error' | 'warn' | 'success'
}

const ConsolePanel: React.FC = () => {
  const [logs, setLogs] = useState<ConsoleLog[]>([])
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    // Override console methods to capture logs
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    console.log = (...args: any[]) => {
      originalLog(...args)
      addLog(args.join(' '), 'log')
    }

    console.error = (...args: any[]) => {
      originalError(...args)
      addLog(args.join(' '), 'error')
    }

    console.warn = (...args: any[]) => {
      originalWarn(...args)
      addLog(args.join(' '), 'warn')
    }

    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  const addLog = (message: string, type: 'log' | 'error' | 'warn' | 'success') => {
    const newLog: ConsoleLog = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString(),
      type: message.includes('✅') ? 'success' : type
    }
    setLogs(prev => [...prev.slice(-49), newLog])
  }

  const clearLogs = () => {
    setLogs([])
  }

  const copyLogs = () => {
    const logText = logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n')
    navigator.clipboard.writeText(logText)
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return '#FF6B6B'
      case 'warn': return '#FFD166'
      case 'success': return '#06D6A0'
      default: return '#4ECDC4'
    }
  }

  return (
    <Paper
      sx={{
        mt: 4,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Terminal sx={{ color: '#00FF00' }} />
          <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
            Console Output
          </Typography>
          <Chip
            label={`${logs.length} logs`}
            size="small"
            sx={{ fontFamily: 'monospace' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Copy all logs">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                copyLogs()
              }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear logs">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                clearLogs()
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton size="small">
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Box
          sx={{
            p: 2,
            maxHeight: 300,
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          }}
        >
          {logs.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
              No console output yet...
            </Typography>
          ) : (
            logs.map((log) => (
              <Box
                key={log.id}
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    color: getLogColor(log.type),
                    wordBreak: 'break-word',
                  }}
                >
                  <span style={{ color: '#666', marginRight: 8 }}>
                    [{log.timestamp}]
                  </span>
                  {log.message}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Collapse>
    </Paper>
  )
}

export default ConsolePanel
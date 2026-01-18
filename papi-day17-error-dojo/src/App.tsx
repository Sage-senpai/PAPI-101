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
  Tabs,
  Tab,
} from '@mui/material'
import {
  BugReport,
  Security,
  Code,
  AutoFixHigh,
  PlayArrow,
  Stop,
  Download,
  GitHub,
  Twitter,
  Bolt,
  Warning,
  CheckCircle,
  Error as ErrorIcon,
  ContentCopy,
} from '@mui/icons-material'
import ValidationStudio from './components/ValidationStudio'
import ErrorExamples from './components/ErrorExamples'
import ErrorRecovery from './components/ErrorRecovery'
import ConsolePanel from './components/ConsolePanel'
import './styles/global.css'

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [totalErrors, setTotalErrors] = useState(0)
  const [validationPassed, setValidationPassed] = useState(0)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    console.log('🚀 PAPI Error Handling Dojo initialized')
    console.log('📅 Day 17: Error Handling & Validation')
    console.log('🎯 Ready to catch and fix transaction errors')
    console.log('🔍 PAPI validation system activated')
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    console.log(`📂 Switching to tab: ${['Validation Studio', 'Error Examples', 'Recovery Patterns'][newValue]}`)
  }

  const handleErrorCaught = () => {
    setTotalErrors(prev => prev + 1)
  }

  const handleValidationPassed = () => {
    setValidationPassed(prev => prev + 1)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
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
            background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />
        
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
              <BugReport sx={{ mr: 2, fontSize: 40, color: '#FF6B6B' }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                <span className="gradient-text">Day 17: Error Handling Dojo</span>
              </Typography>
              <Chip
                label="Validation Master"
                sx={{ ml: 2, bgcolor: 'rgba(6, 214, 160, 0.2)', color: '#06D6A0' }}
                icon={<Security />}
              />
            </Box>
            
            <Typography variant="h5" sx={{ mb: 3, color: 'text.secondary', position: 'relative', zIndex: 1 }}>
              PAPI Validation & Error Recovery Studio
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, position: 'relative', zIndex: 1 }}>
              <Chip icon={<BugReport />} label="Catch Errors Early" color="primary" variant="outlined" />
              <Chip icon={<Security />} label="Type-Safe Validation" color="secondary" variant="outlined" />
              <Chip icon={<AutoFixHigh />} label="Auto-Fix Suggestions" color="success" variant="outlined" />
              <Chip icon={<Code />} label="Real PAPI Errors" color="warning" variant="outlined" />
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
              Master PAPI's error handling and validation system. Learn to catch errors early, 
              understand meaningful error messages, and implement robust error recovery patterns.
              No more cryptic blockchain errors!
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative', zIndex: 1 }}>
              <Paper
                sx={{
                  p: 2,
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Errors Caught
                    </Typography>
                    <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                      {totalErrors}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Validations Passed
                    </Typography>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                      {validationPassed}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={() => setIsValidating(!isValidating)}
                sx={{
                  background: isValidating
                    ? 'linear-gradient(45deg, #FF6B6B 30%, #D64545 90%)'
                    : 'linear-gradient(45deg, #06D6A0 30%, #4ECDC4 90%)',
                  '&:hover': {
                    background: isValidating
                      ? 'linear-gradient(45deg, #FF6B6B 60%, #D64545 90%)'
                      : 'linear-gradient(45deg, #06D6A0 60%, #4ECDC4 90%)',
                  },
                }}
              >
                {isValidating ? 'Stop Validation' : 'Start Validating'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
            },
            '& .Mui-selected': {
              color: '#4ECDC4 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4ECDC4',
              height: 3,
            },
          }}
        >
          <Tab label="Validation Studio" icon={<Code />} iconPosition="start" />
          <Tab label="Error Examples" icon={<BugReport />} iconPosition="start" />
          <Tab label="Recovery Patterns" icon={<AutoFixHigh />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Main Content */}
      <Fade in={true} timeout={500}>
        <Box>
          {activeTab === 0 && (
            <ValidationStudio
              onErrorCaught={handleErrorCaught}
              onValidationPassed={handleValidationPassed}
              isActive={isValidating}
            />
          )}
          {activeTab === 1 && (
            <ErrorExamples
              onErrorCaught={handleErrorCaught}
              onValidationPassed={handleValidationPassed}
            />
          )}
          {activeTab === 2 && (
            <ErrorRecovery
              onErrorCaught={handleErrorCaught}
              onValidationPassed={handleValidationPassed}
            />
          )}
        </Box>
      </Fade>

      {/* Console Panel */}
      <ConsolePanel />

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
              🎯 Day 17: Error Handling Mastery | #PAPI30Days Challenge
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
              <Tooltip title="Copy validation results">
                <IconButton color="primary">
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
          🔥 PAPI's validation catches errors at: TypeScript level • Runtime level • Chain level
          <br />
          🛡️ Error types: Validation errors • Chain errors • Network errors • User errors
          <br />
          💡 Pro tip: Always validate before submission to save gas and frustration!
        </Typography>
      </Paper>
    </Container>
  )
}

export default App
import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  LinearProgress,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  PlayArrow,
  Stop,
  ContentCopy,
  AutoFixHigh,
  Warning,
  CheckCircle,
  Error as ErrorIcon,
  Refresh,
  Code,
  Bolt,
  Science,
} from '@mui/icons-material'
import clsx from 'clsx'
import { validateTransaction, ValidationResult } from '../utils/validationEngine'

interface ValidationStudioProps {
  onErrorCaught: () => void
  onValidationPassed: () => void
  isActive: boolean
}

const ValidationStudio: React.FC<ValidationStudioProps> = ({
  onErrorCaught,
  onValidationPassed,
  isActive,
}) => {
  const [inputType, setInputType] = useState<'json' | 'hex' | 'raw'>('json')
  const [inputData, setInputData] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [autoValidate, setAutoValidate] = useState(true)
  const [errorCount, setErrorCount] = useState(0)
  const [successCount, setSuccessCount] = useState(0)

  const exampleData = {
    json: `{
  "method": "balances.transfer_keep_alive",
  "params": {
    "dest": "5F3sa... (invalid: too short)",
    "value": "10000000000"
  }
}`,
    hex: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    raw: `method: balances.transfer_keep_alive
dest: 5F3sajj6xVWq6Y5zL8Z8X3q9Y2W1q3X4y5Z6a7b8c9d0e1f2g3h4i5j6k7l8m
value: "10000000000" // String instead of bigint`
  }

  useEffect(() => {
    if (autoValidate && inputData.trim() && isActive) {
      const debounceTimer = setTimeout(() => {
        runValidation()
      }, 500)
      
      return () => clearTimeout(debounceTimer)
    }
  }, [inputData, autoValidate, isActive])

  const runValidation = async () => {
    if (!inputData.trim() || !isActive) return

    setIsValidating(true)
    console.log(`🔍 Validating ${inputType} input...`)

    try {
      const result = await validateTransaction(inputData, inputType)
      setValidationResult(result)
      
      if (result.isValid) {
        console.log('✅ Validation passed!', result.details)
        setSuccessCount(prev => prev + 1)
        onValidationPassed()
      } else {
        console.log('❌ Validation failed:', result.errors)
        setErrorCount(prev => prev + 1)
        onErrorCaught()
      }
    } catch (error) {
      console.error('💥 Validation error:', error)
      setValidationResult({
        isValid: false,
        errors: ['Validation engine error: ' + (error as Error).message],
        warnings: [],
        details: {}
      })
      onErrorCaught()
    } finally {
      setIsValidating(false)
    }
  }

  const handleLoadExample = () => {
    setInputData(exampleData[inputType])
    console.log(`📥 Loaded ${inputType} example data`)
  }

  const handleCopyResult = () => {
    if (validationResult) {
      const resultText = JSON.stringify(validationResult, null, 2)
      navigator.clipboard.writeText(resultText)
      console.log('📋 Validation result copied to clipboard')
    }
  }

  const handleAutoFix = () => {
    if (!validationResult || validationResult.isValid) return

    console.log('🔧 Attempting auto-fix...')
    
    // Simple auto-fix examples
    let fixedData = inputData
    
    if (inputType === 'json') {
      // Fix common JSON issues
      fixedData = fixedData
        .replace(/"/g, '"') // Ensure proper quotes
        .replace(/value:\s*"(\d+)"/g, 'value: $1n') // Convert string numbers to bigint
        .replace(/dest:\s*"([^"]{5,10})\.\.\."/g, 'dest: "5F3sajj6xVWq6Y5zL8Z8X3q9Y2W1q3X4y5Z6a7b8c9d0e1f2g3h4i5j6k7l8m"') // Fix short addresses
    }
    
    setInputData(fixedData)
    console.log('✅ Auto-fix applied')
  }

  const getSeverityColor = (error: string) => {
    if (error.includes('critical') || error.includes('Invalid') || error.includes('must be')) {
      return 'error'
    } else if (error.includes('warning') || error.includes('suggest')) {
      return 'warning'
    } else {
      return 'info'
    }
  }

  return (
    <Grid container spacing={4}>
      {/* Input Panel */}
      <Grid item xs={12} lg={6}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(10, 10, 20, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Code sx={{ fontSize: 32, color: '#4ECDC4' }} />
              <Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Input Studio
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter transaction data to validate
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={`${errorCount} errors`}
                size="small"
                color="error"
                variant="outlined"
                icon={<ErrorIcon />}
              />
              <Chip
                label={`${successCount} passed`}
                size="small"
                color="success"
                variant="outlined"
                icon={<CheckCircle />}
              />
            </Box>
          </Box>

          {/* Input Type Selector */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Input Type</InputLabel>
              <Select
                value={inputType}
                label="Input Type"
                onChange={(e) => setInputType(e.target.value as any)}
              >
                <MenuItem value="json">JSON Format</MenuItem>
                <MenuItem value="hex">Hex Call Data</MenuItem>
                <MenuItem value="raw">Raw Text</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Input Field */}
          <Box sx={{ flex: 1, mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={12}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder={`Enter ${inputType} transaction data here...`}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: inputType === 'hex' ? '"IBM Plex Mono", monospace' : 'inherit',
                  fontSize: inputType === 'hex' ? '0.9rem' : 'inherit',
                },
              }}
            />
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={isValidating ? <Stop /> : <PlayArrow />}
              onClick={runValidation}
              disabled={!inputData.trim() || !isActive}
              sx={{
                background: 'linear-gradient(45deg, #4ECDC4 30%, #118AB2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4ECDC4 60%, #118AB2 90%)',
                },
              }}
            >
              {isValidating ? 'Validating...' : 'Validate Now'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Science />}
              onClick={handleLoadExample}
            >
              Load Example
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<AutoFixHigh />}
              onClick={handleAutoFix}
              disabled={!validationResult || validationResult.isValid}
            >
              Auto-Fix
            </Button>
            
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoValidate}
                    onChange={(e) => setAutoValidate(e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto-validate"
              />
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Results Panel */}
      <Grid item xs={12} lg={6}>
        <Paper
          sx={{
            p: 3,
            height: '100%',
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(10, 10, 20, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Bolt sx={{ fontSize: 32, color: '#FFD166' }} />
              <Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Validation Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  See what PAPI catches and suggests
                </Typography>
              </Box>
            </Box>
            
            <Tooltip title="Copy results">
              <IconButton onClick={handleCopyResult} disabled={!validationResult}>
                <ContentCopy />
              </IconButton>
            </Tooltip>
          </Box>

          {isValidating ? (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#4ECDC4', mb: 3 }} />
              <Typography variant="h6" color="text.secondary">
                Validating transaction data...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Checking type safety, schema, and format
              </Typography>
            </Box>
          ) : !validationResult ? (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <Science sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />
              <Typography variant="h6" color="text.secondary">
                No validation results yet
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Enter transaction data and click "Validate Now" to see PAPI's error detection in action
              </Typography>
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {/* Overall Status */}
              <Fade in={true} timeout={300}>
                <Alert
                  severity={validationResult.isValid ? 'success' : 'error'}
                  sx={{ mb: 3 }}
                  icon={validationResult.isValid ? <CheckCircle /> : <ErrorIcon />}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {validationResult.isValid ? 'Validation Passed!' : 'Validation Failed'}
                  </Typography>
                  <Typography variant="body2">
                    {validationResult.isValid
                      ? 'Transaction data is valid and ready for submission'
                      : `Found ${validationResult.errors.length} error(s) that need fixing`}
                  </Typography>
                </Alert>
              </Fade>

              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ErrorIcon color="error" /> Errors ({validationResult.errors.length})
                  </Typography>
                  
                  {validationResult.errors.map((error, index) => (
                    <Fade in={true} key={index} timeout={300 + index * 100}>
                      <Paper
                        className={clsx(
                          getSeverityColor(error) === 'error' ? 'error-critical' :
                          getSeverityColor(error) === 'warning' ? 'error-warning' : 'error-info'
                        )}
                        sx={{
                          p: 2,
                          mb: 2,
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          {getSeverityColor(error) === 'error' ? (
                            <ErrorIcon color="error" fontSize="small" />
                          ) : getSeverityColor(error) === 'warning' ? (
                            <Warning color="warning" fontSize="small" />
                          ) : (
                            <CheckCircle color="info" fontSize="small" />
                          )}
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {error}
                          </Typography>
                        </Box>
                      </Paper>
                    </Fade>
                  ))}
                </Box>
              )}

              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning color="warning" /> Warnings ({validationResult.warnings.length})
                  </Typography>
                  
                  {validationResult.warnings.map((warning, index) => (
                    <Fade in={true} key={index} timeout={300 + index * 100}>
                      <Alert severity="warning" sx={{ mb: 1 }}>
                        {warning}
                      </Alert>
                    </Fade>
                  ))}
                </Box>
              )}

              {/* Details */}
              {Object.keys(validationResult.details).length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Code color="info" /> Validation Details
                  </Typography>
                  
                  <Paper
                    sx={{
                      p: 2,
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '0.9rem',
                    }}
                  >
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {JSON.stringify(validationResult.details, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              )}
            </Box>
          )}

          {/* Stats Footer */}
          {validationResult && (
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Validation Level
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {validationResult.isValid ? 'PASSED' : 'FAILED'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Error Count
                  </Typography>
                  <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                    {validationResult.errors.length}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Warning Count
                  </Typography>
                  <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                    {validationResult.warnings.length}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}

export default ValidationStudio
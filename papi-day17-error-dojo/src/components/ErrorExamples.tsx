import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Fade,
  Divider,
  Collapse,
  Grid,
} from '@mui/material'
import {
  BugReport,
  ContentCopy,
  PlayArrow,
  Warning,
  Error as ErrorIcon,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  Science,
  Code,
  Bolt,
} from '@mui/icons-material'
import { validateTransaction } from '../utils/validationEngine'

interface ErrorExample {
  id: string
  title: string
  description: string
  errorCode: string
  inputData: string
  inputType: 'json' | 'hex' | 'raw'
  severity: 'critical' | 'warning' | 'info'
  category: 'type' | 'format' | 'chain' | 'network'
  fixSuggestion: string
}

interface ErrorExamplesProps {
  onErrorCaught: () => void
  onValidationPassed: () => void
}

const ErrorExamples: React.FC<ErrorExamplesProps> = ({ onErrorCaught, onValidationPassed }) => {
  const [expandedExample, setExpandedExample] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isTesting, setIsTesting] = useState<string | null>(null)

  const errorExamples: ErrorExample[] = [
    {
      id: 'type-mismatch',
      title: 'Type Mismatch Error',
      description: 'Passing string instead of bigint for amount',
      errorCode: 'PAPI-ERR-1001',
      inputData: `{
  "method": "balances.transfer_keep_alive",
  "params": {
    "dest": "5F3sajj6xVWq6Y5zL8Z8X3q9Y2W1q3X4y5Z6a7b8c9d0e1f2g3h4i5j6k7l8m",
    "value": "10000000000" // ❌ String instead of bigint
  }
}`,
      inputType: 'json',
      severity: 'critical',
      category: 'type',
      fixSuggestion: 'Use BigInt or append "n" (10000000000n)'
    },
    {
      id: 'invalid-address',
      title: 'Invalid Address Format',
      description: 'Address is too short and improperly formatted',
      errorCode: 'PAPI-ERR-1002',
      inputData: `{
  "method": "balances.transfer_keep_alive",
  "params": {
    "dest": "5F3sa...", // ❌ Too short
    "value": 10000000000n
  }
}`,
      inputType: 'json',
      severity: 'critical',
      category: 'format',
      fixSuggestion: 'Use full SS58 address (55 characters)'
    },
    {
      id: 'hex-malformed',
      title: 'Malformed Hex Data',
      description: 'Hex call data is incomplete or corrupted',
      errorCode: 'PAPI-ERR-1003',
      inputData: '0x1234567890abcdef', // ❌ Too short
      inputType: 'hex',
      severity: 'critical',
      category: 'format',
      fixSuggestion: 'Ensure hex data is complete and starts with 0x'
    },
    {
      id: 'missing-param',
      title: 'Missing Required Parameter',
      description: 'Required parameter "dest" is missing',
      errorCode: 'PAPI-ERR-1004',
      inputData: `{
  "method": "balances.transfer_keep_alive",
  "params": {
    "value": 10000000000n
    // ❌ Missing "dest"
  }
}`,
      inputType: 'json',
      severity: 'critical',
      category: 'type',
      fixSuggestion: 'Add "dest" parameter with valid address'
    },
    {
      id: 'negative-amount',
      title: 'Negative Amount',
      description: 'Negative value for transfer amount',
      errorCode: 'PAPI-ERR-1005',
      inputData: `{
  "method": "balances.transfer_keep_alive",
  "params": {
    "dest": "5F3sajj6xVWq6Y5zL8Z8X3q9Y2W1q3X4y5Z6a7b8c9d0e1f2g3h4i5j6k7l8m",
    "value": -10000000000n // ❌ Negative amount
  }
}`,
      inputType: 'json',
      severity: 'critical',
      category: 'type',
      fixSuggestion: 'Use positive amount only'
    },
    {
      id: 'wrong-method',
      title: 'Non-existent Method',
      description: 'Calling method that does not exist',
      errorCode: 'PAPI-ERR-1006',
      inputData: `{
  "method": "balances.send_money", // ❌ Does not exist
  "params": {
    "dest": "5F3sajj6xVWq6Y5zL8Z8X3q9Y2W1q3X4y5Z6a7b8c9d0e1f2g3h4i5j6k7l8m",
    "value": 10000000000n
  }
}`,
      inputType: 'json',
      severity: 'critical',
      category: 'type',
      fixSuggestion: 'Use correct method name from runtime metadata'
    },
    {
      id: 'insufficient-decimals',
      title: 'Insufficient Decimal Precision',
      description: 'Amount with too many decimal places',
      errorCode: 'PAPI-ERR-1007',
      inputData: `{
  "method": "balances.transfer_keep_alive",
  "params": {
    "dest": "5F3sajj6xVWq6Y5zL8Z8X3q9Y2W1q3X4y5Z6a7b8c9d0e1f2g3h4i5j6k7l8m",
    "value": 10000000000.123456789n // ❌ Too many decimals
  }
}`,
      inputType: 'json',
      severity: 'warning',
      category: 'format',
      fixSuggestion: 'Use integer values only (no decimals)'
    },
    {
      id: 'extra-param',
      title: 'Extra Parameter',
      description: 'Including parameter that method does not accept',
      errorCode: 'PAPI-ERR-1008',
      inputData: `{
  "method": "balances.transfer_keep_alive",
  "params": {
    "dest": "5F3sajj6xVWq6Y5zL8Z8X3q9Y2W1q3X4y5Z6a7b8c9d0e1f2g3h4i5j6k7l8m",
    "value": 10000000000n,
    "memo": "For dinner" // ❌ Extra parameter
  }
}`,
      inputType: 'json',
      severity: 'warning',
      category: 'type',
      fixSuggestion: 'Remove extra parameters not in method signature'
    }
  ]

  const runTest = async (example: ErrorExample) => {
    setIsTesting(example.id)
    console.log(`🧪 Testing error example: ${example.title}`)
    console.log(`📝 Input: ${example.inputData.substring(0, 50)}...`)

    try {
      const result = await validateTransaction(example.inputData, example.inputType)
      setTestResults(prev => ({ ...prev, [example.id]: result }))
      
      if (result.isValid) {
        console.log('✅ Example validation passed (unexpected!)')
        onValidationPassed()
      } else {
        console.log('❌ Example validation failed as expected:', result.errors[0])
        onErrorCaught()
      }
    } catch (error) {
      console.error('💥 Test error:', error)
      setTestResults(prev => ({ ...prev, [example.id]: { error: (error as Error).message } }))
      onErrorCaught()
    } finally {
      setIsTesting(null)
    }
  }

  const copyExample = (example: ErrorExample) => {
    navigator.clipboard.writeText(example.inputData)
    console.log(`📋 Copied example: ${example.title}`)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#FF6B6B'
      case 'warning': return '#FFD166'
      case 'info': return '#118AB2'
      default: return '#666'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'type': return <Code />
      case 'format': return <BugReport />
      case 'chain': return <Bolt />
      case 'network': return <Warning />
      default: return <ErrorIcon />
    }
  }

  return (
    <Paper
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(10, 10, 20, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Science sx={{ mr: 2, fontSize: 32, color: '#FFD166' }} />
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Common Error Examples
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Learn from real PAPI error scenarios
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          These are real error patterns that PAPI catches. Test each one to see how PAPI's validation
          provides clear error messages and helpful suggestions.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {errorExamples.map((example) => (
          <Grid item xs={12} md={6} key={example.id}>
            <Fade in={true} timeout={300}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(26, 26, 46, 0.5) 100%)',
                  border: `1px solid ${getSeverityColor(example.severity)}30`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${getSeverityColor(example.severity)}20`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                        {example.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {example.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={example.severity}
                      size="small"
                      sx={{
                        bgcolor: `${getSeverityColor(example.severity)}20`,
                        color: getSeverityColor(example.severity),
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={example.errorCode}
                      size="small"
                      icon={<BugReport fontSize="small" />}
                      sx={{ fontFamily: 'monospace' }}
                    />
                    <Chip
                      label={example.category}
                      size="small"
                      variant="outlined"
                      icon={getCategoryIcon(example.category)}
                    />
                  </Box>

                  <Collapse in={expandedExample === example.id}>
                    <Paper
                      sx={{
                        p: 2,
                        mb: 2,
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 1,
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '0.85rem',
                        maxHeight: 200,
                        overflow: 'auto',
                      }}
                    >
                      <pre style={{ margin: 0 }}>{example.inputData}</pre>
                    </Paper>
                  </Collapse>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Button
                      size="small"
                      onClick={() => setExpandedExample(
                        expandedExample === example.id ? null : example.id
                      )}
                      startIcon={expandedExample === example.id ? <ExpandLess /> : <ExpandMore />}
                    >
                      {expandedExample === example.id ? 'Hide Code' : 'Show Code'}
                    </Button>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Copy example">
                        <IconButton size="small" onClick={() => copyExample(example)}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Test this error">
                        <IconButton
                          size="small"
                          onClick={() => runTest(example)}
                          disabled={isTesting === example.id}
                          color={testResults[example.id]?.isValid ? 'success' : 'error'}
                        >
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Test Results */}
                  {testResults[example.id] && (
                    <Fade in={true}>
                      <Box>
                        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                        
                        {testResults[example.id].error ? (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            Test failed: {testResults[example.id].error}
                          </Alert>
                        ) : testResults[example.id].isValid ? (
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            Unexpected: This example should have failed validation
                          </Alert>
                        ) : (
                          <Box>
                            <Alert severity="error" sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                PAPI caught the error!
                              </Typography>
                              <Typography variant="body2">
                                {testResults[example.id].errors[0]}
                              </Typography>
                            </Alert>
                            
                            <Paper
                              sx={{
                                p: 2,
                                background: 'rgba(6, 214, 160, 0.1)',
                                border: '1px solid rgba(6, 214, 160, 0.3)',
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#06D6A0' }}>
                                💡 Fix Suggestion:
                              </Typography>
                              <Typography variant="body2">
                                {example.fixSuggestion}
                              </Typography>
                            </Paper>
                          </Box>
                        )}
                      </Box>
                    </Fade>
                  )}

                  {/* Loading State */}
                  {isTesting === example.id && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      <CircularProgress size={16} />
                      <Typography variant="caption" color="text.secondary">
                        Testing validation...
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Summary */}
      <Paper
        sx={{
          mt: 4,
          p: 3,
          background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(17, 138, 178, 0.1) 100%)',
          border: '1px solid rgba(78, 205, 196, 0.3)',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" /> Key Takeaways
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✅ <strong>PAPI catches errors early</strong> - before they reach the chain
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✅ <strong>Clear error messages</strong> - tells you exactly what's wrong
            </Typography>
            <Typography variant="body2">
              ✅ <strong>Helpful suggestions</strong> - shows how to fix the error
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✅ <strong>Multiple validation levels</strong> - type, format, schema
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✅ <strong>Error categorization</strong> - critical vs warning vs info
            </Typography>
            <Typography variant="body2">
              ✅ <strong>Real-time feedback</strong> - validate as you type
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Paper>
  )
}

export default ErrorExamples
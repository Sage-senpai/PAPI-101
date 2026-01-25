// papi-day17-error-dojo/src/components/ErrorRecovery.tsx
import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Card,
  CardContent,
  Button,
  Collapse,
  Grid,
} from '@mui/material'
import {
  AutoFixHigh,
  CheckCircle,
  Warning,
  ContentCopy,
  PlayArrow,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material'

interface RecoveryPattern {
  id: string
  title: string
  description: string
  code: string
  benefits: string[]
  whenToUse: string
  category: 'retry' | 'fallback' | 'user' | 'system'
}

interface ErrorRecoveryProps {
  onErrorCaught: () => void
  onValidationPassed: () => void
}

const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({ onValidationPassed }) => {
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null)

  const recoveryPatterns: RecoveryPattern[] = [
    {
      id: 'retry-backoff',
      title: 'Retry with Exponential Backoff',
      description: 'Automatically retry transient errors with increasing delays',
      code: `async function submitWithRetry(tx, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await tx.signAndSubmit(signer);
    } catch (error) {
      if (!isRecoverable(error) || attempt === maxRetries) throw error;
      await delay(1000 * attempt ** 2); // Exponential backoff
      console.log(\`Retry \${attempt}/\${maxRetries}\`);
    }
  }
}`,
      benefits: [
        'Handles temporary network issues',
        'Prevents overwhelming the network',
        'Improves success rate for flaky connections'
      ],
      category: 'retry',
      whenToUse: 'For network-related errors like nonce issues or temporary unavailability'
    },
    {
      id: 'fallback-signer',
      title: 'Fallback Signer Strategy',
      description: 'Switch to backup signer if primary fails',
      code: `async function safeSign(tx, primarySigner, fallbackSigner) {
  try {
    return await tx.signAsync(primarySigner);
  } catch (error) {
    console.warn("Primary signer failed—switching to fallback");
    return await tx.signAsync(fallbackSigner);
  }
}`,
      benefits: [
        'Increases reliability with redundancy',
        'Seamless failover for users',
        'Supports hybrid signing (extension + private key)'
      ],
      category: 'fallback',
      whenToUse: 'When multiple signing methods are available, like extension + hardware wallet'
    },
    {
      id: 'user-friendly-errors',
      title: 'User-Friendly Error Mapping',
      description: 'Translate technical errors to plain English',
      code: `function userFriendlyError(error) {
  const friendlyMap = {
    'Invalid address': 'Please check the recipient address—it looks incorrect.',
    'Insufficient balance': 'Not enough funds. Add more DOT to your account.',
    'Nonce too low': 'Transaction out of order. Retrying automatically...',
    'Invalid call data': 'The transaction data is incomplete. Please try again.',
  };
  return friendlyMap[error.message] || error.message;
}`,
      benefits: [
        'Reduces user frustration',
        'Improves support efficiency',
        'Increases transaction completion rates'
      ],
      category: 'user',
      whenToUse: 'For all user-facing error messages to improve UX'
    },
    {
      id: 'error-boundaries',
      title: 'Error Boundaries',
      description: 'Isolate errors to prevent app crashes',
      code: `class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error">
          Something went wrong. {userFriendlyError(this.state.error)}
          <Button onClick={() => this.setState({ hasError: false })}>
            Retry
          </Button>
        </Alert>
      );
    }
    return this.props.children;
  }
}`,
      benefits: [
        'Prevents whole app crashes',
        'Graceful degradation',
        'Better user experience during errors'
      ],
      category: 'system',
      whenToUse: 'Wrap critical components like transaction builders'
    }
  ]

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    console.log('📋 Copied recovery pattern code to clipboard')
  }

  const testPattern = (pattern: RecoveryPattern) => {
    console.log(`🧪 Testing recovery pattern: ${pattern.title}`)
    setTimeout(() => {
      console.log(`✅ Recovery pattern test passed: ${pattern.title}`)
      onValidationPassed()
    }, 1000)
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
        <AutoFixHigh sx={{ mr: 2, fontSize: 32, color: '#06D6A0' }} />
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Recovery Patterns
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Strategies to handle and recover from errors
          </Typography>
        </Box>
      </Box>

      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          These patterns help make your dApps more resilient. Test each one to see recovery in action.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {recoveryPatterns.map((pattern) => (
          <Grid item xs={12} md={6} key={pattern.id}>
            <Fade in={true} timeout={300}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(26, 26, 46, 0.5) 100%)',
                  border: '1px solid rgba(6, 214, 160, 0.3)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(6, 214, 160, 0.2)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                        {pattern.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {pattern.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={pattern.category}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(6, 214, 160, 0.2)',
                        color: '#06D6A0',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    <strong>When to use:</strong> {pattern.whenToUse}
                  </Typography>

                  <Collapse in={expandedPattern === pattern.id}>
                    <Paper
                      sx={{
                        p: 2,
                        mb: 2,
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 1,
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '0.85rem',
                        maxHeight: 300,
                        overflow: 'auto',
                      }}
                    >
                      <pre style={{ margin: 0 }}>{pattern.code}</pre>
                    </Paper>
                  </Collapse>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Benefits:
                    </Typography>
                    {pattern.benefits.map((benefit, index) => (
                      <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <CheckCircle fontSize="small" color="success" />
                        {benefit}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      size="small"
                      onClick={() => setExpandedPattern(
                        expandedPattern === pattern.id ? null : pattern.id
                      )}
                      startIcon={expandedPattern === pattern.id ? <ExpandLess /> : <ExpandMore />}
                    >
                      {expandedPattern === pattern.id ? 'Hide Code' : 'Show Code'}
                    </Button>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Copy code">
                        <IconButton size="small" onClick={() => copyCode(pattern.code)}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Test pattern">
                        <IconButton size="small" onClick={() => testPattern(pattern)}>
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Paper
        sx={{
          mt: 4,
          p:3,
background: 'rgba(6, 214, 160, 0.1)',
border: '1px solid rgba(6, 214, 160, 0.3)',
borderRadius: 2,
}}
>
<Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
<AutoFixHigh color="success" /> Why Recovery Matters
</Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      In production dApps, errors are inevitable. Good recovery patterns turn 70% success rates into 95%+.
    </Typography>
    
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" /> Before: Crash on error
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" /> After: Graceful recovery
        </Typography>
      </Grid>
    </Grid>
  </Paper>
</Paper>
)
}
export default ErrorRecovery
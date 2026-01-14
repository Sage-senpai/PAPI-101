//src/components/BalanceTracker.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Fade,
  CircularProgress,
} from '@mui/material'
import {
  Refresh,
  PlayArrow,
  Stop,
  TrendingUp,
  Timeline,
  Bolt,
  HistoryToggleOff,
} from '@mui/icons-material'
import Decimal from 'decimal.js'
import { createPolkadotClient } from '../utils/polkadotClient'

interface BalanceData {
  promiseBalance: string | null
  observableBalance: string | null
  lastUpdated: Date | null
  updateCount: number
  isSubscribed: boolean
  error: string | null
}

const BalanceTracker: React.FC = () => {
  const [balanceData, setBalanceData] = useState<BalanceData>({
    promiseBalance: null,
    observableBalance: null,
    lastUpdated: null,
    updateCount: 0,
    isSubscribed: false,
    error: null,
  })
  
  const [loadingPromise, setLoadingPromise] = useState(false)
  const [loadingObservable, setLoadingObservable] = useState(false)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)
  const apiRef = useRef<any>(null)

  // Polkadot Treasury account (public, read-only)
  const TEST_ADDRESS = '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB'

  const formatBalance = (raw: string | null): string => {
    if (!raw) return '0.0000'
    try {
      // Convert planck to DOT (1 DOT = 10^10 planck)
      const decimal = new Decimal(raw)
      const dot = decimal.div(10_000_000_000)
      return dot.toFixed(4)
    } catch {
      return 'Error'
    }
  }

  const getApi = async () => {
    if (!apiRef.current) {
      try {
        console.log('⏳ Connecting to Polkadot (may take 5-10 seconds)...')
        apiRef.current = await createPolkadotClient()
        console.log('✅ API ready')
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        const displayError = `Connection failed: ${errorMsg}`
        console.error('❌', displayError)
        setBalanceData(prev => ({ 
          ...prev, 
          error: displayError
        }))
        throw error
      }
    }
    return apiRef.current
  }

  const fetchWithPromise = async () => {
    setLoadingPromise(true)
    setBalanceData(prev => ({ ...prev, error: null }))
    console.log('🔵 [PROMISE] Starting balance fetch...')
    
    try {
      const api = await getApi()
      
      // Promise-based: single request, single response
      console.log('🔵 [PROMISE] Querying account balance...')
      const accountData = await api.query.system.account(TEST_ADDRESS)
      const balance = accountData.data.free.toString()
      
      setBalanceData(prev => ({
        ...prev,
        promiseBalance: balance,
        lastUpdated: new Date(),
      }))
      
      console.log('✅ [PROMISE] Balance fetched:', formatBalance(balance), 'DOT')
      console.log('⚠️  [PROMISE] Note: This only runs once. Click again to manually refresh.')
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error('❌ [PROMISE] Error:', errorMsg)
      setBalanceData(prev => ({ ...prev, error: `Promise error: ${errorMsg}` }))
    } finally {
      setLoadingPromise(false)
    }
  }

  const startObservableSubscription = async () => {
    if (balanceData.isSubscribed) {
      stopObservableSubscription()
      return
    }

    setLoadingObservable(true)
    setBalanceData(prev => ({ ...prev, error: null }))
    console.log('🟣 [OBSERVABLE] Starting balance subscription...')

    try {
      const api = await getApi()
      
      // Observable-based: continuous stream of updates
      console.log('🟣 [OBSERVABLE] Setting up subscription to balance changes...')
      
      const subscription = api.query.system.account(TEST_ADDRESS, (accountData: any) => {
        const balance = accountData.data.free.toString()
        setBalanceData(prev => ({
          ...prev,
          observableBalance: balance,
          lastUpdated: new Date(),
          updateCount: prev.updateCount + 1,
          isSubscribed: true,
          error: null,
        }))
        console.log('🔄 [OBSERVABLE] Balance updated:', formatBalance(balance), 'DOT')
        console.log('📊 [OBSERVABLE] Update count:', prev.updateCount + 1)
      })

      subscriptionRef.current = subscription
      console.log('✅ [OBSERVABLE] Subscription active - listening for balance changes')
      setBalanceData(prev => ({ ...prev, isSubscribed: true }))

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error('❌ [OBSERVABLE] Error:', errorMsg)
      setBalanceData(prev => ({ 
        ...prev, 
        error: `Observable error: ${errorMsg}`,
        isSubscribed: false 
      }))
    } finally {
      setLoadingObservable(false)
    }
  }

  const stopObservableSubscription = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
      setBalanceData(prev => ({ ...prev, isSubscribed: false }))
      console.log('⏹️  [OBSERVABLE] Subscription stopped')
    }
  }

  useEffect(() => {
    return () => {
      stopObservableSubscription()
    }
  }, [])

  return (
    <Grid container spacing={4}>
      {/* Error Alert */}
      {balanceData.error && (
        <Grid item xs={12}>
          <Alert severity="error">
            <Typography variant="body2">
              <strong>Error:</strong> {balanceData.error}
            </Typography>
          </Alert>
        </Grid>
      )}

      {/* Promise Card */}
      <Grid item xs={12} md={6}>
        <Card 
          sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(33, 150, 243, 0.2)',
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <HistoryToggleOff sx={{ mr: 1, color: '#2196F3' }} />
              <Typography variant="h5" component="h2">
                Promise-based (One-time)
              </Typography>
              <Chip 
                label="Manual Refresh" 
                size="small" 
                sx={{ ml: 2, bgcolor: 'rgba(33, 150, 243, 0.2)' }}
              />
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              Fetches balance once. Requires manual refresh for updates.
            </Alert>

            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h2" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                {formatBalance(balanceData.promiseBalance)} DOT
              </Typography>
              <Typography variant="body2" color="text.secondary">
                One-time fetched balance
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={fetchWithPromise}
                disabled={loadingPromise}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)',
                  },
                }}
              >
                {loadingPromise ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Fetch Balance (Promise)'
                )}
              </Button>
            </Box>

            {balanceData.lastUpdated && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
                Last updated: {balanceData.lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Observable Card */}
      <Grid item xs={12} md={6}>
        <Card 
          sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, rgba(230, 0, 122, 0.1) 0%, rgba(255, 20, 147, 0.1) 100%)',
            border: '1px solid rgba(230, 0, 122, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(230, 0, 122, 0.2)',
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Bolt sx={{ mr: 1, color: '#E6007A' }} />
              <Typography variant="h5" component="h2">
                Observable-based (Real-time)
              </Typography>
              <Chip 
                label="Auto Updates" 
                size="small" 
                sx={{ ml: 2, bgcolor: 'rgba(230, 0, 122, 0.2)' }}
                icon={<TrendingUp />}
              />
            </Box>

            <Alert severity="success" sx={{ mb: 3 }}>
              Subscribes to balance changes. Automatically updates when chain state changes.
            </Alert>

            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h2" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                {formatBalance(balanceData.observableBalance) || '0.0000'} DOT
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {balanceData.isSubscribed ? 'Live balance stream' : 'Subscription inactive'}
              </Typography>
              
              {balanceData.isSubscribed && (
                <Chip 
                  label={`${balanceData.updateCount} updates`}
                  size="small"
                  sx={{ mt: 1, bgcolor: 'rgba(0, 255, 0, 0.1)' }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={balanceData.isSubscribed ? <Stop /> : <PlayArrow />}
                onClick={startObservableSubscription}
                disabled={loadingObservable}
                sx={{
                  background: balanceData.isSubscribed
                    ? 'linear-gradient(45deg, #FF416C 30%, #FF4B2B 90%)'
                    : 'linear-gradient(45deg, #E6007A 30%, #FF1493 90%)',
                  '&:hover': {
                    background: balanceData.isSubscribed
                      ? 'linear-gradient(45deg, #FF416C 60%, #FF4B2B 90%)'
                      : 'linear-gradient(45deg, #E6007A 60%, #FF1493 90%)',
                  },
                }}
              >
                {loadingObservable ? (
                  <CircularProgress size={24} color="inherit" />
                ) : balanceData.isSubscribed ? (
                  'Stop Subscription'
                ) : (
                  'Start Live Stream'
                )}
              </Button>
            </Box>

            {balanceData.isSubscribed && (
              <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
                🔄 Live subscription active - watching for balance changes
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default BalanceTracker
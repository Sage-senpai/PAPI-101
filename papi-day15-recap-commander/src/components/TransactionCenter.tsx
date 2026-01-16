
import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Grid,
} from '@mui/material'
import {
  Send,
  SwapHoriz,
  Receipt,
  History,
  AccountBalanceWallet,
  CheckCircle,
  ContentCopy,
} from '@mui/icons-material'

const TransactionCenter: React.FC = () => {
  const [formData, setFormData] = useState({
    fromChain: 'polkadot',
    toChain: 'kusama',
    amount: '',
    recipient: '',
    memo: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [txHistory, setTxHistory] = useState<any[]>([])
  const [lastTx, setLastTx] = useState<any>(null)

  const chains = [
    { value: 'polkadot', label: 'Polkadot', color: '#E6007A' },
    { value: 'kusama', label: 'Kusama', color: '#000000' },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const simulateTransaction = async () => {
    if (!formData.amount || !formData.recipient) {
      console.warn('⚠️ Transaction validation failed: Missing fields')
      return
    }

    setLoading(true)
    
    const txData = {
      id: `tx_${Date.now()}`,
      fromChain: formData.fromChain,
      toChain: formData.toChain,
      amount: formData.amount,
      recipient: formData.recipient,
      memo: formData.memo,
      timestamp: new Date(),
      status: 'pending',
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    }

    console.log('🚀 Starting cross-chain transaction simulation...')
    console.log(`📤 From: ${formData.fromChain.toUpperCase()}`)
    console.log(`📥 To: ${formData.toChain.toUpperCase()}`)
    console.log(`💰 Amount: ${formData.amount} ${formData.fromChain === 'polkadot' ? 'DOT' : 'KSM'}`)
    console.log(`👤 Recipient: ${formData.recipient}`)
    console.log('⏳ Signing transaction via Polkadot.js extension...')

    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('✅ Transaction signed successfully')

    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('📡 Transaction broadcast to network')

    await new Promise(resolve => setTimeout(resolve, 1500))
txData.status = 'confirmed'
setLastTx(txData)
setTxHistory(prev => [txData, ...prev.slice(0, 4)])

console.log('🎉 Transaction confirmed on chain!')
console.log(`🔗 Tx Hash: ${txData.hash}`)
console.log(`⏰ Time: ${txData.timestamp.toLocaleTimeString()}`)
console.log('📊 Updating balance observables...')

setLoading(false)
setFormData(prev => ({ ...prev, amount: '', recipient: '', memo: '' }))
}
const copyToClipboard = (text: string) => {
navigator.clipboard.writeText(text)
console.log('📋 Copied to clipboard:', text)
}
return (
<Paper
elevation={0}
sx={{
p: 3,
height: '100%',
background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(10, 10, 20, 0.9) 100%)',
border: '1px solid rgba(255, 255, 255, 0.1)',
borderRadius: 3,
}}
>
<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
<Send sx={{ mr: 2, fontSize: 32, color: '#FFAA00' }} />
<Box>
<Typography variant="h5" component="h2" sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
Transaction Center
</Typography>
<Typography variant="body2" color="text.secondary">
Send transactions across chains (Week 2 Skill)
</Typography>
</Box>
</Box>
  {/* Transaction Form */}
  <Card elevation={0} sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SwapHoriz sx={{ mr: 1, color: '#00B2FF' }} />
        <Typography variant="h6">
          Cross-chain Transfer
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>From Chain</InputLabel>
            <Select
              name="fromChain"
              value={formData.fromChain}
              label="From Chain"
              onChange={handleSelectChange}
            >
              {chains.map(chain => (
                <MenuItem key={chain.value} value={chain.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: chain.color }} />
                    {chain.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>To Chain</InputLabel>
            <Select
              name="toChain"
              value={formData.toChain}
              label="To Chain"
              onChange={handleSelectChange}
            >
              {chains.map(chain => (
                <MenuItem key={chain.value} value={chain.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: chain.color }} />
                    {chain.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            size="small"
            InputProps={{
              endAdornment: (
                <Chip 
                  label={formData.fromChain === 'polkadot' ? 'DOT' : 'KSM'} 
                  size="small" 
                />
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Recipient Address"
            name="recipient"
            value={formData.recipient}
            onChange={handleInputChange}
            placeholder="5F3s... or F7fq..."
            size="small"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Memo (Optional)"
            name="memo"
            value={formData.memo}
            onChange={handleInputChange}
            placeholder="Week 2 recap transaction"
            size="small"
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={loading ? <History /> : <Send />}
        onClick={simulateTransaction}
        disabled={loading || !formData.amount || !formData.recipient}
        sx={{
          mt: 3,
          background: 'linear-gradient(45deg, #FFAA00 30%, #FFD700 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #FFAA00 60%, #FFD700 90%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(255, 170, 0, 0.3)',
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {loading ? 'Processing...' : 'Send Transaction'}
      </Button>

      {loading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            sx={{ 
              height: 4,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(45deg, #FFAA00, #FFD700)',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Signing → Broadcasting → Confirming
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>

  {/* Last Transaction */}
  {lastTx && (
    <Fade in={!!lastTx} timeout={1000}>
      <Card elevation={0} sx={{ mb: 3, bgcolor: 'rgba(0, 214, 143, 0.1)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Receipt sx={{ mr: 1, color: '#00D68F' }} />
            <Typography variant="h6">
              Last Transaction
            </Typography>
            <Chip
              label="Confirmed"
              size="small"
              sx={{ ml: 2, bgcolor: '#00D68F', color: '#000' }}
              icon={<CheckCircle />}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {lastTx.fromChain.toUpperCase()} → {lastTx.toChain.toUpperCase()}
            </Typography>
            <Typography variant="h6">
              {lastTx.amount} {lastTx.fromChain === 'polkadot' ? 'DOT' : 'KSM'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              {lastTx.timestamp.toLocaleTimeString()}
            </Typography>
            <Tooltip title="Copy Tx Hash">
              <IconButton 
                size="small" 
                onClick={() => copyToClipboard(lastTx.hash)}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )}

  {/* Transaction History */}
  <Card elevation={0} sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <History sx={{ mr: 1, color: '#E6007A' }} />
        <Typography variant="h6">
          Recent Transactions
        </Typography>
      </Box>

      {txHistory.length > 0 ? (
        <Box>
          {txHistory.map((tx, index) => (
            <React.Fragment key={tx.id}>
              <Box sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2">
                    {tx.fromChain.toUpperCase()} → {tx.toChain.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tx.amount} {tx.fromChain === 'polkadot' ? 'DOT' : 'KSM'}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {tx.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
              {index < txHistory.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />}
            </React.Fragment>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <AccountBalanceWallet sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            No transactions yet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Send your first transaction to see history
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
</Paper>
)
}
export default TransactionCenter
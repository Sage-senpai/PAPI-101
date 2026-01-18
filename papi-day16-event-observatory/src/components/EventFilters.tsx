// src/components/EventFilters.tsx
import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  Chip,
  Slider,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Grid,
  Checkbox,
} from '@mui/material'
import {
  FilterList,
  ClearAll,
  Save,
  Timer,
  AccountBalance,
  SwapHoriz,
  TrendingUp,
  Warning,
} from '@mui/icons-material'

const EventFilters: React.FC = () => {
  const [filters, setFilters] = useState({
    transfers: true,
    deposits: true,
    withdrawals: true,
    staking: true,
    treasury: false,
    governance: false,
  })

  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(10000)
  const [addressFilter, setAddressFilter] = useState('')

  const eventTypes = [
    { id: 'transfers', label: 'Transfers', icon: <SwapHoriz />, color: '#00D68F' },
    { id: 'deposits', label: 'Deposits', icon: <AccountBalance />, color: '#00B2FF' },
    { id: 'withdrawals', label: 'Withdrawals', icon: <AccountBalance />, color: '#FFAA00' },
    { id: 'staking', label: 'Staking', icon: <TrendingUp />, color: '#E6007A' },
    { id: 'treasury', label: 'Treasury', icon: <AccountBalance />, color: '#8A2BE2' },
    { id: 'governance', label: 'Governance', icon: <Warning />, color: '#FF3D71' },
  ]

  const handleFilterChange = (id: string) => {
    setFilters(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof filters]
    }))
    console.log(`🎯 Filter ${id} toggled`)
  }

  const handleClearFilters = () => {
    setFilters({
      transfers: false,
      deposits: false,
      withdrawals: false,
      staking: false,
      treasury: false,
      governance: false,
    })
    setMinAmount(0)
    setMaxAmount(10000)
    setAddressFilter('')
    console.log('🧹 All filters cleared')
  }

  const handleSaveFilters = () => {
    const config = {
      filters,
      amountRange: [minAmount, maxAmount],
      addressFilter,
    }
    console.log('💾 Filter configuration:', config)
    alert('Filters applied! Check console for configuration.')
  }

  const activeFilters = Object.values(filters).filter(Boolean).length

  return (
    <Paper
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(10, 10, 20, 0.9) 100%)',
border: '1px solid rgba(255, 255, 255, 0.1)',
borderRadius: 3,
}}
>
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
<FilterList sx={{ fontSize: 32, color: '#00B2FF' }} />
<Box>
<Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
Event Filters
</Typography>
<Typography variant="body2" color="text.secondary">
Control what you see
</Typography>
</Box>
</Box>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Chip
        label={`${activeFilters} active`}
        size="small"
        color="primary"
        variant="outlined"
      />
      <Tooltip title="Clear all filters">
        <IconButton size="small" onClick={handleClearFilters}>
          <ClearAll />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>

  {/* Event Type Filters */}
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Event Types
    </Typography>
    
    <Grid container spacing={1}>
      {eventTypes.map((eventType) => (
        <Grid item xs={6} key={eventType.id}>
          <Paper
            sx={{
              p: 1.5,
              background: filters[eventType.id as keyof typeof filters] 
                ? `${eventType.color}15`
                : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${filters[eventType.id as keyof typeof filters] ? eventType.color : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': {
                background: `${eventType.color}10`,
              },
            }}
            onClick={() => handleFilterChange(eventType.id)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: eventType.color }}>
                {eventType.icon}
              </Box>
              <Typography variant="body2" sx={{ flex: 1 }}>
                {eventType.label}
              </Typography>
              <Checkbox
                checked={filters[eventType.id as keyof typeof filters]}
                size="small"
                sx={{ p: 0 }}
              />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>

  <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

  {/* Amount Filter */}
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Amount Filter (DOT)
    </Typography>
    
    <Box sx={{ px: 1 }}>
      <Slider
        value={[minAmount, maxAmount]}
        onChange={(_, newValue) => {
          const [min, max] = newValue as [number, number]
          setMinAmount(min)
          setMaxAmount(max)
        }}
        valueLabelDisplay="auto"
        min={0}
        max={100000}
        step={100}
        sx={{
          color: '#00B2FF',
          '& .MuiSlider-thumb': {
            background: 'linear-gradient(45deg, #00B2FF, #00D68F)',
          },
        }}
      />
      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          label="Min"
          type="number"
          value={minAmount}
          onChange={(e) => setMinAmount(Number(e.target.value))}
          size="small"
          fullWidth
        />
        <TextField
          label="Max"
          type="number"
          value={maxAmount}
          onChange={(e) => setMaxAmount(Number(e.target.value))}
          size="small"
          fullWidth
        />
      </Box>
    </Box>
  </Box>

  {/* Address Filter */}
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Address Filter
    </Typography>
    
    <TextField
      fullWidth
      placeholder="Filter by address (e.g., 15oF4u...)"
      value={addressFilter}
      onChange={(e) => setAddressFilter(e.target.value)}
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          fontFamily: 'monospace',
        },
      }}
    />
  </Box>

  {/* Action Buttons */}
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Button
      variant="outlined"
      fullWidth
      startIcon={<ClearAll />}
      onClick={handleClearFilters}
    >
      Clear All
    </Button>
    <Button
      variant="contained"
      fullWidth
      startIcon={<Save />}
      onClick={handleSaveFilters}
      sx={{
        background: 'linear-gradient(45deg, #00B2FF 30%, #00D68F 90%)',
        '&:hover': {
          background: 'linear-gradient(45deg, #00B2FF 60%, #00D68F 90%)',
        },
      }}
    >
      Apply
    </Button>
  </Box>

  {/* Filter Status */}
  <Alert 
    severity="info" 
    sx={{ mt: 3 }}
    icon={<FilterList />}
  >
    <Typography variant="caption">
      Filters are applied client-side for optimal performance.
    </Typography>
  </Alert>
</Paper>
)
}
export default EventFilters
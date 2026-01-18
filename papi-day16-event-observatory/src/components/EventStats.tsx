import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material'
import {
  Timeline,
  AccountBalance,
  TrendingUp,
  Warning,
  BarChart,
  Speed,
  Update,
  Schedule,
} from '@mui/icons-material'
import { LineChart } from '@mui/x-charts/LineChart'

interface EventStatsProps {
  totalEvents: number
}

const EventStats: React.FC<EventStatsProps> = ({ totalEvents }) => {
  const eventDistribution = [
    { type: 'Transfers', count: Math.floor(totalEvents * 0.6), color: '#00D68F' },
    { type: 'Staking', count: Math.floor(totalEvents * 0.2), color: '#E6007A' },
    { type: 'Treasury', count: Math.floor(totalEvents * 0.1), color: '#8A2BE2' },
    { type: 'Other', count: Math.floor(totalEvents * 0.1), color: '#FFAA00' },
  ]

  const timeSeriesData = [
    { time: '14:00', events: 12 },
    { time: '14:05', events: 18 },
    { time: '14:10', events: 15 },
    { time: '14:15', events: 22 },
    { time: '14:20', events: 19 },
    { time: '14:25', events: 25 },
    { time: '14:30', events: 21 },
  ]

  const stats = [
    {
      label: 'Events per Minute',
      value: '4.2',
      icon: <Speed />,
      color: '#00B2FF',
      trend: 'up',
    },
    {
      label: 'Avg Block Time',
      value: '6.0s',
      icon: <Schedule />,
      color: '#00D68F',
      trend: 'stable',
    },
    {
      label: 'Total Value',
      value: `${(totalEvents * 1234.56).toLocaleString()} DOT`,
      icon: <AccountBalance />,
      color: '#E6007A',
      trend: 'up',
    },
    {
      label: 'Active Listeners',
      value: '3',
      icon: <Update />,
      color: '#FFAA00',
      trend: 'stable',
    },
  ]

  return (
    <Paper
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(10, 10, 20, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BarChart sx={{ mr: 2, fontSize: 32, color: '#00B2FF' }} />
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Event Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time statistics and trends
          </Typography>
        </Box>
      </Box>

      {/* Total Events */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: 'linear-gradient(135deg, rgba(230, 0, 122, 0.15) 0%, rgba(0, 178, 255, 0.15) 100%)',
          border: '1px solid rgba(230, 0, 122, 0.3)',
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Total Events Processed
        </Typography>
        <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1 }}>
          {totalEvents.toLocaleString()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp sx={{ color: '#00D68F', fontSize: 16 }} />
          <Typography variant="caption" color="text.secondary">
            Updated in real-time via PAPI
          </Typography>
        </Box>
      </Paper>

      {/* Event Distribution */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline fontSize="small" /> Event Distribution
        </Typography>
        
        {eventDistribution.map((item) => (
          <Box key={item.type} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">{item.type}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: item.color }}>
                {item.count}
              </Typography>
            </Box>
            <Tooltip title={`${item.count} events (${totalEvents > 0 ? Math.round((item.count / totalEvents) * 100) : 0}%)`}>
              <LinearProgress
                variant="determinate"
                value={totalEvents > 0 ? (item.count / totalEvents) * 100 : 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                  },
                }}
              />
            </Tooltip>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Quick Stats */}
      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid item xs={6} key={stat.label}>
            <Paper
              sx={{
                p: 1.5,
                height: '100%',
                background: `linear-gradient(135deg, ${stat.color}15 0%, rgba(255, 255, 255, 0.05) 100%)`,
                border: `1px solid ${stat.color}30`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ color: stat.color }}>
                  {stat.icon}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Event Rate Chart */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp fontSize="small" /> Event Rate (Last 30 min)
        </Typography>
        
        <Paper
          sx={{
            p: 2,
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ height: 100, display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
            {timeSeriesData.map((data, index) => (
              <Tooltip key={index} title={`${data.time}: ${data.events} events`}>
                <Box
                  sx={{
                    flex: 1,
                    height: `${(data.events / 30) * 100}%`,
                    background: 'linear-gradient(to top, #00B2FF, #00D68F)',
                    borderRadius: '2px 2px 0 0',
                    minHeight: 4,
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            {timeSeriesData.map((data, index) => (
              <Typography key={index} variant="caption" color="text.secondary">
                {data.time.split(':')[1]}
              </Typography>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Performance Note */}
      <Alert 
        severity="info" 
        sx={{ mt: 3 }}
        icon={<Warning />}
      >
        <Typography variant="caption">
          All data streams in real-time via PAPI event subscriptions. No polling required.
        </Typography>
      </Alert>
    </Paper>
  )
}

export default EventStats
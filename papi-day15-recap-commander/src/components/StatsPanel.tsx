import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  Tooltip,
} from '@mui/material'
import {
  Timeline,
  AccountBalance,
  Send,
  CompareArrows,
  AutoAwesome,
  Code,
  Speed,
} from '@mui/icons-material'

const StatsPanel: React.FC = () => {
  const stats = [
    {
      label: 'Observable Updates',
      value: '247',
      icon: <Timeline />,
      color: '#00B2FF',
      progress: 85,
    },
    {
      label: 'Total Balance Checks',
      value: '1,284',
      icon: <AccountBalance />,
      color: '#E6007A',
      progress: 92,
    },
    {
      label: 'Transactions Simulated',
      value: '15',
      icon: <Send />,
      color: '#FFAA00',
      progress: 45,
    },
    {
      label: 'Cross-chain Operations',
      value: '8',
      icon: <CompareArrows />,
      color: '#00D68F',
      progress: 30,
    },
  ]

  const skills = [
    { name: 'Chain Data Reading', level: 95, week: 1 },
    { name: 'Transaction Sending', level: 85, week: 2 },
    { name: 'Multi-chain Setup', level: 80, week: 2 },
    { name: 'Observables', level: 75, week: 2 },
    { name: 'Signing Methods', level: 70, week: 2 },
  ]

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(10, 10, 20, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <AutoAwesome sx={{ fontSize: 32, color: '#00D68F' }} />
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            Week 2 Stats & Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your PAPI learning journey visualized
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} key={stat.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: '100%',
                    background: `linear-gradient(135deg, ${stat.color}15 0%, rgba(255, 255, 255, 0.05) 100%)`,
                    border: `1px solid ${stat.color}30`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 20px ${stat.color}20`,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        mr: 2,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: `${stat.color}20`,
                        color: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                      },
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Skills Progress */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem' }}>
              <Code fontSize="small" /> Skills Progress
            </Typography>
            
            {skills.map((skill) => (
              <Box key={skill.name} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{skill.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`Week ${skill.week}`}
                      size="small"
                      sx={{ height: 18, fontSize: '0.65rem' }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {skill.level}%
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title={`Week ${skill.week} skill - ${skill.level}% mastered`}>
                  <LinearProgress
                    variant="determinate"
                    value={skill.level}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: skill.week === 1 
                          ? 'linear-gradient(90deg, #E6007A, #FF1493)'
                          : 'linear-gradient(90deg, #00B2FF, #00D68F)',
                      },
                    }}
                  />
                </Tooltip>
              </Box>
            ))}

            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 178, 255, 0.1)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Speed fontSize="small" />
                <Typography variant="body2">
                  Week 2 Mastery: 77%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={77}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #00B2FF, #00D68F)',
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default StatsPanel
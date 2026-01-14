//src/components/comparisonTable
import React from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  Autorenew,
  Schedule,
  Memory,
  Code,
} from '@mui/icons-material'

const ComparisonTable: React.FC = () => {
  const comparisons = [
    {
      feature: 'Data Fetching',
      promise: 'Single request, single response',
      observable: 'Continuous stream of updates',
      promiseIcon: <Schedule color="info" />,
      observableIcon: <Autorenew color="success" />,
    },
    {
      feature: 'Updates',
      promise: 'Manual refresh required',
      observable: 'Automatic on chain changes',
      promiseIcon: <Cancel color="error" />,
      observableIcon: <CheckCircle color="success" />,
    },
    {
      feature: 'Use Case',
      promise: 'Initial page load, one-time data',
      observable: 'Real-time dashboards, live feeds',
      promiseIcon: <Code color="info" />,
      observableIcon: <Memory color="success" />,
    },
    {
      feature: 'Network Calls',
      promise: 'One call per fetch',
      observable: 'One subscription, many updates',
      promiseIcon: <Cancel color="warning" />,
      observableIcon: <CheckCircle color="success" />,
    },
    {
      feature: 'Memory Management',
      promise: 'Cleanup automatic',
      observable: 'Manual unsubscribe required',
      promiseIcon: <CheckCircle color="success" />,
      observableIcon: <Cancel color="warning" />,
    },
    {
      feature: 'PAPI Method',
      promise: '.getValue()',
      observable: '.watchValue().subscribe()',
      promiseIcon: <Code color="info" />,
      observableIcon: <Code color="success" />,
    },
  ]

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Typography variant="h5" component="h3" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Code /> Technical Comparison Table
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '2px solid rgba(230, 0, 122, 0.3)' }}>
              <TableCell>
                <Typography variant="h6">Feature</Typography>
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label="Promise Approach" 
                  color="info" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label="Observable Approach" 
                  color="success" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparisons.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                  borderBottom: index < comparisons.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                }}
              >
                <TableCell>
                  <Typography variant="body1" fontWeight={500}>
                    {row.feature}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {row.promiseIcon}
                    <Typography variant="body2">
                      {row.promise}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {row.observableIcon}
                    <Typography variant="body2">
                      {row.observable}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 178, 255, 0.1)', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          💡 <strong>Pro Tip:</strong> Use Promises for initial data and Observables for real-time updates. 
          PAPI's consistent API makes switching between them effortless!
        </Typography>
      </Box>
    </Paper>
  )
}

export default ComparisonTable
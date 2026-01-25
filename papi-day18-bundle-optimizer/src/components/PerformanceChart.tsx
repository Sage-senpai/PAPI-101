import React from 'react';
import { ImportStrategy } from '../utils/bundleAnalyzer';
import { BarChart } from '@mui/x-charts/BarChart';

interface PerformanceChartProps {
  strategies: ImportStrategy[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ strategies }) => {
  const chartData = strategies.map(strategy => ({
    name: strategy.name,
    size: Math.round(strategy.totalSize / 1024),
    gzipped: Math.round(strategy.totalGzipped / 1024),
  }));

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: chartData.map(d => d.name) }]}
      series={[
        { data: chartData.map(d => d.size), label: 'Raw Size (KB)', color: '#0ea5e9' },
        { data: chartData.map(d => d.gzipped), label: 'Gzipped (KB)', color: '#059669' },
      ]}
      width={500}
      height={300}
      sx={{
        '& .MuiChartsAxis-label': {
          fill: '#9ca3af',
        },
        '& .MuiChartsLegend-root': {
          fill: '#9ca3af',
        },
      }}
    />
  );
};
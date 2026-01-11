//src/utils/metricsCalculator.ts
import type { ChainMetrics, CrossChainComparison } from '../types/multiChain';

export const calculateCrossChainStatistics = (
  metrics: Record<string, ChainMetrics>
): CrossChainComparison['statistics'] => {
  const chainMetrics = Object.values(metrics);
  
  return {
    totalBlocks: chainMetrics.reduce((sum, m) => sum + m.blockNumber, 0),
    totalValidators: chainMetrics.reduce((sum, m) => sum + m.validatorCount, 0),
    totalIssuance: chainMetrics.reduce((sum, m) => sum + m.totalIssuance, BigInt(0)),
    averageLatency: chainMetrics.reduce((sum, m) => sum + m.latency, 0) / chainMetrics.length
  };
};

export const findChainLeader = (
  metrics: Record<string, ChainMetrics>,
  metric: keyof ChainMetrics
): string => {
  const entries = Object.entries(metrics);
  if (entries.length === 0) return 'N/A';
  
  return entries.reduce((leader, [chainId, chainMetrics]) => {
    const leaderValue = metrics[leader][metric];
    const currentValue = chainMetrics[metric];
    
    if (typeof currentValue === 'number' && typeof leaderValue === 'number') {
      return currentValue > leaderValue ? chainId : leader;
    }
    
    return leader;
  }, entries[0][0]);
};

export const calculateHealthScore = (metrics: ChainMetrics): number => {
  let score = 100;
  
  // Deduct for latency
  if (metrics.latency > 1000) score -= 20;
  else if (metrics.latency > 500) score -= 10;
  else if (metrics.latency > 200) score -= 5;
  
  // Deduct if not connected
  if (metrics.status !== 'connected') score -= 50;
  
  // Bonus for recent update
  const minutesSinceUpdate = (Date.now() - metrics.timestamp.getTime()) / (1000 * 60);
  if (minutesSinceUpdate < 1) score += 10;
  
  return Math.max(0, Math.min(100, score));
};

export const formatLatency = (latency: number): string => {
  if (latency < 100) return `${latency.toFixed(0)}ms 🚀`;
  if (latency < 300) return `${latency.toFixed(0)}ms ⚡`;
  if (latency < 600) return `${latency.toFixed(0)}ms 🏃`;
  return `${latency.toFixed(0)}ms 🐢`;
};

export const getHealthColor = (score: number): string => {
  if (score >= 90) return 'text-success-maestro';
  if (score >= 70) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  if (score >= 30) return 'text-orange-400';
  return 'text-red-400';
};

export const getHealthIcon = (score: number): string => {
  if (score >= 90) return '🟢';
  if (score >= 70) return '🟡';
  if (score >= 50) return '🟠';
  return '🔴';
};
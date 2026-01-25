// ============================================================================
// FILE: papi-event-orchestrator/src/components/PerformanceMonitor.tsx
// PURPOSE: Performance metrics visualization with real-time updates
// DAY: 18 - Performance Optimization
// STATUS: FIXED - Accurate performance data display with health indicators
// ============================================================================

import React from 'react';
import { Cpu } from 'lucide-react';

interface PerformanceData {
  memoryUsage: number;  // MB
  latency: number;      // milliseconds
  cpuUsage: number;     // percentage
}

interface PerformanceMonitorProps {
  performanceData: PerformanceData;
}

/**
 * PerformanceMonitor Component
 * 
 * Displays real-time system performance metrics with visual indicators.
 * 
 * Week 3 Teaching Points:
 * - Real-time performance tracking
 * - Visual progress indicators (progress bars)
 * - Health status indicators
 * - Metric interpretation and thresholds
 * - Performance optimization awareness
 * 
 * Day 18: Performance Optimization - demonstrates monitoring overhead
 * Metrics tracked:
 * - Memory Usage: Shows application memory consumption
 * - Network Latency: WebSocket connection latency
 * - CPU Usage: Processing CPU usage percentage
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  performanceData,
}) => {
  /**
   * Determine network latency health status
   * 
   * Thresholds:
   * - < 50ms: Excellent
   * - 50-100ms: Good
   * - 100-150ms: Fair
   * - > 150ms: Poor
   */
  const getLatencyStatus = (latency: number): string => {
    if (latency < 50) return 'Excellent';
    if (latency < 100) return 'Good';
    if (latency < 150) return 'Fair';
    return 'Poor';
  };

  /**
   * Get latency status color
   */
  const getLatencyColor = (latency: number): string => {
    if (latency < 50) return 'text-green-400';
    if (latency < 100) return 'text-cyan-400';
    if (latency < 150) return 'text-yellow-400';
    return 'text-red-400';
  };

  /**
   * Determine memory usage health
   * 
   * Thresholds:
   * - < 200MB: Good
   * - 200-300MB: Fair
   * - > 300MB: High
   */
  const getMemoryStatus = (usage: number): string => {
    if (usage < 200) return 'Optimal';
    if (usage < 300) return 'Moderate';
    return 'High';
  };

  /**
   * Determine CPU usage health
   * 
   * Thresholds:
   * - < 30%: Optimal
   * - 30-60%: Good
   * - 60-80%: Fair
   * - > 80%: High
   */
  const getCpuStatus = (usage: number): string => {
    if (usage < 30) return 'Optimal';
    if (usage < 60) return 'Good';
    if (usage < 80) return 'Fair';
    return 'High';
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      {/* Header */}
      <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
        <Cpu className="w-5 h-5 text-orange-400" />
        <span>System Performance</span>
      </h3>

      {/* Performance Metrics */}
      <div className="space-y-5">
        {/* Memory Usage Metric */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-sm text-gray-400 font-medium block">
                Memory Usage
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Status: <span className="text-blue-400">{getMemoryStatus(performanceData.memoryUsage)}</span>
              </p>
            </div>
            <span className="text-sm font-semibold text-blue-400">
              {performanceData.memoryUsage.toFixed(1)} MB
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (performanceData.memoryUsage / 500) * 100,
                  100
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 MB</span>
            <span>500 MB (Max)</span>
          </div>
        </div>

        {/* Network Latency Metric */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-sm text-gray-400 font-medium block">
                Network Latency
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Status:{' '}
                <span className={getLatencyColor(performanceData.latency)}>
                  {getLatencyStatus(performanceData.latency)}
                </span>
              </p>
            </div>
            <span className="text-sm font-semibold text-green-400">
              {performanceData.latency.toFixed(0)} ms
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (performanceData.latency / 200) * 100,
                  100
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 ms</span>
            <span>200 ms (Max)</span>
          </div>

          {/* Latency Info */}
          <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs text-gray-400 border border-gray-700">
            <p>
              💡 WebSocket connection latency to RPC endpoints
            </p>
          </div>
        </div>

        {/* CPU Usage Metric */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-sm text-gray-400 font-medium block">
                CPU Usage
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Status: <span className="text-orange-400">{getCpuStatus(performanceData.cpuUsage)}</span>
              </p>
            </div>
            <span className="text-sm font-semibold text-orange-400">
              {performanceData.cpuUsage.toFixed(1)}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(performanceData.cpuUsage, 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>100% (Max)</span>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-5 p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-2">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Performance Summary
          </p>
          
          {/* Overall Health */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Overall Health:</span>
            {performanceData.latency < 100 &&
            performanceData.cpuUsage < 50 &&
            performanceData.memoryUsage < 300 ? (
              <span className="text-xs text-green-400 font-semibold">
                ✓ Excellent
              </span>
            ) : performanceData.latency < 150 &&
              performanceData.cpuUsage < 70 &&
              performanceData.memoryUsage < 400 ? (
              <span className="text-xs text-cyan-400 font-semibold">
                ✓ Good
              </span>
            ) : (
              <span className="text-xs text-yellow-400 font-semibold">
                ⚠ Fair
              </span>
            )}
          </div>

          {/* Metrics Update Info */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Updated every 2 seconds
          </div>

          {/* Performance Tips */}
          <div className="text-xs text-gray-500 mt-2">
            💡 <strong>Tip:</strong> Monitor latency for RPC endpoint performance
          </div>
        </div>
      </div>
    </div>
  );
};
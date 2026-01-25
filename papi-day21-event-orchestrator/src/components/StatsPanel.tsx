// ============================================================================
// FILE: papi-event-orchestrator/src/components/StatsPanel.tsx
// PURPOSE: Real-time statistics and metrics display
// DAY: 18 - Performance Optimization & Metrics
// STATUS: FIXED - Accurate data calculation and display
// ============================================================================

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatsPanelProps {
  totalEvents: number;
  connectedChains: number;
  selectedChains: number;
  avgEventsPerSecond: number;
}

/**
 * StatsPanel Component
 * 
 * Displays real-time statistics about event processing and chain monitoring.
 * 
 * Week 3 Teaching Points:
 * - Performance metrics calculation
 * - Data formatting and display
 * - Real-time data updates
 * - Visual hierarchy with gradient cards
 * - Type-safe prop interface
 * 
 * Day 18: Performance Optimization - demonstrates metrics tracking
 * Day 19: Type Safety - uses TypeScript for prop validation
 */
export const StatsPanel: React.FC<StatsPanelProps> = ({
  totalEvents,
  connectedChains,
  selectedChains,
  avgEventsPerSecond,
}) => {
  /**
   * Calculate average events per chain
   * 
   * Metric: Shows how events are distributed across monitored chains
   * Formula: Total Events / Connected Chains
   */
  const eventsPerChain =
    connectedChains > 0 ? Math.floor(totalEvents / connectedChains) : 0;

  /**
   * Calculate active connection percentage
   * 
   * Metric: Shows what percentage of selected chains are connected
   */
  const connectionPercentage =
    selectedChains > 0 ? Math.floor((connectedChains / selectedChains) * 100) : 0;

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      {/* Panel Header */}
      <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-cyan-400" />
        <span>Statistics & Metrics</span>
      </h3>

      {/* Statistics Grid */}
      <div className="space-y-4">
        {/* Metric 1: Total Events - Primary counter */}
        <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Total Events
            </p>
            <span className="text-xs text-blue-400 font-mono">
              {totalEvents.toLocaleString()}
            </span>
          </div>
          <p className="text-3xl font-bold text-blue-300 mb-2">
            {totalEvents.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            Cumulative events processed from all chains
          </p>
          {/* Progress indication */}
          <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
              style={{
                width: `${Math.min((totalEvents / 1000) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Metric 2: Events Per Second - Throughput */}
        <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30 hover:border-green-500/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Events/Second
            </p>
            <span className="text-xs text-green-400 font-mono">
              {avgEventsPerSecond.toFixed(2)} EPS
            </span>
          </div>
          <p className="text-3xl font-bold text-green-300 mb-2">
            {avgEventsPerSecond.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            Average processing rate across selected chains
          </p>
          {/* Performance indicator */}
          <div className="mt-3 flex items-center gap-2">
            {avgEventsPerSecond < 2 && (
              <span className="text-xs text-yellow-400">⚠️ Low throughput</span>
            )}
            {avgEventsPerSecond >= 2 && avgEventsPerSecond < 5 && (
              <span className="text-xs text-green-400">✓ Good throughput</span>
            )}
            {avgEventsPerSecond >= 5 && (
              <span className="text-xs text-blue-400">⚡ Excellent throughput</span>
            )}
          </div>
        </div>

        {/* Metric 3: Connected Chains - Connection Status */}
        <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30 hover:border-yellow-500/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Connected Chains
            </p>
            <span className="text-xs text-yellow-400 font-mono">
              {connectedChains}/{selectedChains}
            </span>
          </div>
          <p className="text-3xl font-bold text-yellow-300 mb-2">
            {connectedChains}/{selectedChains}
          </p>
          <p className="text-xs text-gray-500">
            Active connections to selected chains
          </p>
          {/* Connection percentage bar */}
          <div className="mt-3 space-y-2">
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                style={{
                  width: `${connectionPercentage}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {connectionPercentage}% connection success rate
            </p>
          </div>
        </div>

        {/* Metric 4: Events Per Chain - Distribution */}
        <div className="p-4 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg border border-pink-500/30 hover:border-pink-500/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Events Per Chain
            </p>
            <span className="text-xs text-pink-400 font-mono">
              {eventsPerChain} avg
            </span>
          </div>
          <p className="text-3xl font-bold text-pink-300 mb-2">
            {eventsPerChain}
          </p>
          <p className="text-xs text-gray-500">
            Average event distribution across chains
          </p>
          {/* Distribution info */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-900/50 rounded">
              <p className="text-gray-500">Total Events</p>
              <p className="text-pink-300 font-semibold">
                {totalEvents}
              </p>
            </div>
            <div className="p-2 bg-gray-900/50 rounded">
              <p className="text-gray-500">Chains</p>
              <p className="text-pink-300 font-semibold">
                {connectedChains}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Info */}
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-2">📊 Session Summary:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>
              • Monitoring <span className="text-cyan-400">{selectedChains}</span> chains
            </li>
            <li>
              • <span className="text-green-400">{connectedChains}</span> chains actively connected
            </li>
            <li>
              • Processing ~<span className="text-yellow-400">{avgEventsPerSecond.toFixed(1)}</span> events/second
            </li>
            <li>
              • <span className="text-blue-400">{totalEvents}</span> total events in session
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
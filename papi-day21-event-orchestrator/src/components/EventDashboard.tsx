import React, { useEffect, useState } from 'react';
import { EventStream } from './EventStream';
import { EventFilter } from './EventFilter';
import { CHAINS, EVENT_TYPES } from '../data/chainConfig';
import { Activity, Filter, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface EventDashboardProps {
  isMonitoring: boolean;
  selectedChains: string[];
  totalEvents: number;
}

export const EventDashboard: React.FC<EventDashboardProps> = ({
  isMonitoring,
  selectedChains,
  totalEvents,
}) => {
  const [filteredEvents, setFilteredEvents] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [recentEvents, setRecentEvents] = useState<Array<{
    id: string;
    chain: string;
    type: string;
    timestamp: string;
    severity: string;
  }>>([]);

  useEffect(() => {
    if (!isMonitoring) return;

    // Simulate event generation
    const interval = setInterval(() => {
      const chain = selectedChains[Math.floor(Math.random() * selectedChains.length)];
      const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
      
      const newEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chain,
        type: eventType.name,
        timestamp: new Date().toISOString(),
        severity: eventType.severity,
      };

      setRecentEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring, selectedChains]);

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    console.log(`🔍 Applying filters: ${filters.join(', ') || 'none'}`);
    console.log(`📊 Filtered ${totalEvents} events`);
  };

  const getChainColor = (chainId: string) => {
    const chain = CHAINS.find(c => c.id === chainId);
    return chain?.color || '#6b7280';
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Real-time Event Dashboard</span>
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">{recentEvents.length} recent events</span>
          </div>
          <div className={`w-3 h-3 rounded-full animate-pulse ${isMonitoring ? 'bg-success-500' : 'bg-gray-500'}`}></div>
        </div>
      </div>

      {/* Event Filters */}
      <div className="mb-6">
        <EventFilter
          eventTypes={EVENT_TYPES}
          selectedFilters={activeFilters}
          onChange={handleFilterChange}
        />
      </div>

      {/* Chain Status */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-gray-400">Active Chains</h3>
        <div className="flex flex-wrap gap-3">
          {selectedChains.map((chainId) => {
            const chain = CHAINS.find(c => c.id === chainId);
            return (
              <div
                key={chainId}
                className="px-4 py-2 rounded-lg flex items-center space-x-2 animate-chain-glow"
                style={{
                  backgroundColor: `${chain?.color}20`,
                  border: `1px solid ${chain?.color}40`,
                  color: chain?.color,
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chain?.color }}></div>
                <span className="font-medium">{chain?.name}</span>
                {isMonitoring && (
                  <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Stream */}
      <EventStream events={recentEvents} />

      {/* Week 3 Features Summary */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <h3 className="font-semibold mb-4">Week 3 Features in Action</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-warning-500" />
              <h4 className="font-medium">Error Handling (Day 17)</h4>
            </div>
            <p className="text-sm text-gray-400">
              Graceful error recovery with user notifications and retry logic
            </p>
          </div>
          
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-5 h-5 text-primary-500" />
              <h4 className="font-medium">Performance (Day 18)</h4>
            </div>
            <p className="text-sm text-gray-400">
              Optimized bundle size with dynamic imports and lazy loading
            </p>
          </div>
          
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <Filter className="w-5 h-5 text-success-500" />
              <h4 className="font-medium">Type Safety (Day 19)</h4>
            </div>
            <p className="text-sm text-gray-400">
              Full TypeScript support with auto-generated types from chain metadata
            </p>
          </div>
          
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="font-medium">Compatibility (Day 20)</h4>
            </div>
            <p className="text-sm text-gray-400">
              Automatic compatibility checks for runtime upgrades
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
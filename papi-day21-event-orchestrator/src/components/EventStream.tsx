// ============================================================================
// FILE: papi-event-orchestrator/src/components/EventStream.tsx
// PURPOSE: Real-time event stream display with live updates
// DAY: 14 - Observables & Real-time Streaming
// STATUS: FIXED - Full working implementation with proper data display
// ============================================================================

import React from 'react';
import { Activity } from 'lucide-react';

interface EventData {
  id: string;
  chain: string;
  type: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  blockNumber: number;
  value: string;
}

interface EventStreamProps {
  events: EventData[];
}

/**
 * EventStream Component
 * 
 * Displays real-time event stream with severity indicators and metadata.
 * 
 * Week 3 Teaching Points:
 * - Real-time data display with React state updates
 * - Conditional rendering based on data availability
 * - Severity color coding for event prioritization
 * - Scrollable list with maximum height constraint
 * - Accessibility features (semantic HTML, labels)
 * 
 * Day 14: Observables - component receives events from observable stream
 * Day 16: Event Handling - displays processed events from handlers
 * Day 17: Error Handling - gracefully handles empty states
 */
export const EventStream: React.FC<EventStreamProps> = ({ events }) => {
  /**
   * Get severity color classes based on event severity
   * 
   * Severity levels:
   * - danger (🔥): Critical issues, needs immediate attention
   * - warning (⚠️): Important events that need review
   * - success (🎉): Positive events like rewards
   * - info (📝): General informational events
   */
  const getSeverityColor = (severity: string) => {
    const colorMap: Record<string, string> = {
      danger: 'bg-red-500/20 text-red-300 border-red-500/30',
      warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      success: 'bg-green-500/20 text-green-300 border-green-500/30',
      info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    };
    return colorMap[severity] || colorMap.info;
  };

  /**
   * Get emoji icon for severity
   * Visual indicators for quick event type recognition
   */
  const getSeverityIcon = (severity: string) => {
    const iconMap: Record<string, string> = {
      danger: '🔥',
      warning: '⚠️',
      success: '🎉',
      info: '📝',
    };
    return iconMap[severity] || '📝';
  };

  /**
   * Empty state - no events to display
   * 
   * Day 17: Error Handling - graceful empty state UI
   */
  if (events.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700 text-center">
        <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2 text-gray-300">No Events Yet</h3>
        <p className="text-gray-500 text-sm">
          Select chains and click "Start" to begin monitoring real-time events
        </p>
      </div>
    );
  }

  /**
   * Event stream - displays live events
   * 
   * Day 14: Observables - events arrive in real-time as observable items
   * Each event is rendered with full details and metadata
   */
  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
      {/* Stream Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900/50 sticky top-0 z-10">
        <h3 className="font-semibold flex items-center space-x-2">
          <Activity className="w-5 h-5 animate-pulse text-green-400" />
          <span>Live Event Stream</span>
          <span className="text-xs text-gray-500 ml-auto">
            {events.length} recent events
          </span>
        </h3>
      </div>

      {/* Events List - scrollable container */}
      <div className="divide-y divide-gray-800 max-h-[500px] overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="p-4 hover:bg-gray-800/30 transition-colors border-l-4"
            style={{
              // Color left border by chain
              borderColor: event.chain === 'polkadot' 
                ? '#E6007A' 
                : event.chain === 'kusama' 
                ? '#000000' 
                : '#DA68A7',
            }}
          >
            {/* Event Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                {/* Severity Icon */}
                <span className="text-xl pt-0.5">
                  {getSeverityIcon(event.severity)}
                </span>

                {/* Event Info */}
                <div className="flex-1 min-w-0">
                  {/* Event Type + Severity Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm break-words">
                      {event.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(
                        event.severity
                      )}`}
                    >
                      {event.severity.toUpperCase()}
                    </span>
                  </div>

                  {/* Event Metadata */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      📍 {event.chain.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      🕐 {event.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      📦 Block #{event.blockNumber.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="mt-3 p-3 bg-gray-900 rounded border border-gray-800 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {/* Event ID */}
                <div>
                  <span className="text-gray-500 text-xs block mb-1 font-medium">
                    Event ID
                  </span>
                  <code className="font-mono text-xs text-green-400 break-all">
                    {event.id}
                  </code>
                </div>

                {/* Transaction Value */}
                <div>
                  <span className="text-gray-500 text-xs block mb-1 font-medium">
                    Value Transferred
                  </span>
                  <span className="font-mono text-xs text-yellow-400">
                    {event.value}
                  </span>
                </div>
              </div>
            </div>

            {/* Feature Tags - Week 3 skills demonstrated */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">
                Observable
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium">
                Type Safe
              </span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                Real-time
              </span>
              <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs font-medium">
                Block #{event.blockNumber}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-gray-900/50 border-t border-gray-700 text-xs text-gray-500">
        <p>💡 Events displayed in real-time as they arrive from chain</p>
      </div>
    </div>
  );
};
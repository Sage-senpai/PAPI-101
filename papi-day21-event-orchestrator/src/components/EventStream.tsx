import React from 'react';
import { Activity, ExternalLink, Clock, Hash } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  chain: string;
  type: string;
  timestamp: string;
  severity: string;
}

interface EventStreamProps {
  events: Event[];
}

export const EventStream: React.FC<EventStreamProps> = ({ events }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'danger': return 'bg-danger-500/20 text-danger-300 border-danger-500/30';
      case 'warning': return 'bg-warning-500/20 text-warning-300 border-warning-500/30';
      case 'success': return 'bg-success-500/20 text-success-300 border-success-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'danger': return '🔥';
      case 'warning': return '⚠️';
      case 'success': return '🎉';
      default: return '📝';
    }
  };

  if (events.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700 text-center">
        <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Events Yet</h3>
        <p className="text-gray-500">Start monitoring to see real-time events from selected chains</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700 bg-gray-900/50">
        <h3 className="font-semibold flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Live Event Stream</span>
        </h3>
      </div>
      
      <div className="divide-y divide-gray-800 max-h-[400px] overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`p-4 hover:bg-gray-800/30 transition-colors animate-slide-in-up`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getSeverityIcon(event.severity)}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{event.type}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                    <div className="flex items-center space-x-1">
                      <Hash className="w-3 h-3" />
                      <span>{event.chain}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{format(new Date(event.timestamp), 'HH:mm:ss')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="p-1 hover:bg-gray-800 rounded">
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="mt-3 p-3 bg-gray-900/50 rounded border border-gray-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Event ID:</span>
                <code className="font-mono text-xs">{event.id}</code>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Simulated event data for Week 3 demonstration
              </div>
            </div>
            
            {/* Week 3 Feature Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded text-xs">
                Observable Stream
              </span>
              <span className="px-2 py-0.5 bg-success-500/20 text-success-300 rounded text-xs">
                Type Safe
              </span>
              <span className="px-2 py-0.5 bg-warning-500/20 text-warning-300 rounded text-xs">
                Error Handled
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
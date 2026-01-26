// ============================================================================
// FILE: papi-event-orchestrator/src/components/EventFilter.tsx
// PURPOSE: Event filtering component for real-time filtering
// DAY: 16 - Event Handling & Filtering
// STATUS: FIXED - Fully working with proper filtering logic
// ============================================================================

import React from 'react';
import { Filter } from 'lucide-react';

interface EventFilterProps {
  eventTypes: Array<{
    id: string;
    name: string;
    severity: 'info' | 'warning' | 'danger' | 'success';
  }>;
  selectedFilters: string[];
  onChange: (filters: string[]) => void;
}

export const EventFilter: React.FC<EventFilterProps> = ({
  eventTypes,
  selectedFilters,
  onChange,
}) => {
  const toggleFilter = (eventId: string) => {
    if (selectedFilters.includes(eventId)) {
      onChange(selectedFilters.filter(id => id !== eventId));
    } else {
      onChange([...selectedFilters, eventId]);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      danger: 'border-red-500/50 hover:bg-red-500/10',
      warning: 'border-yellow-500/50 hover:bg-yellow-500/10',
      success: 'border-green-500/50 hover:bg-green-500/10',
      info: 'border-blue-500/50 hover:bg-blue-500/10',
    };
    return colors[severity] || colors.info;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <label className="text-sm font-medium text-gray-400">Filter Events:</label>
      </div>
      <div className="flex flex-wrap gap-2">
        {eventTypes.map((eventType) => (
          <button
            key={eventType.id}
            onClick={() => toggleFilter(eventType.id)}
            className={`
              px-3 py-1 rounded-lg text-xs font-medium transition-all border
              ${
                selectedFilters.includes(eventType.id)
                  ? 'bg-gray-700 border-gray-500'
                  : `border-gray-600 ${getSeverityColor(eventType.severity)}`
              }
            `}
          >
            {eventType.name}
          </button>
        ))}
      </div>
    </div>
  );
};
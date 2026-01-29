import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { ChainConstant, FilterState } from "../types/constants";
import { Search, ChevronDown } from 'lucide-react';

interface SearchFilterProps {
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  constants: ChainConstant[];
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filterState,
  onFilterChange,
  constants,
}) => {
  const categories = Array.from(new Set(constants.map(c => c.category)));
  const importances = Array.from(new Set(constants.map(c => c.importance)));
  const chains = Array.from(new Set(constants.map(c => c.chain)));

  const handleChange =
    (field: keyof FilterState) =>
    (value: string) => {
      // Convert "all" back to null for filtering
      const filterValue = value === "all" ? null : value;
      onFilterChange({ ...filterState, [field]: filterValue });
    };

  return (
    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search constants..."
            value={filterState.search ?? ""}
            onChange={(e) => handleChange("search")(e.target.value || "all")}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 bg-gray-900 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Category Select */}
        <Select.Root 
          value={filterState.category || "all"} 
          onValueChange={handleChange("category")}
        >
          <Select.Trigger className="min-w-[140px] rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all flex items-center justify-between gap-2">
            <Select.Value placeholder="Category" />
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="overflow-hidden rounded-lg bg-gray-900 border border-gray-700 shadow-2xl z-50">
              <Select.Viewport className="p-1">
                <Select.Item
                  value="all"
                  className="px-4 py-2.5 text-sm text-white cursor-pointer hover:bg-gray-800 rounded-md outline-none transition-colors"
                >
                  <Select.ItemText>All Categories</Select.ItemText>
                </Select.Item>
                {categories.map(cat => (
                  <Select.Item
                    key={cat}
                    value={cat}
                    className="px-4 py-2.5 text-sm text-white cursor-pointer hover:bg-gray-800 rounded-md outline-none transition-colors"
                  >
                    <Select.ItemText className="capitalize">{cat}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {/* Importance Select */}
        <Select.Root 
          value={filterState.importance || "all"} 
          onValueChange={handleChange("importance")}
        >
          <Select.Trigger className="min-w-[140px] rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all flex items-center justify-between gap-2">
            <Select.Value placeholder="Importance" />
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="overflow-hidden rounded-lg bg-gray-900 border border-gray-700 shadow-2xl z-50">
              <Select.Viewport className="p-1">
                <Select.Item
                  value="all"
                  className="px-4 py-2.5 text-sm text-white cursor-pointer hover:bg-gray-800 rounded-md outline-none transition-colors"
                >
                  <Select.ItemText>All Levels</Select.ItemText>
                </Select.Item>
                {importances.map(imp => (
                  <Select.Item
                    key={imp}
                    value={imp}
                    className="px-4 py-2.5 text-sm text-white cursor-pointer hover:bg-gray-800 rounded-md outline-none transition-colors"
                  >
                    <Select.ItemText className="capitalize">{imp}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {/* Chain Select */}
        <Select.Root 
          value={filterState.chain || "all"} 
          onValueChange={handleChange("chain")}
        >
          <Select.Trigger className="min-w-[140px] rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all flex items-center justify-between gap-2">
            <Select.Value placeholder="Chain" />
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="overflow-hidden rounded-lg bg-gray-900 border border-gray-700 shadow-2xl z-50">
              <Select.Viewport className="p-1">
                <Select.Item
                  value="all"
                  className="px-4 py-2.5 text-sm text-white cursor-pointer hover:bg-gray-800 rounded-md outline-none transition-colors"
                >
                  <Select.ItemText>All Chains</Select.ItemText>
                </Select.Item>
                {chains.map(ch => (
                  <Select.Item
                    key={ch}
                    value={ch}
                    className="px-4 py-2.5 text-sm text-white cursor-pointer hover:bg-gray-800 rounded-md outline-none transition-colors"
                  >
                    <Select.ItemText className="capitalize">{ch}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
};
import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { ChainConstant, FilterState } from "../types/constants";

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
    (value: string | null) => {
      onFilterChange({ ...filterState, [field]: value });
    };

  return (
    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search constants..."
        value={filterState.search ?? ""}
        onChange={(e) => handleChange("search")(e.target.value)}
        className="flex-1 rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Category Select */}
      <Select.Root onValueChange={handleChange("category")}>
        <Select.Trigger className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white">
          <Select.Value placeholder="Category" />
        </Select.Trigger>
        <Select.Content className="rounded-md bg-gray-900 border border-gray-700">
          {categories.map(cat => (
            <Select.Item
              key={cat}
              value={cat}
              className="px-3 py-2 text-sm text-white cursor-pointer hover:bg-gray-800"
            >
              <Select.ItemText>{cat}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* Importance Select */}
      <Select.Root onValueChange={handleChange("importance")}>
        <Select.Trigger className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white">
          <Select.Value placeholder="Importance" />
        </Select.Trigger>
        <Select.Content className="rounded-md bg-gray-900 border border-gray-700">
          {importances.map(imp => (
            <Select.Item
              key={imp}
              value={imp}
              className="px-3 py-2 text-sm text-white cursor-pointer hover:bg-gray-800"
            >
              <Select.ItemText>{imp}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* Chain Select */}
      <Select.Root onValueChange={handleChange("chain")}>
        <Select.Trigger className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white">
          <Select.Value placeholder="Chain" />
        </Select.Trigger>
        <Select.Content className="rounded-md bg-gray-900 border border-gray-700">
          {chains.map(ch => (
            <Select.Item
              key={ch}
              value={ch}
              className="px-3 py-2 text-sm text-white cursor-pointer hover:bg-gray-800"
            >
              <Select.ItemText>{ch}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
};

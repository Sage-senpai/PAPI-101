import { useMemo } from 'react';
import { ChainConstant, FilterState } from '../types/constants';
export const useConstantsFilter = (
  constants: ChainConstant[],
  filterState: FilterState
): ChainConstant[] => {
  return useMemo(() => {
    console.log('🔍 Applying filters:', filterState);
    return constants.filter(constant => {
      if (filterState.search) {
        const searchLower = filterState.search.toLowerCase();
        const matchesSearch =
          constant.name.toLowerCase().includes(searchLower) ||
          constant.pallet.toLowerCase().includes(searchLower) ||
          constant.description.toLowerCase().includes(searchLower) ||
          constant.documentation.some(doc => doc.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }
      if (filterState.category && constant.category !== filterState.category) {
        return false;
      }
      if (filterState.importance && constant.importance !== filterState.importance) {
        return false;
      }
      if (filterState.chain && constant.chain !== filterState.chain) {
        return false;
      }
      return true;
    });
  }, [constants, filterState]);
};
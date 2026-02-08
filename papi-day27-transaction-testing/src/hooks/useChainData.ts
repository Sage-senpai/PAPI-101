export interface BalanceHookResult {
  data: bigint | null;
  isLoading: boolean;
  error: string | null;
}

export function useBalance(_address: string): BalanceHookResult {
  // This is a mock implementation for testing purposes
  // In a real app, this would use PAPI to fetch balance
  // The _address parameter is prefixed with underscore to indicate it's intentionally unused in mock
  return {
    data: 25000000000n,
    isLoading: false,
    error: null,
  };
}
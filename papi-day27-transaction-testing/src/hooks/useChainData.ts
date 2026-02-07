export interface BalanceHookResult {
  data: bigint | null;
  isLoading: boolean;
  error: string | null;
}

export function useBalance(address: string): BalanceHookResult {
  // This is a mock implementation for testing purposes
  // In a real app, this would use PAPI to fetch balance
  return {
    data: 25000000000n,
    isLoading: false,
    error: null,
  };
}
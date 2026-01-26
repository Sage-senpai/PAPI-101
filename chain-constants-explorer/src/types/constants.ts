export interface ChainConstant {
  id: string;
  pallet: string;
  name: string;
  value: any;
  type: string;
  description: string;
  documentation: string[];
  chain: 'polkadot' | 'kusama' | 'westend';
  category: 'system' | 'balances' | 'staking' | 'governance' | 'other';
  importance: 'high' | 'medium' | 'low';
}
export interface ChainInfo {
  name: string;
  version: string;
  specVersion: number;
  tokenSymbol: string;
  tokenDecimals: number;
  color: string;
  rpcEndpoint: string;
}
export interface FilterState {
  search: string;
  category: string | null;
  importance: string | null;
  chain: string | null;
}
// src/types/wallet.ts
export interface WalletAccount {
  address: string;
  meta: {
    name: string;
    source: string;
    genesisHash?: string | null;
  };
  type?: 'ed25519' | 'sr25519' | 'ecdsa';
  publicKey?: Uint8Array;
}

export interface AccountBalance {
  address: string;
  free: bigint;
  reserved: bigint;
  frozen: bigint;
  total: bigint;
  formatted: string;
  timestamp: Date;
}

export interface NetworkInfo {
  name: string;
  ss58Format: number;
  token: string;
  tokenDecimals: number;
  isConnected: boolean;
  genesisHash: string;
  specVersion: number;
}

export interface SigningRequest {
  id: string;
  method: string;
  params: any;
  status: 'pending' | 'approved' | 'rejected' | 'signed';
  createdAt: Date;
  signedAt?: Date;
  txHash?: string;
}

export interface ExtensionState {
  isAvailable: boolean;
  isConnected: boolean;
  accounts: WalletAccount[];
  selectedAccount: WalletAccount | null;
  network: NetworkInfo | null;
  permissions: {
    canSign: boolean;
    canSignRaw: boolean;
    canGetAccounts: boolean;
  };
  error: string | null;
}

export interface SecurityCheck {
  level: 'low' | 'medium' | 'high' | 'maximum';
  checks: {
    extensionInstalled: boolean;
    httpsConnection: boolean;
    knownNetwork: boolean;
    accountPermissions: boolean;
    transactionValidation: boolean;
  };
  warnings: string[];
  recommendations: string[];
}
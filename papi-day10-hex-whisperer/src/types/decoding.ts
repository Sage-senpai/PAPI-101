//src/types/decoding.ts
export interface DecodedTransaction {
  pallet: string;
  method: string;
  args: Record<string, any>;
  callData: string;
  decodedAt: Date;
  isValid: boolean;
  error?: string;
  metadata?: {
    palletIndex: number;
    callIndex: number;
    bytes: number;
    version: number;
  };
}

export interface ByteAnalysis {
  position: number;
  byte: string;
  meaning: string;
  color: string;
  highlight: boolean;
}

export interface ExampleTransaction {
  id: string;
  name: string;
  hex: string;
  description: string;
  category: 'balances' | 'staking' | 'utility' | 'governance' | 'assets';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface DecodingState {
  isDecoding: boolean;
  error: string | null;
  decoded: DecodedTransaction | null;
  history: DecodedTransaction[];
  bytesAnalysis: ByteAnalysis[];
}
// src/utils/byteParser.ts
// ==========================================
import type { ByteAnalysis } from '../types/decoding';

export const analyzeBytes = (hex: string): ByteAnalysis[] => {
  const bytes: ByteAnalysis[] = [];
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  
  for (let i = 0; i < cleanHex.length; i += 2) {
    const position = i / 2;
    const byte = cleanHex.slice(i, i + 2);
    const meaning = getByteMeaning(position, byte);
    
    bytes.push({
      position,
      byte,
      meaning,
      color: getByteColor(position),
      highlight: position < 2 || position % 16 === 0,
    });
  }
  
  return bytes;
};

const getByteMeaning = (position: number, byte: string): string => {
  if (position === 0) return `Pallet Index: 0x${byte} (${parseInt(byte, 16)})`;
  if (position === 1) return `Call Index: 0x${byte} (${parseInt(byte, 16)})`;
  if (position < 4) return 'Length Prefix';
  if (position < 8) return 'Parameter Data';
  
  const charCode = parseInt(byte, 16);
  if (charCode >= 32 && charCode <= 126) {
    return `Data: '${String.fromCharCode(charCode)}' (ASCII ${charCode})`;
  }
  
  return `Data: 0x${byte}`;
};

const getByteColor = (position: number): string => {
  if (position === 0) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  if (position === 1) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (position < 4) return 'bg-green-500/20 text-green-300 border-green-500/30';
  if (position < 8) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

export const decodeByte = (byte: string, context: 'pallet' | 'call' | 'data'): string => {
  const value = parseInt(byte, 16);
  
  switch (context) {
    case 'pallet':
      const pallets: Record<number, string> = {
        4: 'Balances',
        7: 'Staking',
        24: 'Utility',
        30: 'Multisig',
        50: 'Assets',
        12: 'Governance',
      };
      return pallets[value] || `Unknown Pallet (${value})`;
      
    case 'call':
      const balanceCalls: Record<number, string> = {
        0: 'transfer',
        1: 'set_balance',
        2: 'force_transfer',
        3: 'transfer_keep_alive',
        4: 'transfer_all',
      };
      return balanceCalls[value] || `Call #${value}`;
      
    case 'data':
      return `0x${byte} (${value})`;
  }
};

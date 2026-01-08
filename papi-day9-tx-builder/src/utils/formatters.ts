export const formatBalance = (value: bigint | number, decimals: number = 10): string => {
  const numValue = typeof value === 'bigint' ? Number(value) : value;
  const formatted = numValue / Math.pow(10, decimals);
  return formatted.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }) + ' DOT';
};

export const truncateAddress = (address: string, start: number = 6, end: number = 4): string => {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
};

export const formatHex = (hex: string, chunkSize: number = 32): string => {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const chunks = [];
  for (let i = 0; i < cleanHex.length; i += chunkSize) {
    chunks.push(cleanHex.slice(i, i + chunkSize));
  }
  return `0x${chunks.join(' ')}`;
};

export const calculateCallDataSize = (callData: string): string => {
  const bytes = (callData.length - 2) / 2;
  return `${bytes} bytes (${(bytes / 1024).toFixed(2)} KB)`;
};
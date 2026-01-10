// src/utils/hexUtils.ts
// ==========================================
export const isValidHex = (hex: string): boolean => {
  if (!hex) return false;
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  return /^[0-9a-fA-F]+$/.test(cleanHex) && cleanHex.length % 2 === 0;
};

export const formatHex = (hex: string, bytesPerLine: number = 16): string => {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const chunks = [];
  for (let i = 0; i < cleanHex.length; i += bytesPerLine * 2) {
    const chunk = cleanHex.slice(i, i + bytesPerLine * 2);
    const formattedChunk = chunk.match(/.{1,2}/g)?.join(' ') || '';
    chunks.push(`0x${chunk.padEnd(bytesPerLine * 2, ' ')}  ${formattedChunk}`);
  }
  return chunks.join('\n');
};

export const hexToBytes = (hex: string): Uint8Array => {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
};

export const bytesToHex = (bytes: Uint8Array): string => {
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
};

export const calculateHexSize = (hex: string): string => {
  const bytes = (hex.length - (hex.startsWith('0x') ? 2 : 0)) / 2;
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const extractCallIndices = (hex: string): { palletIndex: number; callIndex: number } | null => {
  if (!isValidHex(hex)) return null;
  const bytes = hexToBytes(hex);
  if (bytes.length < 2) return null;
  return { palletIndex: bytes[0], callIndex: bytes[1] };
};

export const truncateHex = (hex: string, maxLength: number = 32): string => {
  if (hex.length <= maxLength) return hex;
  const prefix = hex.slice(0, maxLength / 2);
  const suffix = hex.slice(-maxLength / 2);
  return `${prefix}...${suffix}`;
};

// src/utils/validators.ts
import { z } from 'zod';

export const addressValidator = z.string().regex(/^[0-9a-zA-Z]{47,48}$/, {
  message: 'Invalid SS58 address format'
});

export const amountValidator = z.string().regex(/^\d+(\.\d+)?$/, {
  message: 'Invalid amount format'
}).transform(val => {
  const num = parseFloat(val);
  if (isNaN(num)) throw new Error('Invalid number');
  if (num <= 0) throw new Error('Amount must be positive');
  return BigInt(Math.floor(num * Math.pow(10, 10))); // 10 decimals for DOT
});

export const callDataValidator = z.string().regex(/^0x[0-9a-fA-F]+$/, {
  message: 'Invalid hex format. Must start with 0x and contain only hex characters'
});
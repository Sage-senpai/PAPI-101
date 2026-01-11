// src/utils/cryptography.ts
import { cryptoWaitReady, encodeAddress, blake2AsHex } from '@polkadot/util-crypto';
import { u8aToHex, hexToU8a, stringToU8a } from '@polkadot/util';
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';
import { promisify } from 'util';
import { scrypt, randomBytes as randomBytesAsync } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const scryptAsync = promisify(scrypt);
const randomBytesAsync = promisify(randomBytes);

export class SecureCryptography {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly SALT_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly KEY_LENGTH = 32;
  private static readonly TAG_LENGTH = 16;

  static async init(): Promise<void> {
    await cryptoWaitReady();
    console.log('🔐 Cryptography system initialized');
  }

  static generateSecureRandom(length: number = 32): Uint8Array {
    return randomBytes(length);
  }

  static async deriveKey(password: string, salt: Uint8Array): Promise<Buffer> {
    const key = await scryptAsync(password, salt, this.KEY_LENGTH) as Buffer;
    return key;
  }

  static async encryptData(data: string, password: string): Promise<string> {
    const salt = this.generateSecureRandom(this.SALT_LENGTH);
    const iv = this.generateSecureRandom(this.IV_LENGTH);
    const key = await this.deriveKey(password, salt);
    
    const cipher = createCipheriv(this.ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    return JSON.stringify({
      encrypted: encrypted.toString('base64'),
      salt: u8aToHex(salt),
      iv: u8aToHex(iv),
      tag: tag.toString('base64')
    });
  }

  static async decryptData(encryptedData: string, password: string): Promise<string> {
    const { encrypted, salt, iv, tag } = JSON.parse(encryptedData);
    
    const key = await this.deriveKey(password, hexToU8a(salt));
    const decipher = createDecipheriv(
      this.ALGORITHM,
      key,
      hexToU8a(iv)
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'base64')),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  }

  static hashData(data: string): string {
    return blake2AsHex(data);
  }

  static generateKeyId(publicKey: Uint8Array): string {
    const hash = blake2AsHex(publicKey);
    return `key_${hash.substring(2, 14)}`;
  }

  static validateAddress(address: string): boolean {
    try {
      // Simple SS58 validation
      return address.length >= 47 && address.length <= 48 && 
             /^[0-9a-zA-Z]+$/.test(address);
    } catch {
      return false;
    }
  }

  static formatPublicKey(publicKey: Uint8Array): string {
    return u8aToHex(publicKey);
  }

  static parsePublicKey(hex: string): Uint8Array {
    return hexToU8a(hex);
  }
}

export class KeyValidator {
  static validatePrivateKey(key: string): { isValid: boolean; type?: string; error?: string } {
    try {
      // Check hex format
      if (!/^0x[0-9a-fA-F]+$/.test(key)) {
        return { isValid: false, error: 'Invalid hex format' };
      }

      const bytes = hexToU8a(key);
      
      // Check key length for different algorithms
      if (bytes.length === 32) {
        return { isValid: true, type: 'sr25519/ed25519' };
      } else if (bytes.length === 64) {
        return { isValid: true, type: 'ecdsa' };
      } else {
        return { isValid: false, error: 'Invalid key length' };
      }
    } catch (error) {
      return { isValid: false, error: 'Failed to parse key' };
    }
  }

  static validateMnemonic(mnemonic: string): boolean {
    // Basic mnemonic validation (12/24 words)
    const words = mnemonic.trim().split(/\s+/);
    return words.length === 12 || words.length === 24 || words.length === 15;
  }
}
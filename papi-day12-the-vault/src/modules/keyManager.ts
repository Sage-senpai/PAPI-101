// src/modules/KeyManager.ts
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { mnemonicGenerate } from '@polkadot/util-crypto';

export type KeyType = 'sr25519' | 'ed25519';

export interface KeyPairInfo {
  address: string;
  publicKey: Uint8Array;
  type: string;
}

/**
 * KeyManager handles secure key generation, storage, and retrieval
 */
export class KeyManager {
  private keyring: Keyring;
  private activeKeys: Map<string, KeyringPair>;

  constructor() {
    this.keyring = new Keyring({ type: 'sr25519' });
    this.activeKeys = new Map();
  }

  /**
   * Generate a new keypair with specified algorithm
   */
  async generateKeypair(type: KeyType = 'sr25519'): Promise<KeyringPair> {
    try {
      // Generate mnemonic
      const mnemonic = mnemonicGenerate();
      
      // Create keyring with specified type
      const keyring = new Keyring({ type });
      
      // Add from mnemonic
      const pair = keyring.addFromMnemonic(mnemonic);
      
      // Store in active keys
      this.activeKeys.set(pair.address, pair);
      
      console.log('Generated keypair:', {
        address: pair.address,
        type: pair.type,
        mnemonic: mnemonic
      });
      
      return pair;
    } catch (error) {
      console.error('Error generating keypair:', error);
      throw new Error('Failed to generate keypair');
    }
  }

  /**
   * Recover keypair from mnemonic
   */
  async recoverFromMnemonic(
    mnemonic: string,
    type: KeyType = 'sr25519'
  ): Promise<KeyringPair> {
    try {
      const keyring = new Keyring({ type });
      const pair = keyring.addFromMnemonic(mnemonic.trim());
      
      this.activeKeys.set(pair.address, pair);
      
      return pair;
    } catch (error) {
      console.error('Error recovering from mnemonic:', error);
      throw new Error('Failed to recover keypair from mnemonic');
    }
  }

  /**
   * Get keypair by address
   */
  getKeypair(address: string): KeyringPair | undefined {
    return this.activeKeys.get(address);
  }

  /**
   * Check if address exists in active keys
   */
  hasKeypair(address: string): boolean {
    return this.activeKeys.has(address);
  }

  /**
   * List all active addresses
   */
  listAddresses(): string[] {
    return Array.from(this.activeKeys.keys());
  }

  /**
   * Remove keypair from active keys
   */
  removeKeypair(address: string): boolean {
    return this.activeKeys.delete(address);
  }

  /**
   * Clear all active keys
   */
  clearAll(): void {
    this.activeKeys.clear();
  }

  /**
   * Get key info without exposing private key
   */
  getKeyInfo(address: string): KeyPairInfo | null {
    const pair = this.activeKeys.get(address);
    if (!pair) return null;

    return {
      address: pair.address,
      publicKey: pair.publicKey,
      type: pair.type
    };
  }
}
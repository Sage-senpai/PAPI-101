// src/modules/KeyManager.ts
import { Keyring } from '@polkadot/keyring';
import { mnemonicGenerate, mnemonicToMiniSecret, cryptoWaitReady } from '@polkadot/util-crypto';
import { u8aToHex, hexToU8a, stringToU8a } from '@polkadot/util';
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { SecureCryptography, KeyValidator } from '../utils/cryptography';
import type { KeyPair } from '../types/security';

export class SecureKeyManager {
  private keyring: Keyring;
  private keys: Map<string, KeyPair> = new Map();
  private storagePath: string;
  private encryptionSecret: string;

  constructor(storagePath: string = './secure-keys', encryptionSecret: string) {
    this.storagePath = storagePath;
    this.encryptionSecret = encryptionSecret;
    this.keyring = new Keyring({ type: 'sr25519' });
    
    this.ensureStorageDirectory();
  }

  private ensureStorageDirectory(): void {
    if (!existsSync(this.storagePath)) {
      mkdirSync(this.storagePath, { recursive: true });
      console.log(`📁 Created secure key storage at: ${this.storagePath}`);
    }
  }

  async initialize(): Promise<void> {
    await cryptoWaitReady();
    await this.loadStoredKeys();
    console.log(`✅ Key Manager initialized with ${this.keys.size} keys`);
  }

  private async loadStoredKeys(): Promise<void> {
    if (!existsSync(this.storagePath)) return;

    const files = readdirSync(this.storagePath).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      try {
        const filePath = join(this.storagePath, file);
        const encryptedData = readFileSync(filePath, 'utf8');
        const keyData = JSON.parse(await SecureCryptography.decryptData(
          encryptedData,
          this.encryptionSecret
        ));
        
        this.keys.set(keyData.id, {
          ...keyData,
          createdAt: new Date(keyData.createdAt),
          lastUsedAt: keyData.lastUsedAt ? new Date(keyData.lastUsedAt) : null
        });
        
        console.log(`🔑 Loaded key: ${keyData.name} (${keyData.address})`);
      } catch (error) {
        console.error(`❌ Failed to load key from ${file}:`, error);
      }
    }
  }

  private async saveKey(keyPair: KeyPair): Promise<void> {
    const filePath = join(this.storagePath, `${keyPair.id}.json`);
    const encryptedData = await SecureCryptography.encryptData(
      JSON.stringify({
        ...keyPair,
        createdAt: keyPair.createdAt.toISOString(),
        lastUsedAt: keyPair.lastUsedAt?.toISOString() || null
      }),
      this.encryptionSecret
    );
    
    writeFileSync(filePath, encryptedData, 'utf8');
  }

  async generateKeyPair(
    name: string,
    type: 'sr25519' | 'ed25519' = 'sr25519',
    securityLevel: 'low' | 'medium' | 'high' | 'maximum' = 'medium',
    tags: string[] = []
  ): Promise<KeyPair> {
    console.log(`🔐 Generating ${type} keypair: ${name}`);
    
    // Generate mnemonic
    const mnemonic = mnemonicGenerate(12);
    console.log(`📝 Generated mnemonic (SAVE SECURELY): ${mnemonic}`);
    
    // Create keypair from mnemonic
    const keyring = new Keyring({ type });
    const pair = keyring.addFromMnemonic(mnemonic, { name });
    
    const keyPair: KeyPair = {
      id: SecureCryptography.generateKeyId(pair.publicKey),
      name,
      address: pair.address,
      publicKey: u8aToHex(pair.publicKey),
      encryptedPrivateKey: await SecureCryptography.encryptData(
        u8aToHex(pair.secretKey || new Uint8Array()),
        this.encryptionSecret
      ),
      keyType: type,
      createdAt: new Date(),
      lastUsedAt: null,
      usageCount: 0,
      securityLevel,
      tags,
      metadata: {
        mnemonicGenerated: true,
        keyType: type,
        generatedAt: new Date().toISOString()
      }
    };
    
    this.keys.set(keyPair.id, keyPair);
    await this.saveKey(keyPair);
    
    console.log(`✅ Generated keypair: ${keyPair.address}`);
    console.log(`   ID: ${keyPair.id}`);
    console.log(`   Type: ${keyPair.keyType}`);
    console.log(`   Security: ${keyPair.securityLevel}`);
    
    return keyPair;
  }

  async importPrivateKey(
    privateKeyHex: string,
    name: string,
    type: 'sr25519' | 'ed25519' = 'sr25519',
    securityLevel: 'low' | 'medium' | 'high' | 'maximum' = 'medium'
  ): Promise<KeyPair> {
    console.log(`🔐 Importing ${type} keypair: ${name}`);
    
    const validation = KeyValidator.validatePrivateKey(privateKeyHex);
    if (!validation.isValid) {
      throw new Error(`Invalid private key: ${validation.error}`);
    }
    
    const keyring = new Keyring({ type });
    const pair = keyring.addFromSeed(hexToU8a(privateKeyHex), { name });
    
    const keyPair: KeyPair = {
      id: SecureCryptography.generateKeyId(pair.publicKey),
      name,
      address: pair.address,
      publicKey: u8aToHex(pair.publicKey),
      encryptedPrivateKey: await SecureCryptography.encryptData(
        privateKeyHex,
        this.encryptionSecret
      ),
      keyType: type,
      createdAt: new Date(),
      lastUsedAt: null,
      usageCount: 0,
      securityLevel,
      tags: ['imported'],
      metadata: {
        importedAt: new Date().toISOString(),
        keyType: type
      }
    };
    
    this.keys.set(keyPair.id, keyPair);
    await this.saveKey(keyPair);
    
    console.log(`✅ Imported keypair: ${keyPair.address}`);
    return keyPair;
  }

  async getKeyPair(keyId: string): Promise<KeyPair | null> {
    return this.keys.get(keyId) || null;
  }

  async getKeyPairByAddress(address: string): Promise<KeyPair | null> {
    for (const key of this.keys.values()) {
      if (key.address === address) {
        return key;
      }
    }
    return null;
  }

  async listKeyPairs(): Promise<KeyPair[]> {
    return Array.from(this.keys.values()).sort((a, b) => 
      a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  async updateKeyUsage(keyId: string): Promise<void> {
    const keyPair = this.keys.get(keyId);
    if (keyPair) {
      keyPair.lastUsedAt = new Date();
      keyPair.usageCount++;
      await this.saveKey(keyPair);
    }
  }

  async rotateKey(keyId: string): Promise<KeyPair> {
    const oldKey = this.keys.get(keyId);
    if (!oldKey) {
      throw new Error(`Key not found: ${keyId}`);
    }
    
    console.log(`🔄 Rotating key: ${oldKey.name}`);
    
    // Generate new key
    const newKey = await this.generateKeyPair(
      `${oldKey.name} (rotated)`,
      oldKey.keyType,
      oldKey.securityLevel,
      [...oldKey.tags, 'rotated']
    );
    
    // Mark old key as rotated
    oldKey.tags.push('rotated');
    oldKey.metadata = {
      ...oldKey.metadata,
      rotatedAt: new Date().toISOString(),
      rotatedTo: newKey.id
    };
    
    await this.saveKey(oldKey);
    
    console.log(`✅ Key rotated: ${oldKey.address} → ${newKey.address}`);
    return newKey;
  }

  async deleteKey(keyId: string): Promise<boolean> {
    const keyPair = this.keys.get(keyId);
    if (!keyPair) return false;
    
    const filePath = join(this.storagePath, `${keyId}.json`);
    if (existsSync(filePath)) {
      // Secure deletion: overwrite with random data before deleting
      const randomData = SecureCryptography.generateSecureRandom(1024);
      writeFileSync(filePath, randomData);
    }
    
    this.keys.delete(keyId);
    
    if (existsSync(filePath)) {
      require('fs').unlinkSync(filePath);
    }
    
    console.log(`🗑️  Deleted key: ${keyPair.name} (${keyPair.address})`);
    return true;
  }

  async exportPublicKeys(): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    
    for (const [id, key] of this.keys) {
      result[id] = {
        name: key.name,
        address: key.address,
        publicKey: key.publicKey,
        keyType: key.keyType,
        securityLevel: key.securityLevel,
        createdAt: key.createdAt.toISOString()
      } as any;
    }
    
    return result;
  }

  getStats(): {
    totalKeys: number;
    byType: Record<string, number>;
    bySecurity: Record<string, number>;
    totalUsage: number;
  } {
    const stats = {
      totalKeys: this.keys.size,
      byType: {} as Record<string, number>,
      bySecurity: {} as Record<string, number>,
      totalUsage: 0
    };
    
    for (const key of this.keys.values()) {
      stats.byType[key.keyType] = (stats.byType[key.keyType] || 0) + 1;
      stats.bySecurity[key.securityLevel] = (stats.bySecurity[key.securityLevel] || 0) + 1;
      stats.totalUsage += key.usageCount;
    }
    
    return stats;
  }
}
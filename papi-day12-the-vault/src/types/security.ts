// src/types/security.ts
export interface SecurityConfig {
  nodeEnv: 'development' | 'production' | 'test';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  keyStoragePath: string;
  keyEncryptionSecret: string;
  keyRotationDays: number;
  maxSigningAttempts: number;
  sessionTimeoutMinutes: number;
  require2FA: boolean;
  auditLogPath: string;
  enableTamperProof: boolean;
}

export interface KeyPair {
  id: string;
  name: string;
  address: string;
  publicKey: string;
  encryptedPrivateKey: string;
  keyType: 'sr25519' | 'ed25519' | 'ecdsa';
  createdAt: Date;
  lastUsedAt: Date | null;
  usageCount: number;
  securityLevel: 'low' | 'medium' | 'high' | 'maximum';
  tags: string[];
  metadata?: Record<string, any>;
}

export interface SignedTransaction {
  id: string;
  transactionHash: string;
  signedData: string;
  signature: string;
  signerAddress: string;
  signedAt: Date;
  network: string;
  nonce: number;
  status: 'signed' | 'broadcasted' | 'confirmed' | 'failed';
  broadcastedAt?: Date;
  confirmedAt?: Date;
  blockHash?: string;
  error?: string;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: 'key_generated' | 'key_rotated' | 'transaction_signed' | 
          'access_granted' | 'access_revoked' | 'security_alert';
  userId?: string;
  keyId?: string;
  transactionId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface SigningRequest {
  transaction: any;
  signerAddress: string;
  network: string;
  options?: {
    nonce?: number;
    tip?: bigint;
    era?: number;
    blockHash?: string;
    metadata?: any;
  };
}

export interface SecurityAlert {
  id: string;
  type: 'multiple_failures' | 'unusual_activity' | 'key_compromise' |
        'rate_limit_exceeded' | 'tamper_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}
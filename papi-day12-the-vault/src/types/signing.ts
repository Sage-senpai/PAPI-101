// src/types/signing.ts
import type { KeyringPair } from '@polkadot/keyring/types';

export interface Signer {
  sign(payload: Uint8Array): Promise<Uint8Array>;
  signAsync?(payload: Uint8Array): Promise<Uint8Array>;
  address: string;
  publicKey: Uint8Array;
  type: string;
}

export interface SigningResult {
  signed: Uint8Array;
  signature: string;
  signerAddress: string;
  timestamp: Date;
}

export interface AirGappedSigningRequest {
  unsignedTransaction: string;
  signerPublicKey: string;
  network: string;
  metadata?: {
    nonce: number;
    tip: string;
    era: number;
    blockHash: string;
  };
}

export interface AirGappedSigningResponse {
  signedTransaction: string;
  signature: string;
  signerAddress: string;
  signedAt: Date;
}

export interface MultiSigRequest {
  transaction: any;
  signers: string[];
  threshold: number;
  network: string;
}

export interface MultiSigResult {
  signedTransaction: string;
  signatures: string[];
  signerAddresses: string[];
  signedAt: Date;
}
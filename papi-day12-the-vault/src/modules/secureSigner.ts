// src/modules/secureSigner.ts  
import { Keyring } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';

export interface TransactionData {
  from: string;
  to: string;
  amount: string;
  timestamp: string;
}

export interface SigningResult {
  signature: string;
  publicKey: string;
  isValid: boolean;
}

/**
 * SecureSigner handles transaction signing with security best practices
 */
export class SecureSigner {
  private keyring: Keyring;

  constructor() {
    this.keyring = new Keyring({ type: 'sr25519' });
  }

  /**
   * Sign transaction data
   */
  async signTransaction(
    address: string,
    txData: TransactionData
  ): Promise<SigningResult> {
    try {
      // Create deterministic message from transaction data
      const message = this.createSignableMessage(txData);
      
      // Get keypair (in real app, this would be from secure storage)
      const pair = this.keyring.getPair(address);
      
      if (!pair) {
        throw new Error(`No keypair found for address: ${address}`);
      }

      // Sign the message
      const signature = pair.sign(message);
      const signatureHex = u8aToHex(signature);

      // Verify signature
      const { isValid } = signatureVerify(message, signature, pair.publicKey);

      console.log('Transaction signed:', {
        address,
        signature: signatureHex,
        isValid
      });

      return {
        signature: signatureHex,
        publicKey: u8aToHex(pair.publicKey),
        isValid
      };
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw new Error('Failed to sign transaction');
    }
  }

  /**
   * Create a signable message from transaction data
   */
  private createSignableMessage(txData: TransactionData): string {
    return JSON.stringify({
      from: txData.from,
      to: txData.to,
      amount: txData.amount,
      timestamp: txData.timestamp
    });
  }

  /**
   * Verify a signature
   */
  async verifySignature(
    message: string,
    signature: string,
    publicKey: string
  ): Promise<boolean> {
    try {
      const result = signatureVerify(message, signature, publicKey);
      return result.isValid;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }
}
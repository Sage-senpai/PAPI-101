// src/modules/secureSigner.ts  
import { Keyring } from '@polkadot/keyring';
import { u8aToHex, hexToU8a, stringToU8a } from '@polkadot/util';
import { cryptoWaitReady, signatureVerify } from '@polkadot/util-crypto';
import { createClient, TypedApi } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider';
import { dot } from '@polkadot-api/descriptors';
import { SecureKeyManager } from './keyManager';
import { TransactionValidator } from '../utils/validators';
import { AuditLogger } from './auditLogger';
import type { 
  SigningRequest, 
  SignedTransaction,
  Signer,
  AirGappedSigningRequest,
  AirGappedSigningResponse 
} from '../types';

export class SecureTransactionSigner {
  private keyManager: SecureKeyManager;
  private auditLogger: AuditLogger;
  private clients: Map<string, TypedApi<typeof dot>> = new Map();

  constructor(keyManager: SecureKeyManager, auditLogger: AuditLogger) {
    this.keyManager = keyManager;
    this.auditLogger = auditLogger;
  }

  async initialize(): Promise<void> {
    await cryptoWaitReady();
    console.log('✅ Secure Transaction Signer initialized');
  }

  private async getClient(network: string): Promise<TypedApi<typeof dot>> {
    if (this.clients.has(network)) {
      return this.clients.get(network)!;
    }

    let rpcUrl: string;
    switch (network.toLowerCase()) {
      case 'polkadot':
        rpcUrl = process.env.POLKADOT_RPC_URL || 'wss://rpc.polkadot.io';
        break;
      case 'kusama':
        rpcUrl = process.env.KUSAMA_RPC_URL || 'wss://kusama-rpc.polkadot.io';
        break;
      case 'westend':
        rpcUrl = process.env.WESTEND_RPC_URL || 'wss://westend-rpc.polkadot.io';
        break;
      default:
        throw new Error(`Unsupported network: ${network}`);
    }

    console.log(`🌐 Connecting to ${network}: ${rpcUrl}`);
    
    try {
      const client = createClient(getWsProvider(rpcUrl));
      const api = client.getTypedApi(dot);
      
      this.clients.set(network, api);
      console.log(`✅ Connected to ${network}`);
      
      return api;
    } catch (error) {
      console.error(`❌ Failed to connect to ${network}:`, error);
      throw new Error(`Failed to connect to network: ${network}`);
    }
  }

  async signTransaction(request: SigningRequest): Promise<SignedTransaction> {
    const startTime = Date.now();
    console.log(`🔐 Starting transaction signing for ${request.signerAddress}`);
    
    try {
      // Get the key pair
      const keyPair = await this.keyManager.getKeyPairByAddress(request.signerAddress);
      if (!keyPair) {
        throw new Error(`No key pair found for address: ${request.signerAddress}`);
      }

      // Get network client
      const api = await this.getClient(request.network);
      
      // Build the transaction
      console.log(`🏗️ Building transaction: ${request.transaction.pallet}.${request.transaction.method}`);
      
      const tx = (api.tx as any)[request.transaction.pallet]?.[request.transaction.method]?.(request.transaction.args);
      if (!tx) {
        throw new Error(`Transaction method ${request.transaction.pallet}.${request.transaction.method} not found`);
      }

      // Get account nonce if not provided
      const nonce = request.options?.nonce ?? await api.query.System.Account.getValue(
        request.signerAddress, 
        { at: 'best' }
      ).then(account => account.nonce);

      // Prepare signing options
      const signingOptions = {
        nonce,
        tip: request.options?.tip ?? BigInt(0),
        era: request.options?.era ?? 0,
        blockHash: request.options?.blockHash ?? (await api.query.System.Header.getValue({ at: 'best' })).hash
      };

      console.log(`📝 Signing options:`, {
        nonce: Number(nonce),
        tip: signingOptions.tip.toString(),
        era: signingOptions.era,
        blockHash: signingOptions.blockHash.substring(0, 32) + '...'
      });

      // Create signer from key pair
      const keyring = new Keyring({ type: keyPair.keyType });
      const pair = keyring.addFromSeed(
        hexToU8a(await this.keyManager.getKeyPair(keyPair.id)!.then(k => k!.encryptedPrivateKey)),
        { name: keyPair.name }
      );

      // Sign the transaction
      console.log(`✍️ Signing transaction...`);
      const signedTx = await tx.signAsync(pair.address, {
        nonce,
        tip: signingOptions.tip,
        era: signingOptions.era,
        blockHash: signingOptions.blockHash,
        signer: {
          sign: async (payload: Uint8Array) => {
            return pair.sign(payload);
          }
        }
      });

      const signedData = signedTx.encodedCallData.toString();
      const transactionHash = TransactionValidator.calculateTransactionHash(hexToU8a(signedData));

      const result: SignedTransaction = {
        id: `tx_${transactionHash.substring(2, 14)}`,
        transactionHash,
        signedData,
        signature: u8aToHex(signedTx.signature),
        signerAddress: request.signerAddress,
        signedAt: new Date(),
        network: request.network,
        nonce: Number(nonce),
        status: 'signed'
      };

      // Update key usage
      await this.keyManager.updateKeyUsage(keyPair.id);

      // Log audit
      await this.auditLogger.logSigning({
        keyId: keyPair.id,
        transactionId: result.id,
        network: request.network,
        details: {
          pallet: request.transaction.pallet,
          method: request.transaction.method,
          nonce: Number(nonce),
          tip: signingOptions.tip.toString(),
          signingTime: Date.now() - startTime
        }
      });

      console.log(`✅ Transaction signed successfully!`);
      console.log(`   Hash: ${transactionHash}`);
      console.log(`   Signer: ${request.signerAddress}`);
      console.log(`   Nonce: ${nonce}`);
      console.log(`   Size: ${signedData.length / 2} bytes`);
      console.log(`   Time: ${Date.now() - startTime}ms`);

      return result;

    } catch (error) {
      console.error(`❌ Transaction signing failed:`, error);
      
      await this.auditLogger.logSecurityAlert({
        type: 'signing_failed',
        severity: 'high',
        message: `Transaction signing failed for ${request.signerAddress}`,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          transaction: request.transaction,
          network: request.network
        }
      });

      throw error;
    }
  }

  async signAirGapped(request: AirGappedSigningRequest): Promise<AirGappedSigningResponse> {
    console.log(`🛡️ Starting air-gapped signing for ${request.signerPublicKey.substring(0, 16)}...`);
    
    try {
      // In a real air-gapped system, this would be done on an offline machine
      // For demo purposes, we'll simulate the offline signing process
      
      const unsignedTx = hexToU8a(request.unsignedTransaction);
      
      // Find key by public key
      const keyPairs = await this.keyManager.listKeyPairs();
      const keyPair = keyPairs.find(k => 
        k.publicKey.toLowerCase() === request.signerPublicKey.toLowerCase()
      );
      
      if (!keyPair) {
        throw new Error(`No key pair found for public key: ${request.signerPublicKey.substring(0, 16)}...`);
      }

      // Create keyring and sign
      const keyring = new Keyring({ type: keyPair.keyType });
      const pair = keyring.addFromSeed(
        hexToU8a(await this.keyManager.getKeyPair(keyPair.id)!.then(k => k!.encryptedPrivateKey)),
        { name: keyPair.name }
      );

      console.log(`🔒 Signing in air-gapped mode...`);
      const signature = pair.sign(unsignedTx);
      
      // Verify signature
      const isValid = signatureVerify(unsignedTx, signature, hexToU8a(request.signerPublicKey)).isValid;
      if (!isValid) {
        throw new Error('Signature verification failed');
      }

      const result: AirGappedSigningResponse = {
        signedTransaction: u8aToHex(unsignedTx),
        signature: u8aToHex(signature),
        signerAddress: pair.address,
        signedAt: new Date()
      };

      await this.keyManager.updateKeyUsage(keyPair.id);

      console.log(`✅ Air-gapped signing successful!`);
      console.log(`   Signer: ${pair.address}`);
      console.log(`   Signature: ${result.signature.substring(0, 32)}...`);
      console.log(`   Verified: ${isValid}`);

      return result;

    } catch (error) {
      console.error(`❌ Air-gapped signing failed:`, error);
      throw error;
    }
  }

  async verifySignature(
    signedTransaction: string,
    signature: string,
    publicKey: string
  ): Promise<boolean> {
    try {
      const isValid = signatureVerify(
        hexToU8a(signedTransaction),
        hexToU8a(signature),
        hexToU8a(publicKey)
      ).isValid;

      console.log(`🔍 Signature verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      return isValid;
    } catch (error) {
      console.error(`❌ Signature verification failed:`, error);
      return false;
    }
  }

  async broadcastTransaction(signedTransaction: SignedTransaction): Promise<SignedTransaction> {
    console.log(`📡 Broadcasting transaction: ${signedTransaction.transactionHash}`);
    
    try {
      const api = await this.getClient(signedTransaction.network);
      const txHex = signedTransaction.signedData;
      
      // Submit the transaction
      const result = await api.txFromCallData(hexToU8a(txHex)).submit();
      
      signedTransaction.status = 'broadcasted';
      signedTransaction.broadcastedAt = new Date();
      
      console.log(`✅ Transaction broadcasted!`);
      console.log(`   Hash: ${signedTransaction.transactionHash}`);
      console.log(`   Status: Broadcasted`);
      
      return signedTransaction;
    } catch (error) {
      console.error(`❌ Transaction broadcast failed:`, error);
      
      signedTransaction.status = 'failed';
      signedTransaction.error = error instanceof Error ? error.message : 'Unknown error';
      
      return signedTransaction;
    }
  }

  async getSigningStatus(transactionId: string): Promise<Partial<SignedTransaction>> {
    // This would query the blockchain for transaction status
    // For now, return a mock status
    return {
      id: transactionId,
      status: 'signed',
      signedAt: new Date()
    };
  }
}
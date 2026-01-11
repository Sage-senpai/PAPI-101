//src/examples/basicSigning.ts
import chalk from 'chalk';
import ora from 'ora';
import { SecureKeyManager } from '../modules/keyManager';
import { SecureTransactionSigner } from '../modules/secureSigner';
import { AuditLogger } from '../modules/auditLogger';

export async function exampleSigningFlow(): Promise<void> {
  console.log(chalk.cyan('\n🔐 Basic Transaction Signing Flow\n'));
  
  const spinner = ora('Initializing The Vault...').start();
  
  try {
    // Initialize components
    const keyManager = new SecureKeyManager(
      './secure-keys-demo',
      'demo-secret-change-in-production'
    );
    
    const auditLogger = new AuditLogger('./audit-logs-demo');
    const signer = new SecureTransactionSigner(keyManager, auditLogger);
    
    await keyManager.initialize();
    await signer.initialize();
    
    spinner.succeed('The Vault initialized');
    
    // Step 1: Generate a test key pair
    console.log(chalk.yellow('\n📝 Step 1: Generating test key pair'));
    const keyGenSpinner = ora('Generating SR25519 key pair...').start();
    const keyPair = await keyManager.generateKeyPair(
      'Demo Key',
      'sr25519',
      'high',
      ['demo', 'test']
    );
    keyGenSpinner.succeed(`Key pair generated: ${keyPair.address}`);
    
    // Step 2: List keys
    console.log(chalk.yellow('\n📋 Step 2: Listing available keys'));
    const keys = await keyManager.listKeyPairs();
    console.log(chalk.gray(`  Found ${keys.length} key pair(s)`));
    keys.forEach(key => {
      console.log(chalk.gray(`  • ${key.name}: ${key.address} (${key.keyType})`));
    });
    
    // Step 3: Sign a transaction
    console.log(chalk.yellow('\n✍️  Step 3: Signing a transaction'));
    const signSpinner = ora('Building and signing transaction...').start();
    
    const signingRequest = {
      transaction: {
        pallet: 'Balances',
        method: 'transfer_keep_alive',
        args: {
          dest: { Id: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty' },
          value: BigInt(1000000000) // 0.1 DOT
        }
      },
      signerAddress: keyPair.address,
      network: 'westend',
      options: {
        tip: BigInt(100000000) // 0.01 DOT
      }
    };
    
    const signedTx = await signer.signTransaction(signingRequest);
    signSpinner.succeed('Transaction signed successfully!');
    
    // Display results
    console.log(chalk.green('\n✅ Transaction Details:'));
    console.log(chalk.gray(`  ID: ${signedTx.id}`));
    console.log(chalk.gray(`  Hash: ${signedTx.transactionHash}`));
    console.log(chalk.gray(`  Signer: ${signedTx.signerAddress}`));
    console.log(chalk.gray(`  Nonce: ${signedTx.nonce}`));
    console.log(chalk.gray(`  Status: ${signedTx.status}`));
    console.log(chalk.gray(`  Signed at: ${signedTx.signedAt.toLocaleString()}`));
    
    // Step 4: Verify signature
    console.log(chalk.yellow('\n🔍 Step 4: Verifying signature'));
    const verifySpinner = ora('Verifying transaction signature...').start();
    const isValid = await signer.verifySignature(
      signedTx.signedData,
      signedTx.signature,
      keyPair.publicKey
    );
    
    if (isValid) {
      verifySpinner.succeed('Signature verified successfully!');
    } else {
      verifySpinner.fail('Signature verification failed');
    }
    
    // Step 5: Show statistics
    console.log(chalk.yellow('\n📊 Step 5: System Statistics'));
    const stats = keyManager.getStats();
    console.log(chalk.gray(`  Total keys: ${stats.totalKeys}`));
    console.log(chalk.gray(`  Key types: ${JSON.stringify(stats.byType)}`));
    console.log(chalk.gray(`  Security levels: ${JSON.stringify(stats.bySecurity)}`));
    console.log(chalk.gray(`  Total signing operations: ${stats.totalUsage}`));
    
    console.log(chalk.green('\n🎉 Basic signing flow completed successfully!'));
    
  } catch (error) {
    spinner.fail('Basic signing flow failed');
    console.error(chalk.red(error));
    throw error;
  }
}
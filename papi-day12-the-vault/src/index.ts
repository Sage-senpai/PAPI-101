#!/usr/bin/env node
// src/index.ts
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { SecureKeyManager } from './modules/KeyManager';
import { SecureTransactionSigner } from './modules/secureSigner';
import { AuditLogger } from './modules/auditLogger';
import { SecurityMonitor } from './modules/securityMonitor';
import { exampleSigningFlow } from './examples/basicSigning';
import { airgappedDemo } from './examples/airgappedDemo';
import { multiSigDemo } from './examples/multiSigDemo';

// ASCII Art Banner
const banner = boxen(
  chalk.bold.cyan(`
██████╗  █████╗ ██████╗ ██╗    ███████╗████████╗██╗  ██╗███████╗
██╔══██╗██╔══██╗██╔══██╗██║    ██╔════╝╚══██╔══╝██║  ██║██╔════╝
██████╔╝███████║██████╔╝██║    ███████╗   ██║   ███████║█████╗  
██╔═══╝ ██╔══██║██╔═══╝ ██║    ╚════██║   ██║   ██╔══██║██╔══╝  
██║     ██║  ██║██║     ██║    ███████║   ██║   ██║  ██║███████╗
╚═╝     ╚═╝  ╚═╝╚═╝     ╚═╝    ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
  `) + '\n' + chalk.gray('Secure Private Key Signing with PAPI • Day 12 • #PAPI30Days'),
  {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan'
  }
);

console.log(banner);

// Initialize environment
require('dotenv').config();

const argv = yargs(hideBin(process.argv))
  .command('init', 'Initialize The Vault', {}, async () => {
    const spinner = ora('Initializing The Vault...').start();
    
    try {
      const keyManager = new SecureKeyManager(
        process.env.KEY_STORAGE_PATH || './secure-keys',
        process.env.KEY_ENCRYPTION_SECRET || 'default-secret-change-me'
      );
      
      await keyManager.initialize();
      
      const auditLogger = new AuditLogger(
        process.env.AUDIT_LOG_PATH || './audit-logs'
      );
      
      spinner.succeed('The Vault initialized successfully!');
      
      console.log(chalk.green('\n🔐 Security Status:'));
      console.log(chalk.gray('  • Key storage: ') + chalk.green('Secure'));
      console.log(chalk.gray('  • Audit logging: ') + chalk.green('Active'));
      console.log(chalk.gray('  • Environment: ') + chalk.green(process.env.NODE_ENV || 'development'));
      
    } catch (error) {
      spinner.fail('Failed to initialize The Vault');
      console.error(chalk.red(error));
      process.exit(1);
    }
  })
  
  .command('generate', 'Generate a new key pair', {
    name: {
      alias: 'n',
      type: 'string',
      demandOption: true,
      description: 'Name for the key pair'
    },
    type: {
      alias: 't',
      type: 'string',
      choices: ['sr25519', 'ed25519'],
      default: 'sr25519',
      description: 'Key type'
    },
    security: {
      alias: 's',
      type: 'string',
      choices: ['low', 'medium', 'high', 'maximum'],
      default: 'medium',
      description: 'Security level'
    }
  }, async (argv) => {
    const spinner = ora(`Generating ${argv.type} key pair: ${argv.name}`).start();
    
    try {
      const keyManager = new SecureKeyManager(
        process.env.KEY_STORAGE_PATH || './secure-keys',
        process.env.KEY_ENCRYPTION_SECRET || 'default-secret-change-me'
      );
      
      await keyManager.initialize();
      const keyPair = await keyManager.generateKeyPair(
        argv.name,
        argv.type,
        argv.security as any
      );
      
      spinner.succeed(`Key pair generated successfully!`);
      
      console.log(chalk.cyan('\n📋 Key Details:'));
      console.log(chalk.gray('  ID: ') + chalk.white(keyPair.id));
      console.log(chalk.gray('  Name: ') + chalk.white(keyPair.name));
      console.log(chalk.gray('  Address: ') + chalk.green(keyPair.address));
      console.log(chalk.gray('  Public Key: ') + chalk.yellow(keyPair.publicKey.substring(0, 32) + '...'));
      console.log(chalk.gray('  Type: ') + chalk.blue(keyPair.keyType));
      console.log(chalk.gray('  Security: ') + chalk[keyPair.securityLevel === 'maximum' ? 'red' : 'yellow'](keyPair.securityLevel));
      console.log(chalk.gray('  Created: ') + chalk.white(keyPair.createdAt.toLocaleString()));
      
      console.log(chalk.yellow('\n⚠️  IMPORTANT: Save your mnemonic phrase securely!'));
      console.log(chalk.gray('   The private key is encrypted and stored locally.'));
      
    } catch (error) {
      spinner.fail('Failed to generate key pair');
      console.error(chalk.red(error));
      process.exit(1);
    }
  })
  
  .command('list', 'List all key pairs', {}, async () => {
    const spinner = ora('Loading key pairs...').start();
    
    try {
      const keyManager = new SecureKeyManager(
        process.env.KEY_STORAGE_PATH || './secure-keys',
        process.env.KEY_ENCRYPTION_SECRET || 'default-secret-change-me'
      );
      
      await keyManager.initialize();
      const keys = await keyManager.listKeyPairs();
      const stats = keyManager.getStats();
      
      spinner.succeed(`Found ${keys.length} key pair(s)`);
      
      console.log(chalk.cyan('\n🔑 Key Pairs:'));
      keys.forEach((key, index) => {
        console.log(chalk.gray(`\n  ${index + 1}. ${key.name}`));
        console.log(chalk.gray('     ID: ') + chalk.white(key.id));
        console.log(chalk.gray('     Address: ') + chalk.green(key.address));
        console.log(chalk.gray('     Type: ') + chalk.blue(key.keyType));
        console.log(chalk.gray('     Security: ') + chalk[key.securityLevel === 'maximum' ? 'red' : 'yellow'](key.securityLevel));
        console.log(chalk.gray('     Usage: ') + chalk.white(`${key.usageCount} times`));
        console.log(chalk.gray('     Last used: ') + chalk.white(key.lastUsedAt ? key.lastUsedAt.toLocaleString() : 'Never'));
      });
      
      console.log(chalk.cyan('\n📊 Statistics:'));
      console.log(chalk.gray('  Total keys: ') + chalk.white(stats.totalKeys));
      console.log(chalk.gray('  By type:'));
      Object.entries(stats.byType).forEach(([type, count]) => {
        console.log(chalk.gray(`    • ${type}: `) + chalk.white(count));
      });
      console.log(chalk.gray('  Total usage: ') + chalk.white(stats.totalUsage));
      
    } catch (error) {
      spinner.fail('Failed to list key pairs');
      console.error(chalk.red(error));
      process.exit(1);
    }
  })
  
  .command('sign', 'Sign a transaction', {
    address: {
      alias: 'a',
      type: 'string',
      demandOption: true,
      description: 'Signer address'
    },
    network: {
      alias: 'n',
      type: 'string',
      choices: ['polkadot', 'kusama', 'westend'],
      default: 'polkadot',
      description: 'Network'
    },
    amount: {
      type: 'string',
      default: '0.001',
      description: 'Amount to transfer (in DOT/KSM/WND)'
    },
    to: {
      type: 'string',
      default: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      description: 'Recipient address'
    }
  }, async (argv) => {
    const spinner = ora('Preparing transaction signing...').start();
    
    try {
      const keyManager = new SecureKeyManager(
        process.env.KEY_STORAGE_PATH || './secure-keys',
        process.env.KEY_ENCRYPTION_SECRET || 'default-secret-change-me'
      );
      
      const auditLogger = new AuditLogger(
        process.env.AUDIT_LOG_PATH || './audit-logs'
      );
      
      await keyManager.initialize();
      
      const signer = new SecureTransactionSigner(keyManager, auditLogger);
      await signer.initialize();
      
      spinner.text = 'Building transaction...';
      
      // Convert amount to planck (10 decimals for DOT/WND, 12 for KSM)
      const decimals = argv.network === 'kusama' ? 12 : 10;
      const amountInPlanck = BigInt(Math.floor(parseFloat(argv.amount) * Math.pow(10, decimals)));
      
      const signingRequest = {
        transaction: {
          pallet: 'Balances',
          method: 'transfer_keep_alive',
          args: {
            dest: { Id: argv.to },
            value: amountInPlanck
          }
        },
        signerAddress: argv.address,
        network: argv.network,
        options: {
          tip: BigInt(1000000000) // 0.1 DOT in planck
        }
      };
      
      spinner.text = 'Signing transaction...';
      const signedTx = await signer.signTransaction(signingRequest);
      
      spinner.succeed('Transaction signed successfully!');
      
      console.log(chalk.green('\n✅ Signed Transaction:'));
      console.log(chalk.gray('  ID: ') + chalk.white(signedTx.id));
      console.log(chalk.gray('  Hash: ') + chalk.cyan(signedTx.transactionHash));
      console.log(chalk.gray('  Signer: ') + chalk.green(signedTx.signerAddress));
      console.log(chalk.gray('  Network: ') + chalk.blue(argv.network));
      console.log(chalk.gray('  Nonce: ') + chalk.white(signedTx.nonce));
      console.log(chalk.gray('  Status: ') + chalk.yellow(signedTx.status));
      console.log(chalk.gray('  Signed at: ') + chalk.white(signedTx.signedAt.toLocaleString()));
      console.log(chalk.gray('  Size: ') + chalk.white(`${signedTx.signedData.length / 2} bytes`));
      
      // Ask if user wants to broadcast
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question(chalk.yellow('\n📡 Broadcast transaction? (y/N): '), async (answer) => {
        if (answer.toLowerCase() === 'y') {
          const broadcastSpinner = ora('Broadcasting transaction...').start();
          try {
            const broadcasted = await signer.broadcastTransaction(signedTx);
            broadcastSpinner.succeed('Transaction broadcasted!');
            
            console.log(chalk.green('\n🌐 Transaction submitted to network'));
            console.log(chalk.gray('  Broadcasted at: ') + chalk.white(broadcasted.broadcastedAt?.toLocaleString()));
            console.log(chalk.gray('  Status: ') + chalk.green(broadcasted.status));
            
            if (broadcasted.error) {
              console.log(chalk.red('  Error: ') + broadcasted.error);
            }
          } catch (error) {
            broadcastSpinner.fail('Failed to broadcast transaction');
            console.error(chalk.red(error));
          }
        } else {
          console.log(chalk.gray('\nTransaction saved locally. Use --broadcast flag to send later.'));
        }
        
        readline.close();
        process.exit(0);
      });
      
    } catch (error) {
      spinner.fail('Transaction signing failed');
      console.error(chalk.red(error));
      process.exit(1);
    }
  })
  
  .command('demo', 'Run demonstration flows', {
    flow: {
      alias: 'f',
      type: 'string',
      choices: ['basic', 'airgapped', 'multisig', 'all'],
      default: 'all',
      description: 'Demo flow to run'
    }
  }, async (argv) => {
    console.log(chalk.cyan('\n🚀 Running PAPI The Vault Demonstrations\n'));
    
    try {
      switch (argv.flow) {
        case 'basic':
          await exampleSigningFlow();
          break;
        case 'airgapped':
          await airgappedDemo();
          break;
        case 'multisig':
          await multiSigDemo();
          break;
        case 'all':
          console.log(chalk.yellow('=== Basic Signing Flow ==='));
          await exampleSigningFlow();
          
          console.log(chalk.yellow('\n=== Air-Gapped Signing Demo ==='));
          await airgappedDemo();
          
          console.log(chalk.yellow('\n=== Multi-Signature Demo ==='));
          await multiSigDemo();
          break;
      }
      
      console.log(chalk.green('\n✅ All demonstrations completed successfully!'));
      
    } catch (error) {
      console.error(chalk.red('❌ Demonstration failed:'), error);
      process.exit(1);
    }
  })
  
  .command('audit', 'View audit logs', {
    days: {
      alias: 'd',
      type: 'number',
      default: 1,
      description: 'Number of days to view'
    },
    severity: {
      alias: 's',
      type: 'string',
      choices: ['all', 'info', 'warning', 'error', 'critical'],
      default: 'all',
      description: 'Filter by severity'
    }
  }, async (argv) => {
    const spinner = ora('Loading audit logs...').start();
    
    try {
      const auditLogger = new AuditLogger(
        process.env.AUDIT_LOG_PATH || './audit-logs'
      );
      
      const logs = await auditLogger.getLogs(argv.days, argv.severity as any);
      
      spinner.succeed(`Found ${logs.length} audit log(s)`);
      
      console.log(chalk.cyan('\n📋 Audit Logs:'));
      
      logs.forEach((log, index) => {
        const severityColor = {
          info: 'gray',
          warning: 'yellow',
          error: 'red',
          critical: 'redBright'
        }[log.severity];
        
        console.log(chalk[severityColor as 'gray'](`\n  ${index + 1}. [${log.timestamp.toLocaleString()}] ${log.action}`));
        console.log(chalk.gray('     Severity: ') + chalk[severityColor as 'gray'](log.severity));
        
        if (log.keyId) {
          console.log(chalk.gray('     Key ID: ') + chalk.white(log.keyId));
        }
        
        if (log.transactionId) {
          console.log(chalk.gray('     Transaction: ') + chalk.cyan(log.transactionId));
        }
        
        if (log.details) {
          console.log(chalk.gray('     Details: ') + chalk.white(JSON.stringify(log.details, null, 2).split('\n').join('\n       ')));
        }
      });
      
    } catch (error) {
      spinner.fail('Failed to load audit logs');
      console.error(chalk.red(error));
      process.exit(1);
    }
  })
  
  .command('security', 'Check security status', {}, async () => {
    const spinner = ora('Running security check...').start();
    
    try {
      const securityMonitor = new SecurityMonitor();
      await securityMonitor.initialize();
      
      const status = await securityMonitor.getSecurityStatus();
      
      spinner.succeed('Security check completed');
      
      console.log(chalk.cyan('\n🛡️  Security Status:'));
      console.log(chalk.gray('  Overall: ') + chalk[status.overall === 'secure' ? 'green' : 'red'](status.overall));
      
      console.log(chalk.gray('\n  Checks:'));
      status.checks.forEach((check, index) => {
        const icon = check.passed ? '✅' : '❌';
        const color = check.passed ? 'green' : 'red';
        console.log(chalk[color](`    ${icon} ${check.name}`));
        if (!check.passed && check.message) {
          console.log(chalk.gray(`      ${check.message}`));
        }
      });
      
      if (status.warnings.length > 0) {
        console.log(chalk.yellow('\n  ⚠️  Warnings:'));
        status.warnings.forEach(warning => {
          console.log(chalk.yellow(`    • ${warning}`));
        });
      }
      
      if (status.recommendations.length > 0) {
        console.log(chalk.blue('\n  💡 Recommendations:'));
        status.recommendations.forEach(rec => {
          console.log(chalk.blue(`    • ${rec}`));
        });
      }
      
      console.log(chalk.gray('\n  Last checked: ') + chalk.white(status.lastChecked.toLocaleString()));
      
    } catch (error) {
      spinner.fail('Security check failed');
      console.error(chalk.red(error));
      process.exit(1);
    }
  })
  
  .help()
  .alias('help', 'h')
  .demandCommand(1, 'You need to specify a command')
  .parse();
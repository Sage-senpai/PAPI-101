// src/App.tsx
import { useState, useEffect } from 'react';
import { KeyManager } from './modules/keyManager';
import { SecureSigner } from './modules/secureSigner';
import { AuditLogger } from './modules/AuditLogger';

interface KeyPairInfo {
  address: string;
  type: string;
  publicKey: string;
}

interface SigningResult {
  signature: string;
  timestamp: string;
  address: string;
}

interface AuditLog {
  timestamp: string;
  level: string;
  action: string;
  details: string;
}

function App() {
  const [keyManager] = useState(() => new KeyManager());
  const [secureSigner] = useState(() => new SecureSigner());
  const [auditLogger] = useState(() => new AuditLogger());
  const [activeTab, setActiveTab] = useState<'generate' | 'sign' | 'audit'>('generate');
  
  // Key generation states
  const [keyType, setKeyType] = useState<'sr25519' | 'ed25519'>('sr25519');
  const [mnemonic, setMnemonic] = useState('');
  const [generatedKey, setGeneratedKey] = useState<KeyPairInfo | null>(null);
  
  // Signing states
  const [signingAddress, setSigningAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [signingResult, setSigningResult] = useState<SigningResult | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  
  // Audit states
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  // Load audit logs
  useEffect(() => {
    const logs = auditLogger.getRecentLogs(20);
    setAuditLogs(logs);
  }, [auditLogger, signingResult, generatedKey]);

  const handleGenerateKey = async () => {
    try {
      const keypair = await keyManager.generateKeypair(keyType);
      const keyInfo: KeyPairInfo = {
        address: keypair.address,
        type: keypair.type,
        publicKey: Array.from(keypair.publicKey).map(b => b.toString(16).padStart(2, '0')).join('')
      };
      
      setGeneratedKey(keyInfo);
      setSigningAddress(keypair.address);
      
      auditLogger.logAction('key_generated', 'info', {
        address: keypair.address,
        type: keyType
      });
    } catch (error) {
      console.error('Key generation failed:', error);
      auditLogger.logAction('key_generation_failed', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleGenerateFromMnemonic = async () => {
    if (!mnemonic.trim()) {
      alert('Please enter a mnemonic phrase');
      return;
    }
    
    try {
      const keypair = await keyManager.recoverFromMnemonic(mnemonic, keyType);
      const keyInfo: KeyPairInfo = {
        address: keypair.address,
        type: keypair.type,
        publicKey: Array.from(keypair.publicKey).map(b => b.toString(16).padStart(2, '0')).join('')
      };
      
      setGeneratedKey(keyInfo);
      setSigningAddress(keypair.address);
      
      auditLogger.logAction('key_recovered', 'info', {
        address: keypair.address,
        type: keyType
      });
    } catch (error) {
      console.error('Key recovery failed:', error);
      alert('Failed to recover key from mnemonic');
      auditLogger.logAction('key_recovery_failed', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleSignTransaction = async () => {
    if (!recipient || !amount) {
      alert('Please fill in all fields');
      return;
    }

    if (!signingAddress) {
      alert('Please generate or load a key first');
      return;
    }

    setIsSigning(true);
    try {
      // Create a mock transaction for demonstration
      const txData = {
        from: signingAddress,
        to: recipient,
        amount: amount,
        timestamp: new Date().toISOString()
      };

      // In a real implementation, this would sign an actual transaction
      const result = await secureSigner.signTransaction(signingAddress, txData);
      
      setSigningResult({
        signature: result.signature,
        timestamp: new Date().toISOString(),
        address: signingAddress
      });

      auditLogger.logAction('transaction_signed', 'info', {
        from: signingAddress,
        to: recipient,
        amount: amount
      });
    } catch (error) {
      console.error('Signing failed:', error);
      alert('Transaction signing failed');
      auditLogger.logAction('signing_failed', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSigning(false);
    }
  };

  const clearSigningResult = () => {
    setSigningResult(null);
    setRecipient('');
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/40 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🔐</div>
              <div>
                <h1 className="text-2xl font-bold text-white">PAPI The Vault</h1>
                <p className="text-sm text-purple-300">Secure Private Key Signing</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-purple-400">Day 12/30</div>
              <div className="text-sm font-semibold text-white">#PAPI30Days</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-black/40 backdrop-blur-lg rounded-lg p-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'text-purple-300 hover:bg-purple-900/20'
            }`}
          >
            🔑 Generate Keys
          </button>
          <button
            onClick={() => setActiveTab('sign')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'sign'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'text-purple-300 hover:bg-purple-900/20'
            }`}
          >
            ✍️ Sign Transaction
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'text-purple-300 hover:bg-purple-900/20'
            }`}
          >
            📋 Audit Logs
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Generate Keys Tab */}
          {activeTab === 'generate' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Generate New Key */}
              <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <h2 className="text-xl font-bold text-white mb-4">Generate New Keypair</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Key Type
                    </label>
                    <select
                      value={keyType}
                      onChange={(e) => setKeyType(e.target.value as 'sr25519' | 'ed25519')}
                      className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="sr25519">SR25519 (Recommended)</option>
                      <option value="ed25519">ED25519</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateKey}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    Generate Random Keypair
                  </button>
                </div>
              </div>

              {/* Recover from Mnemonic */}
              <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <h2 className="text-xl font-bold text-white mb-4">Recover from Mnemonic</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Mnemonic Phrase (12/24 words)
                    </label>
                    <textarea
                      value={mnemonic}
                      onChange={(e) => setMnemonic(e.target.value)}
                      placeholder="word1 word2 word3 ..."
                      className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateFromMnemonic}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    Recover Keypair
                  </button>
                </div>
              </div>

              {/* Generated Key Display */}
              {generatedKey && (
                <div className="md:col-span-2 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
                  <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                    ✅ Key Generated Successfully
                  </h2>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-1">Address</label>
                      <div className="bg-black/40 rounded-lg p-3 text-white font-mono text-sm break-all">
                        {generatedKey.address}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-1">Type</label>
                      <div className="bg-black/40 rounded-lg p-3 text-white font-mono text-sm">
                        {generatedKey.type.toUpperCase()}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-1">Public Key</label>
                      <div className="bg-black/40 rounded-lg p-3 text-white font-mono text-xs break-all">
                        0x{generatedKey.publicKey}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sign Transaction Tab */}
          {activeTab === 'sign' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <h2 className="text-xl font-bold text-white mb-4">Sign Transaction</h2>
                
                {!signingAddress ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔑</div>
                    <p className="text-purple-300 mb-4">Please generate or load a key first</p>
                    <button
                      onClick={() => setActiveTab('generate')}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg"
                    >
                      Go to Key Generation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Signing Address
                      </label>
                      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white font-mono text-sm break-all">
                        {signingAddress}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Recipient Address
                      </label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
                        className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Amount (DOT)
                      </label>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="1.5"
                        className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <button
                      onClick={handleSignTransaction}
                      disabled={isSigning}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:transform-none disabled:cursor-not-allowed"
                    >
                      {isSigning ? 'Signing...' : '✍️ Sign Transaction'}
                    </button>
                  </div>
                )}
              </div>

              {/* Signing Result */}
              {signingResult && (
                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
                      ✅ Transaction Signed
                    </h2>
                    <button
                      onClick={clearSigningResult}
                      className="text-green-300 hover:text-green-400"
                    >
                      Clear
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-1">Signature</label>
                      <div className="bg-black/40 rounded-lg p-3 text-white font-mono text-xs break-all">
                        {signingResult.signature}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-green-300 mb-1">Timestamp</label>
                        <div className="bg-black/40 rounded-lg p-3 text-white text-sm">
                          {new Date(signingResult.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-green-300 mb-1">Address</label>
                        <div className="bg-black/40 rounded-lg p-3 text-white font-mono text-xs truncate">
                          {signingResult.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && (
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4">Audit Trail</h2>
              
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-purple-300">
                  No audit logs yet. Start by generating keys or signing transactions.
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {auditLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        log.level === 'error'
                          ? 'bg-red-900/20 border-red-500/30'
                          : log.level === 'warning'
                          ? 'bg-yellow-900/20 border-yellow-500/30'
                          : 'bg-purple-900/20 border-purple-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              log.level === 'error'
                                ? 'bg-red-500 text-white'
                                : log.level === 'warning'
                                ? 'bg-yellow-500 text-black'
                                : 'bg-purple-500 text-white'
                            }`}>
                              {log.level.toUpperCase()}
                            </span>
                            <span className="text-sm font-semibold text-white">{log.action}</span>
                          </div>
                          <p className="text-sm text-purple-200">{log.details}</p>
                        </div>
                        <div className="text-xs text-purple-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security Warning */}
        <div className="mt-8 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-2">⚠️ Security Warning</h3>
          <p className="text-yellow-200 text-sm">
            This is a demonstration application for educational purposes. Never use this with real private keys or mainnet transactions. 
            Always use hardware wallets and secure key management solutions for production environments.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-purple-500/20 bg-black/40 backdrop-blur-lg py-6">
        <div className="container mx-auto px-4 text-center text-purple-300 text-sm">
          <p>🔐 PAPI The Vault - Day 12 of 30 Days of PAPI</p>
          <p className="mt-1">Built with Polkadot-API | #Web3 #Security #Cryptography</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
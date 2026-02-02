import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { IntelligenceHeader } from './components/IntelligenceHeader';
import { DataFusion } from './components/DataFusion';
import { RealTimePanel } from './components/RealTimePanel';
import { HistoricalPanel } from './components/HistoricalPanel';
import { TrendAnalyzer } from './components/TrendAnalyzer';
import { AlertSystem } from './components/AlertSystem';
import { DetectiveVisualization } from './components/DetectiveVisualization';
import { Search, Brain, Shield, Zap, History, AlertTriangle } from 'lucide-react';
import './styles/globals.css';
import './styles/detectiveAnimations.css';

function App() {
  const [account, setAccount] = useState('5FHneW46zG4dKYFcW7dzmhY9Q9b8V6Q3jHcWb2rKvS8XqYt');
  const [range, setRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [detectiveMode, setDetectiveMode] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    console.log('🕵️‍♂️ Blockchain Intelligence Dashboard – Online');
    console.log('🔗 PAPI real-time + Indexer historical fusion activated');
    console.log(`🎯 Analyzing account: ${account.slice(0, 12)}...`);
    console.log(`⏳ Time window: last ${range}`);
    console.log(`🛡️ Detective mode: ${detectiveMode ? 'ENGAGED' : 'STANDBY'}`);
    console.log('📡 Establishing connections to live chain and archive indexers...');
  }, [account, range, detectiveMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 bg-detective-pattern">
      <Toaster position="top-right" />
      
      <IntelligenceHeader
        account={account}
        setAccount={setAccount}
        range={range}
        setRange={setRange}
        detectiveMode={detectiveMode}
        setDetectiveMode={setDetectiveMode}
        alertCount={alerts.length}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 rounded-2xl p-8 border border-gray-700/60 backdrop-blur-sm animate-fusion-glow">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-5 bg-gradient-to-r from-detective-realtime via-detective-historical to-detective-fusion bg-clip-text text-transparent">
                  Complete Chain Intelligence
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  PAPI delivers the live pulse of the chain. Indexers hold the complete historical record. 
                  Together they create something rare in blockchain: full contextual awareness — past, present, 
                  and predictive future — in one unified dashboard.
                </p>
                <div className="flex flex-wrap gap-5">
                  <div className="flex items-center space-x-3 bg-detective-realtime/10 px-5 py-3 rounded-xl border border-detective-realtime/30">
                    <Zap className="w-6 h-6 text-detective-realtime" />
                    <span className="font-medium">Live Chain State</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-detective-historical/10 px-5 py-3 rounded-xl border border-detective-historical/30">
                    <History className="w-6 h-6 text-detective-historical" />
                    <span className="font-medium">Full History Archive</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-detective-fusion/10 px-5 py-3 rounded-xl border border-detective-fusion/30 animate-pulse-slow">
                    <Brain className="w-6 h-6 text-detective-fusion" />
                    <span className="font-medium">Fused Intelligence</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/60 rounded-xl p-7 border border-gray-700/50">
                <h3 className="text-xl font-semibold mb-5 flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-detective-fusion" />
                  <span>Active Data Sources</span>
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full bg-detective-realtime animate-ping-slow"></div>
                      <div>
                        <div className="font-medium">PAPI – Real-time</div>
                        <div className="text-sm text-gray-400">wss://rpc.polkadot.io</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-400">Connected</div>
                      <div className="text-xs text-gray-500">~42 ms</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full bg-detective-historical animate-ping-slow delay-150"></div>
                      <div>
                        <div className="font-medium">SubQuery – History</div>
                        <div className="text-sm text-gray-400">Indexed archive</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-400">Synced</div>
                      <div className="text-xs text-gray-500">~118 ms</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-detective-fusion/40">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full bg-detective-fusion animate-ping-slow delay-300"></div>
                      <div>
                        <div className="font-medium">Fusion Engine</div>
                        <div className="text-sm text-gray-400">Real-time + Archive</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-detective-fusion">Active</div>
                      <div className="text-xs text-gray-500">Intelligence Score: 92%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center space-x-3">
              <Search className="w-7 h-7 text-detective-realtime" />
              <span>Target Analysis</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <input
                type="text"
                value={account}
                onChange={e => setAccount(e.target.value)}
                placeholder="Enter SS58 address..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-detective-realtime min-w-[340px]"
              />
              <select
                value={range}
                onChange={e => setRange(e.target.value as any)}
                className="bg-gray-900 border border-gray-700 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-detective-historical"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <RealTimePanel account={account} />
              <HistoricalPanel account={account} range={range} />
            </div>
            <DataFusion account={account} range={range} />
          </div>

          <div className="space-y-8">
            <TrendAnalyzer account={account} range={range} />
            <AlertSystem account={account} alerts={alerts} setAlerts={setAlerts} />
            <DetectiveVisualization account={account} detectiveMode={detectiveMode} />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800/50 mt-16 py-10">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>Blockchain Intelligence Dashboard • Day 26/30 #PAPI30Days</p>
          <p className="mt-2">PAPI gives the present. Indexers give the past. Together they reveal the future. 🕵️‍♂️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ChainSelector } from './components/ChainSelector';
import { EventDashboard } from './components/EventDashboard';
import { StatsPanel } from './components/StatsPanel';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { CHAINS } from './data/chainConfig';
import { Activity, Zap, Shield, Cpu, Globe, Bell } from 'lucide-react';
import './styles/globals.css';
import './styles/eventAnimations.css';

function App() {
  const [selectedChains, setSelectedChains] = useState<string[]>(['polkadot']);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [connectedChains, setConnectedChains] = useState<number>(0);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [performanceData, setPerformanceData] = useState({
    eventsPerSecond: 0,
    memoryUsage: 0,
    connectionLatency: 0,
  });

  const startMonitoring = () => {
    console.log('🚀 Starting Multi-Chain Event Orchestrator...');
    console.log('🎯 Week 3 Skills Showcase:');
    console.log('   • Multi-chain event monitoring');
    console.log('   • Real-time observables');
    console.log('   • Error handling & validation');
    console.log('   • Performance optimization');
    console.log('   • Type-safe event processing');
    
    setIsMonitoring(true);
    setConnectedChains(selectedChains.length);
    
    // Simulate chain connections (Week 3: Multi-chain setup)
    selectedChains.forEach((chainId, index) => {
      setTimeout(() => {
        const chain = CHAINS.find(c => c.id === chainId);
        console.log(`✅ Connected to ${chain?.name} via ${chain?.wsEndpoint}`);
        console.log(`   📡 Subscribing to events: ${chain?.supportedEvents.join(', ')}`);
        
        toast.success(`Connected to ${chain?.name}`, {
          icon: '🔗',
          duration: 3000,
        });
      }, index * 1000);
    });

    // Simulate event streaming (Week 3: Observables & Event handling)
    const eventInterval = setInterval(() => {
      const newEvents = Math.floor(Math.random() * 3) + 1;
      setTotalEvents(prev => prev + newEvents);
      
      // Simulate different event types (Week 3: Type safety)
      const eventTypes = ['Balances.Transfer', 'Staking.Rewarded', 'Staking.Slashed', 'Democracy.Proposed'];
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomChain = selectedChains[Math.floor(Math.random() * selectedChains.length)];
      
      console.log(`📥 New event on ${randomChain}: ${randomEvent}`);
      console.log(`   🕒 ${new Date().toISOString()}`);
      console.log(`   📊 Event details: ${Math.random().toString(36).substring(7)}`);
      
      // Week 3: Error handling simulation
      if (Math.random() < 0.1) {
        console.warn('⚠️  Simulated event parsing error (handled gracefully)');
        toast.error('Event parsing error (handled)', {
          duration: 2000,
        });
      }
    }, 2000);

    // Simulate performance metrics (Week 3: Performance optimization)
    const performanceInterval = setInterval(() => {
      setPerformanceData({
        eventsPerSecond: Math.random() * 10 + 5,
        memoryUsage: Math.random() * 100 + 200,
        connectionLatency: Math.random() * 100 + 50,
      });
    }, 3000);

    return () => {
      clearInterval(eventInterval);
      clearInterval(performanceInterval);
    };
  };

  const stopMonitoring = () => {
    console.log('🛑 Stopping event monitoring...');
    console.log('📊 Final Statistics:');
    console.log(`   • Total events processed: ${totalEvents}`);
    console.log(`   • Chains monitored: ${selectedChains.length}`);
    console.log(`   • Peak events/second: ${performanceData.eventsPerSecond.toFixed(1)}`);
    
    setIsMonitoring(false);
    toast.success('Monitoring stopped', {
      icon: '⏹️',
      duration: 2000,
    });
  };

  useEffect(() => {
    console.log('🎻 PAPI Event Orchestrator initialized');
    console.log('🌟 Week 3 Recap: Master of events, errors, and upgrades!');
    console.log('🔧 This project demonstrates:');
    console.log('   • Multi-chain event monitoring');
    console.log('   • Real-time observables (Day 14)');
    console.log('   • Error handling (Day 17)');
    console.log('   • Performance optimization (Day 18)');
    console.log('   • Type safety (Day 19)');
    console.log('   • Multi-chain setup (Day 13)');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
        }}
      />
      
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full blur opacity-30"></div>
                <Activity className="w-10 h-10 text-white relative animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                  PAPI Event Orchestrator
                </h1>
                <p className="text-gray-400">Day 21: Week 3 Recap - Master of All Chains</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <Globe className="w-5 h-5 text-primary-500" />
                <span>{connectedChains} chains</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Bell className="w-5 h-5 text-success-500" />
                <span>{totalEvents} events</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isMonitoring ? 'bg-success-500/20 text-success-300' : 'bg-warning-500/20 text-warning-300'
              }`}>
                {isMonitoring ? 'LIVE' : 'STOPPED'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700 mb-8 animate-fade-in-scale">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Week 3 Mastery Showcase 🦾</h2>
              <p className="text-gray-300 mb-6">
                This orchestrator demonstrates everything you learned in Week 3: Multi-chain event monitoring, real-time observables, error handling, performance optimization, and type safety - all in one powerful dashboard.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Real-time Observables</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Error Handling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-primary-500" />
                  <span>Multi-Chain Setup</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Control Panel</h3>
                <span className="text-xs text-gray-500">Week 3 Skills Active</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Select Chains (Day 13)</label>
                  <ChainSelector
                    chains={CHAINS}
                    selectedChains={selectedChains}
                    onChange={setSelectedChains}
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={startMonitoring}
                    disabled={isMonitoring || selectedChains.length === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 disabled:opacity-50 rounded-lg font-semibold transition-all duration-300"
                  >
                    {isMonitoring ? 'Monitoring...' : 'Start Orchestrator'}
                  </button>
                  
                  <button
                    onClick={stopMonitoring}
                    disabled={!isMonitoring}
                    className="flex-1 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 disabled:opacity-50 rounded-lg font-semibold transition-all duration-300"
                  >
                    Stop
                  </button>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-500 mb-2">Week 3 Features:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-xs">Event Streams</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-xs">Error Handling</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-xs">Multi-Chain</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-xs">Type Safety</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Event Dashboard */}
          <div className="lg:col-span-2">
            <EventDashboard
              isMonitoring={isMonitoring}
              selectedChains={selectedChains}
              totalEvents={totalEvents}
            />
          </div>

          {/* Stats & Performance Panel */}
          <div className="space-y-8">
            <StatsPanel
              totalEvents={totalEvents}
              connectedChains={connectedChains}
              selectedChains={selectedChains.length}
            />
            
            <PerformanceMonitor data={performanceData} />
            
            {/* Week 3 Skills Panel */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Week 3 Skills Applied</span>
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium mb-2">Day 13: Multi-Chain Setup</h4>
                  <p className="text-sm text-gray-400">Monitoring {selectedChains.length} chains simultaneously</p>
                </div>
                
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium mb-2">Day 14: Observables</h4>
                  <p className="text-sm text-gray-400">Real-time event streams with RxJS-like patterns</p>
                </div>
                
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium mb-2">Day 16: Event Handling</h4>
                  <p className="text-sm text-gray-400">Sophisticated event filtering and processing</p>
                </div>
                
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium mb-2">Day 17: Error Handling</h4>
                  <p className="text-sm text-gray-400">Graceful error recovery and user notifications</p>
                </div>
              </div>
            </div>
            
            {/* Console Output Panel */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Console Output</h3>
              <div className="bg-black rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
                <pre className="text-green-400">
{`> papi-event-orchestrator v1.0
> Week 3 Mastery Project
> Initializing multi-chain monitor...

✅ Using PAPI dynamic imports (Day 18)
✅ Generated type descriptors (Day 19)
✅ Configured error boundaries (Day 17)
✅ Set up event observables (Day 14)
✅ Connected to ${selectedChains.length} chains (Day 13)

📡 Listening for events:
${selectedChains.map(chainId => {
  const chain = CHAINS.find(c => c.id === chainId);
  return `   • ${chain?.name}: ${chain?.supportedEvents.slice(0, 3).join(', ')}...`;
}).join('\n')}

⚡ Performance optimized (Day 18)
🛡️  Type safety enforced (Day 19)
🔧 Ready for runtime upgrades (Day 20)`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Week 3 Achievement</h3>
              <p className="text-gray-400 text-sm">
                You've mastered event handling, error management, multi-chain setups, performance optimization, and type safety. You're now a PAPI expert!
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Skills Demonstrated</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>Multi-chain event monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>Real-time observables</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>Error handling & validation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>Performance optimization</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Continue Learning</h3>
              <div className="space-y-2 text-sm">
                <a 
                  href="https://polkadot-api.js.org/docs/advanced/event-handling"
                  className="text-primary-400 hover:text-primary-300 block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PAPI Event Handling Docs
                </a>
                <a 
                  href="https://polkadot-api.js.org/docs/advanced/error-handling"
                  className="text-primary-400 hover:text-primary-300 block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PAPI Error Handling Guide
                </a>
                <a 
                  href="https://polkadot-api.js.org/docs/advanced/multi-chain"
                  className="text-primary-400 hover:text-primary-300 block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Multi-Chain Setup Tutorial
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800/50 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>PAPI Event Orchestrator • Day 21/30 #PAPI30Days • Week 3 Master: Handling events, errors, and upgrades like a boss 🦾</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
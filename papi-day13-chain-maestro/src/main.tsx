//src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Day 13 Initial Console Logs
console.log("=========================================");
console.log("🎼 PAPI Chain Maestro - Day 13");
console.log("=========================================");
console.log("🌉 Today's Mission: Master Multi-Chain Development");
console.log("🎯 Conducting the blockchain orchestra with PAPI");
console.log("");
console.log("💡 Key Concepts:");
console.log("   • Simultaneous connections to multiple chains");
console.log("   • PAPI descriptors for different networks");
console.log("   • Cross-chain data comparison and analysis");
console.log("   • Orchestrated multi-chain operations");
console.log("   • Real-time performance monitoring");
console.log("");
console.log("🔗 Chains Supported:");
console.log("   🟣 Polkadot - Security & Stability");
console.log("   🟡 Kusama - Speed & Experimentation");
console.log("   🔵 Westend - Testing & Development");
console.log("");
console.log("⚡ PAPI Multi-Chain Magic:");
console.log("   ✅ Same API across all chains");
console.log("   ✅ Type safety maintained everywhere");
console.log("   ✅ Automatic network detection");
console.log("   ✅ Parallel connection management");
console.log("   ✅ Cross-chain operation queue");
console.log("");
console.log("🎼 Expected Output:");
console.log("   1. Initialize connections to all chains");
console.log("   2. Fetch real-time metrics from each chain");
console.log("   3. Display side-by-side comparison");
console.log("   4. Allow individual chain toggling");
console.log("   5. Monitor cross-chain performance");
console.log("");
console.log("🚀 Ready to conduct the symphony! #PAPI30Days");
console.log("=========================================");

// Check for PAPI descriptors
try {
  require('@polkadot-api/descriptors');
  console.log("✅ PAPI descriptors loaded successfully");
} catch (error) {
  console.warn("⚠️ PAPI descriptors not found. Run: npx papi add dot -n polkadot");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
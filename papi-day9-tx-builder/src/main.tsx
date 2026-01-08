//src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Day 9 Initial Console Logs
console.log("=======================================");
console.log("🚀 PAPI Turbo Transaction Builder - Day 9");
console.log("=======================================");
console.log("🎯 Today's Mission: Master PAPI's tx method");
console.log("🏎️  Building transactions on autopilot mode");
console.log("");
console.log("💡 Key Concepts:");
console.log("   • PAPI's tx method for typed transaction building");
console.log("   • Auto-generated call data with runtime compatibility");
console.log("   • Real-time parameter validation");
console.log("   • Multi-pallet support with auto-fill");
console.log("");
console.log("🔧 Features Ready:");
console.log("   ✅ Connect to Polkadot via light-client");
console.log("   ✅ Browse all available pallets and calls");
console.log("   ✅ Build transactions with fully typed parameters");
console.log("   ✅ Inspect encoded call data in real-time");
console.log("");
console.log("🔵 Happy building! #PAPI30Days");
console.log("=======================================");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Day 11 Initial Console Logs
console.log("=========================================");
console.log("🤝 PAPI Trust Bridge - Day 11");
console.log("=========================================");
console.log("🔐 Today's Mission: Master PAPI + Polkadot.js Extension Integration");
console.log("🎯 Building the perfect partnership for secure dApps");
console.log("");
console.log("💡 Key Concepts:");
console.log("   • Polkadot.js Extension detection and connection");
console.log("   • Secure account management and permission controls");
console.log("   • Real-time balance fetching across all accounts");
console.log("   • Network awareness and security validation");
console.log("   • The perfect division of responsibilities");
console.log("");
console.log("🔧 Security Features:");
console.log("   ✅ Private keys stay in extension (never exposed)");
console.log("   ✅ Type-safe transaction building with PAPI");
console.log("   ✅ Runtime compatibility checks");
console.log("   ✅ User-controlled permission management");
console.log("   ✅ HTTPS validation and security checks");
console.log("");
console.log("👥 Expected Flow:");
console.log("   1. Detect Polkadot.js Extension");
console.log("   2. Request user permission");
console.log("   3. List all available accounts");
console.log("   4. Fetch real-time balances");
console.log("   5. Allow account selection and switching");
console.log("   6. Prepare for Day 12 (signing transactions)");
console.log("");
console.log("🔐 Remember: Trust is built through transparency and security!");
console.log("🤝 Happy connecting! #PAPI30Days");
console.log("=========================================");

// Check for extension on load
if (typeof window.injectedWeb3 === 'undefined') {
  console.warn("⚠️ Polkadot.js Extension not detected. Please install it for full functionality.");
  console.info("📥 Get it from: https://polkadot.js.org/extension/");
} else {
  console.log("✅ Polkadot.js Extension detected!");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
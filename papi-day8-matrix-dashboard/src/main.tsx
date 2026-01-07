// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Initial console log as specified in requirements
console.log("🚀 PAPI Matrix Dashboard initialized!");
console.log("📡 Preparing light-client connection to Polkadot...");
console.log("💡 This dashboard demonstrates Week 1 learnings:");
console.log("   • PAPI setup & installation");
console.log("   • Provider selection (Smoldot)");
console.log("   • TypedApi instance creation");
console.log("   • Reading constants, storage, and runtime APIs");
console.log("🔵 Happy building! #PAPI30Days");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
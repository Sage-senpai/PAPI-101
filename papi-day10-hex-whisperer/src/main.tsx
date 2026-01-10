import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

console.log("=========================================");
console.log("🎩 PAPI Hex Whisperer - Day 10");
console.log("=========================================");
console.log("🔮 Today's Mission: Master txFromCallData");
console.log("✨ Turning mysterious hex into readable magic");
console.log("");
console.log("💡 Key Concepts:");
console.log("   • PAPI's txFromCallData for hex decoding");
console.log("   • Runtime metadata-driven understanding");
console.log("   • Byte-by-byte inspection and analysis");
console.log("   • Error handling for invalid hex");
console.log("");
console.log("🔧 Features Ready:");
console.log("   ✅ Connect to Polkadot via light-client");
console.log("   ✅ Decode any valid call data hex");
console.log("   ✅ Visual byte inspection with color coding");
console.log("   ✅ Example transaction library");
console.log("   ✅ JSON export and copy functionality");
console.log("");
console.log("🎩 Happy hex whispering! #PAPI30Days");
console.log("=========================================");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { cryptoWaitReady } from '@polkadot/util-crypto';

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🔐</div>
        <h1 className="text-2xl font-bold text-white mb-2">PAPI The Vault</h1>
        <p className="text-purple-300">Initializing crypto library...</p>
        <div className="mt-4 flex justify-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

// Error component
function ErrorScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-white mb-2">Initialization Failed</h1>
        <p className="text-red-300 mb-4">Failed to load crypto library</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

// Show loading screen
root.render(
  <React.StrictMode>
    <LoadingScreen />
  </React.StrictMode>
);

// Initialize and render app
cryptoWaitReady()
  .then(() => {
    console.log('✅ Polkadot crypto library initialized');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error('❌ Failed to initialize crypto:', error);
    root.render(
      <React.StrictMode>
        <ErrorScreen />
      </React.StrictMode>
    );
  });
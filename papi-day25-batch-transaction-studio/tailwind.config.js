/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#0ea5e9',
          600: '#0284c7',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
        pallet: {
          balances: '#3B82F6',
          staking: '#8B5CF6',
          utility: '#10B981',
          democracy: '#F59E0B',
          multisig: '#EF4444',
          assets: '#06B6D4',
        }
      },
      animation: {
        'batch-pulse': 'batchPulse 2s infinite',
        'drag-glow': 'dragGlow 1.5s infinite alternate',
        'transaction-flow': 'transactionFlow 8s linear infinite',
        'gas-savings': 'gasSavings 3s ease-in-out infinite',
        'operation-drop': 'operationDrop 0.3s ease-out',
      },
      keyframes: {
        batchPulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(14,165,233,0.7)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 0 20px 10px rgba(14,165,233,0)' },
        },
        dragGlow: {
          '0%': { borderColor: 'rgba(59,130,246,0.3)', boxShadow: '0 0 10px rgba(59,130,246,0.3)' },
          '100%': { borderColor: 'rgba(139,92,246,0.6)', boxShadow: '0 0 20px rgba(139,92,246,0.6)' },
        },
        transactionFlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        gasSavings: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        operationDrop: {
          '0%': { transform: 'translateY(-20px) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        }
      },
      backgroundImage: {
        'batch-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [],
}
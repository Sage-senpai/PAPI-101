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
        chain: {
          polkadot: '#E6007A',
          kusama: '#000000',
          astar: '#0085FF',
          moonbeam: '#5A4FCF',
          acala: '#FF4F7D',
          parallel: '#EF3A37',
        },
        status: {
          online: '#10b981',
          syncing: '#f59e0b',
          offline: '#ef4444',
        }
      },
      animation: {
        'pulse-chain': 'pulseChain 2s infinite',
        'slide-in-chain': 'slideInChain 0.5s ease-out',
        'network-pulse': 'networkPulse 3s infinite',
        'cross-chain-glow': 'crossChainGlow 4s infinite alternate',
        'data-flow': 'dataFlow 6s linear infinite',
      },
      keyframes: {
        pulseChain: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        slideInChain: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        networkPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(14, 165, 233, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(14, 165, 233, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(14, 165, 233, 0)' },
        },
        crossChainGlow: {
          '0%': { 
            backgroundPosition: '0% 50%',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            boxShadow: '0 0 30px rgba(230, 0, 122, 0.4)'
          },
          '100%': { 
            backgroundPosition: '0% 50%',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)'
          },
        },
        dataFlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      backgroundImage: {
        'cross-chain-gradient': 'linear-gradient(90deg, #E6007A 0%, #000000 25%, #0085FF 50%, #5A4FCF 75%, #FF4F7D 100%)',
        'chain-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
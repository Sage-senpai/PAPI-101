/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matrix-green': '#00ff41',
        'polkadot-pink': '#E6007A',
        'polkadot-gray': '#4D4D4D',
      },
      fontFamily: {
        'matrix': ['Courier New', 'monospace'],
      },
      animation: {
        'matrix-rain': 'matrixRain 1s infinite linear',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        matrixRain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}
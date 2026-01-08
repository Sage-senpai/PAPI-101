/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'turbo-blue': '#00D4FF',
        'turbo-purple': '#8B5CF6',
        'polkadot-pink': '#E6007A',
        'dark-bg': '#0A0A0F',
        'card-bg': '#13131F',
        'border-color': '#2A2A3A',
      },
      fontFamily: {
        'jetbrains': ['"JetBrains Mono"', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-turbo': 'pulseTurbo 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        pulseTurbo: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-turbo': 'linear-gradient(90deg, #00D4FF 0%, #8B5CF6 50%, #E6007A 100%)',
        'grid-pattern': 'linear-gradient(to right, #2A2A3A 1px, transparent 1px), linear-gradient(to bottom, #2A2A3A 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-lg': '40px 40px',
      },
    },
  },
  plugins: [],
}
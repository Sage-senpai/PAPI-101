/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-stage': '#0B0E14',
        'card-console': '#111827',
        'border-stage': '#1F2937',
        'polkadot-purple': '#E6007A',
        'kusama-yellow': '#FCD34D',
        'westend-blue': '#00AEEF',
        'accent-orchestra': '#6D28D9',
        'success-maestro': '#22C55E',
        'warning-conductor': '#F59E0B',
      },
      fontFamily: {
        'sans-maestro': ['Inter', 'system-ui', 'sans-serif'],
        'mono-maestro': ['JetBrains Mono', 'monospace'],
        'serif-maestro': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
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
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'magic-purple': '#8A2BE2',
        'sparkle-blue': '#00D4FF',
        'dark-crystal': '#0A0A1E',
        'crystal-card': '#1A1A2E',
        'border-magic': '#2A2A4A',
        'success-emerald': '#10B981',
        'warning-amber': '#F59E0B',
      },
      fontFamily: {
        'cursive': ['"Brush Script MT"', 'cursive'],
        'mono-magic': ['"Courier New"', 'monospace', 'ui-monospace'],
        'sans-magic': ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'sparkle': 'sparkle 2s infinite',
        'float-magic': 'floatMagic 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'shimmer-text': 'shimmerText 2s infinite',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(1.1)' },
        },
        floatMagic: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(138, 43, 226, 0.8)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        shimmerText: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'magic-gradient': 'linear-gradient(135deg, #8A2BE2 0%, #00D4FF 50%, #10B981 100%)',
        'crystal-texture': 'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
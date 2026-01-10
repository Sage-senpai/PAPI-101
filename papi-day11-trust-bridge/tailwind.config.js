/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trust-blue': '#3B82F6',
        'security-green': '#10B981',
        'warning-amber': '#F59E0B',
        'dark-foundation': '#111827',
        'card-layer': '#1F2937',
        'border-safe': '#374151',
        'accent-purple': '#8B5CF6',
        'success-emerald': '#10B981',
      },
      fontFamily: {
        'sans-trust': ['Inter', 'system-ui', 'sans-serif'],
        'mono-secure': ['"JetBrains Mono"', 'monospace'],
        'display-safe': ['"SF Pro Display"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-safe': 'pulseSafe 2s infinite',
        'float-trust': 'floatTrust 4s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'connection-pulse': 'connectionPulse 1.5s infinite',
        'shield-glow': 'shieldGlow 2s infinite',
      },
      keyframes: {
        pulseSafe: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        floatTrust: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        connectionPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
        },
        shieldGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.8))' },
        },
      },
      backgroundImage: {
        'trust-gradient': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #10B981 100%)',
        'security-pattern': 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
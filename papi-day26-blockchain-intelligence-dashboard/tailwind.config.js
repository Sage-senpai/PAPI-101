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
        detective: {
          realtime: '#3B82F6',
          historical: '#8B5CF6',
          fusion: '#10B981',
          alert: '#EF4444',
        },
        time: {
          past: '#6B7280',
          present: '#3B82F6',
          future: '#10B981',
        }
      },
      animation: {
        'detective-scan': 'detectiveScan 4s linear infinite',
        'data-pulse': 'dataPulse 2.5s ease-in-out infinite',
        'fusion-glow': 'fusionGlow 5s infinite alternate',
        'alert-flash': 'alertFlash 1.2s infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        detectiveScan: {
          '0%': { 
            transform: 'translateX(-100%)', 
            opacity: '0' 
          },
          '50%': { 
            opacity: '0.6' 
          },
          '100%': { 
            transform: 'translateX(100%)', 
            opacity: '0' 
          },
        },
        dataPulse: {
          '0%, 100%': { 
            transform: 'scale(1)', 
            boxShadow: '0 0 0 0 rgba(59,130,246,0.5)' 
          },
          '50%': { 
            transform: 'scale(1.04)', 
            boxShadow: '0 0 25px 12px rgba(59,130,246,0)' 
          },
        },
        fusionGlow: {
          '0%': { 
            boxShadow: '0 0 12px rgba(16,185,129,0.4)', 
            borderColor: 'rgba(16,185,129,0.3)' 
          },
          '100%': { 
            boxShadow: '0 0 28px rgba(16,185,129,0.7)', 
            borderColor: 'rgba(16,185,129,0.5)' 
          },
        },
        alertFlash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'ping-slow': {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      backgroundImage: {
        'detective-pattern': 'linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%)',
      },
      backgroundSize: {
        'detective': '40px 40px',
      },
    },
  },
  plugins: [],
}
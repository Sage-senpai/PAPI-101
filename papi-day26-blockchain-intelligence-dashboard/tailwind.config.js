/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        detective: {
          realtime:   '#3B82F6',
          historical: '#8B5CF6',
          fusion:     '#10B981',
          alert:      '#EF4444',
        },
      },
      animation: {
        'detective-scan': 'detectiveScan 4s linear infinite',
        'data-pulse':     'dataPulse 2.5s ease-in-out infinite',
        'fusion-glow':    'fusionGlow 5s infinite alternate',
        'alert-flash':    'alertFlash 1.2s infinite',
        'pulse-slow':     'pulseSlow 3s ease-in-out infinite',
        'ping-slow':      'pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-wave':     'pulseWave 2s ease-in-out infinite',
      },
      keyframes: {
        detectiveScan: {
          '0%':   { transform: 'translateX(-100%)', opacity: '0' },
          '50%':  { opacity: '0.6' },
          '100%': { transform: 'translateX(100%)',  opacity: '0' },
        },
        dataPulse: {
          '0%, 100%': { transform: 'scale(1)',    boxShadow: '0 0 0 0 rgba(59,130,246,0.5)' },
          '50%':      { transform: 'scale(1.04)', boxShadow: '0 0 25px 12px rgba(59,130,246,0)' },
        },
        fusionGlow: {
          '0%':   { boxShadow: '0 0 12px rgba(16,185,129,0.4)', borderColor: 'rgba(16,185,129,0.3)' },
          '100%': { boxShadow: '0 0 28px rgba(16,185,129,0.7)', borderColor: 'rgba(16,185,129,0.5)' },
        },
        alertFlash: {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.4' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.5' },
        },
        pingSlow: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        pulseWave: {
          '0%, 100%': { transform: 'scaleX(1)',   opacity: '1'   },
          '50%':      { transform: 'scaleX(1.5)', opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
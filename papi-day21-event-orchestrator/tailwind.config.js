// ============================================================================
// FILE: papi-event-orchestrator/tailwind.config.js
// PURPOSE: Tailwind CSS configuration with animations and colors
// STATUS: READY - All Week 3 animations configured
// ============================================================================

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
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
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
        chain: {
          polkadot: '#E6007A',
          kusama: '#000000',
          westend: '#DA68A7',
          rococo: '#6F36DA',
        }
      },
      animation: {
        'event-pulse': 'eventPulse 2s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'fade-in-scale': 'fadeInScale 0.5s ease-out',
        'chain-glow': 'chainGlow 3s infinite alternate',
        'notification-slide': 'notificationSlide 0.5s ease-out',
      },
      keyframes: {
        eventPulse: {
          '0%': {
            transform: 'translateX(-100%) scale(0.8)',
            opacity: '0'
          },
          '70%': {
            transform: 'translateX(0) scale(1.05)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(0) scale(1)',
            opacity: '1'
          },
        },
        slideInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInScale: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        chainGlow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor' },
        },
        notificationSlide: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
    },
  },
  plugins: [],
}
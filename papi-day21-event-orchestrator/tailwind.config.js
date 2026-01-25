// ============================================================================
// Enhanced Tailwind Configuration - PAPI Event Orchestrator
// Cutting-edge design system with animations and color schemes
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
        // Primary color palette
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Secondary purple palette
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Success states
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Warning states
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Danger/Error states
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Chain-specific colors
        chain: {
          polkadot: '#E6007A',
          'polkadot-dark': '#C4005E',
          kusama: '#000000',
          'kusama-light': '#2D2D2D',
          westend: '#DA68A7',
          'westend-dark': '#B84A8A',
          rococo: '#6F36DA',
          'rococo-dark': '#5A2AB0',
        },
        // Glass effect backgrounds
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
      },
      
      // Custom animations
      animation: {
        // Event animations
        'event-pulse': 'eventPulse 2s cubic-bezier(0.4, 0, 0.6, 1)',
        'event-slide-in': 'eventSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-up': 'slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-down': 'slideInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Fade animations
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-scale': 'fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        
        // Chain-specific animations
        'chain-glow': 'chainGlow 3s ease-in-out infinite alternate',
        'chain-pulse': 'chainPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // Notification animations
        'notification-slide': 'notificationSlide 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'notification-shake': 'notificationShake 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Loading animations
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // Bounce animations
        'bounce-slow': 'bounce 2s infinite',
        'bounce-in': 'bounceIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Gradient animations
        'gradient-shift': 'gradientShift 3s ease infinite',
        'gradient-x': 'gradientX 3s ease infinite',
        'gradient-y': 'gradientY 3s ease infinite',
        
        // Scale animations
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-pulse': 'scalePulse 2s ease-in-out infinite',
        
        // Shimmer effect
        'shimmer': 'shimmer 2s linear infinite',
        
        // Ripple effect
        'ripple': 'ripple 2s ease-out infinite',
        
        // Float effect
        'float': 'float 3s ease-in-out infinite',
      },
      
      // Custom keyframes
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
        eventSlideIn: {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        slideInUp: {
          '0%': { 
            transform: 'translateY(30px)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateY(0)', 
            opacity: '1' 
          },
        },
        slideInDown: {
          '0%': { 
            transform: 'translateY(-30px)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateY(0)', 
            opacity: '1' 
          },
        },
        slideInLeft: {
          '0%': { 
            transform: 'translateX(-30px)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateX(0)', 
            opacity: '1' 
          },
        },
        slideInRight: {
          '0%': { 
            transform: 'translateX(30px)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateX(0)', 
            opacity: '1' 
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInScale: {
          '0%': { 
            transform: 'scale(0.9)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'scale(1)', 
            opacity: '1' 
          },
        },
        fadeInUp: {
          '0%': {
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        chainGlow: {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' 
          },
          '100%': { 
            boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' 
          },
        },
        chainPulse: {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.7',
            transform: 'scale(1.05)'
          },
        },
        notificationSlide: {
          '0%': { 
            transform: 'translateX(100%)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateX(0)', 
            opacity: '1' 
          },
        },
        notificationShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        bounceIn: {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '1'
          },
          '70%': {
            transform: 'scale(0.9)'
          },
          '100%': {
            transform: 'scale(1)'
          },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientY: {
          '0%, 100%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '50% 100%' },
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        ripple: {
          '0%': {
            opacity: '0.6',
            transform: 'scale(0.8)'
          },
          '100%': {
            opacity: '0',
            transform: 'scale(2)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      
      // Custom shadows
      boxShadow: {
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.5)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
      },
      
      // Custom backdrop blur
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      
      // Custom border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // Custom font sizes
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      
      // Custom z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}
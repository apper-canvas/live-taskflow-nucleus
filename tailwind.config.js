/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4CFF',
        secondary: '#FF6B6B',
        accent: '#4ECDC4',
        success: '#4ADE80',
        warning: '#FBBF24',
        error: '#EF4444',
        info: '#3B82F6',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'] 
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'confetti': 'confetti 0.5s ease-out forwards',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: 1 },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: 1 },
          '100%': { transform: 'scale(0) rotate(360deg)', opacity: 0 }
        }
      }
    },
  },
  plugins: [],
}
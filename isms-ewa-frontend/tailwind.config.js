/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    colors: {
      // Custom color palette for ISMS-EWA
      white: '#ffffff',
      transparent: 'transparent',
      slate: {
        950: '#0f172a',
        900: '#0f172a',
        800: '#1e293b',
        700: '#334155',
        600: '#475569',
        500: '#64748b',
        400: '#94a3b8',
        300: '#cbd5e1',
        200: '#e2e8f0',
        100: '#f1f5f9',
        50: '#f8fafc',
      },
      blue: {
        950: '#0c2340',
        900: '#0f3460',
        800: '#1e40af',
        700: '#1d4ed8',
        600: '#2563eb',
        500: '#3b82f6',
        400: '#60a5fa',
        300: '#93c5fd',
        200: '#bfdbfe',
        100: '#dbeafe',
        50: '#eff6ff',
      },
      cyan: {
        400: '#22d3ee',
        500: '#06b6d4',
      },
      indigo: {
        500: '#6366f1',
        600: '#4f46e5',
      },
      emerald: {
        500: '#10b981',
        600: '#059669',
      },
      amber: {
        500: '#f59e0b',
        600: '#d97706',
      },
      rose: {
        500: '#f43f5e',
        600: '#e11d48',
      },
    },
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    },
    boxShadow: {
      'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
    },
    backdropBlur: {
      'xs': '2px',
      'sm': '4px',
      'md': '12px',
      'lg': '16px',
      'xl': '24px',
    },
  },
  plugins: [],
}

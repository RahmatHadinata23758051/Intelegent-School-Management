module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'risk-low': '#10b981',
        'risk-medium': '#f59e0b',
        'risk-high': '#ef4444',
        'primary': '#06b6d4',
        'primary-dark': '#0891b2',
        'secondary': '#3b82f6',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(6, 182, 212, 0.5)',
        'glow-lg': '0 0 40px rgba(6, 182, 212, 0.3)',
      },
    },
  },
  plugins: [],
}

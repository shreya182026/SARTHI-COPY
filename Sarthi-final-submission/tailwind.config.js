/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        pink: {
          50: '#fff1f6',
          100: '#ffe4ec',
          200: '#ffc9dd',
          300: '#ff9ebf',
          400: '#ff5c8a',
          500: '#ff2d6f', // Hot Pink — primary
          600: '#e8005a',
          700: '#c4004a',
          800: '#a3003f',
          900: '#870038',
        },
        navy: {
          50: '#eef1f6',
          100: '#d5dbe8',
          200: '#a9b6cf',
          300: '#7d90b6',
          400: '#516b9d',
          500: '#34507f',
          600: '#243f6b',
          700: '#1a2f50', // Deep Navy
          800: '#132240',
          900: '#0d1830',
        },
        turquoise: {
          50: '#effcfb',
          100: '#c8f7f4',
          200: '#91efe9',
          300: '#5ae2dd',
          400: '#2cccbd', // Turquoise
          500: '#17a89e',
          600: '#0f8580',
          700: '#0b6663',
          800: '#084d4b',
          900: '#053938',
        },
        sky: {
          50: '#f0f8ff',
          100: '#dcf0ff',
          200: '#b5e0ff',
          300: '#7ecdff', // Light Blue
          400: '#4db5f5',
          500: '#1d9be0',
          600: '#0b7bc4',
          700: '#08629e',
          800: '#074e7e',
          900: '#053d63',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // positive states
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // warnings
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        orange: {
          50: '#fff4ec',
          100: '#ffe4d3',
          200: '#ffc6a6',
          300: '#ffa66f',
          400: '#ff8a3d',
          500: '#ff7420',
          600: '#e85b0a',
          700: '#bf4605',
          800: '#963806',
          900: '#762f08',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // emergency
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'ping-slow': 'pingSlow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        pingSlow: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(19, 34, 64, 0.08)',
        'medium': '0 4px 24px rgba(19, 34, 64, 0.12)',
        'large': '0 8px 40px rgba(19, 34, 64, 0.16)',
        'pink': '0 4px 20px rgba(255, 45, 111, 0.25)',
        'navy': '0 4px 20px rgba(26, 47, 80, 0.2)',
        'pink': '0 8px 24px rgba(255, 45, 120, 0.24)',
      },
    },
  },
  plugins: [],
};

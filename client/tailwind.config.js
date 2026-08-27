/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffeed5',
          200: '#ffd7a8',
          300: '#ffb870',
          400: '#ff8c33',
          500: '#ff5500', // Electric Neon Orange
          600: '#e64a00',
          700: '#bf3600',
          800: '#992b00',
          900: '#7a2200',
          950: '#421000',
        },
        neon: {
          orange: '#ff5500',
          amber: '#ff9900',
          glow: '#ff6600',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'book': '0 10px 30px -10px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'book-hover': '0 20px 35px -10px rgba(255, 85, 0, 0.35), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'neon': '0 0 18px rgba(255, 85, 0, 0.45), 0 0 35px rgba(255, 85, 0, 0.2)',
        'neon-strong': '0 0 25px rgba(255, 85, 0, 0.65), 0 0 50px rgba(255, 85, 0, 0.35)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'neon-pulse': {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 8px #ff5500)' },
          '50%': { opacity: 0.85, filter: 'drop-shadow(0 0 16px #ff7700)' },
        }
      },
      animation: {
        'neon-pulse': 'neon-pulse 2.5s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}

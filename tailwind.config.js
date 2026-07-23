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
        fusion: {
          50: '#f4f3ff',
          100: '#ebe9fe',
          200: '#d9d6fe',
          300: '#beb6fc',
          400: '#9e8bf9',
          500: '#7c5cf5',
          600: '#6c3ce9',
          700: '#5c2cd1',
          800: '#4c24ad',
          900: '#3f1f8c',
          950: '#0b0d19',
        },
        navy: {
          800: '#0f172a',
          900: '#0b0f19',
          950: '#070a12',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 35px -5px rgba(124, 92, 245, 0.4)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}

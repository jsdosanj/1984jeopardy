/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'Cinzel Decorative', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        orange: {
          DEFAULT: '#FF6B1A',
          soft: 'rgba(255,107,26,0.15)',
        },
        gold: {
          DEFAULT: '#C9A84C',
        },
        blue: {
          deep: '#020B18',
          dark: '#040F1E',
          mid: '#071830',
          panel: '#0A1F3A',
          border: '#0D2847',
          highlight: '#1A4A7A',
        },
      },
      boxShadow: {
        'orange-glow': '0 0 30px rgba(255,107,26,0.4), 0 0 60px rgba(255,107,26,0.15)',
        'gold-glow': '0 0 20px rgba(201,168,76,0.3)',
      },
    },
  },
  plugins: [],
}

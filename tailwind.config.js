/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kesri: '#FF9933',   // Saffron Orange
        gold: '#D4AF37',    // Metallic Premium Gold
        darkGray: '#121212',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'kesri-glow': '0 0 25px rgba(255, 153, 51, 0.35)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.2)',
      }
    },
  },
  plugins: [],
}

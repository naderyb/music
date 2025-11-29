/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        royal: '#4169E1',     // un bleu roi
        navy: '#062A6D',      // navy blue
        turquoise: '#30E3C4', // turquoise
        sea: '#0077B6'        // sea blue
      },
      keyframes: {
        floaty: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(0px)' },
        }
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};

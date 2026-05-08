/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        arth: {
          cream: '#FBF4EC',
          peach: '#FFD6B5',
          coral: '#FF8A6B',
          rose: '#F3A6B0',
          orange: '#F08A5D',
          lavender: '#C9B8E0',
          mint: '#BFE3D7',
          plum: '#5B3A55',
          ink: '#2A1E2C',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px -12px rgba(91,58,85,0.35)',
      },
    },
  },
  plugins: [],
};

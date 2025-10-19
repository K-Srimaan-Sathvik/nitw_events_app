/**** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nitwBlue: '#003366',
        nitwGold: '#F2A900',
      },
    },
  },
  plugins: [],
};

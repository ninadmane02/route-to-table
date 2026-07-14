/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FFEDD5',
        },
        secondary: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
        }
      },
    },
  },
  plugins: [],
}

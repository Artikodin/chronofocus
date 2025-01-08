/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Maname', 'sans-serif'],
        maname: ['Maname', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


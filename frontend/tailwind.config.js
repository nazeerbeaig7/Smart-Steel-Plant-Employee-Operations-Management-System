/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#f6f7f9',
          100: '#ecedf2',
          200: '#d5d7e3',
          300: '#b1b6cc',
          400: '#8890b0',
          500: '#687094',
          600: '#53597b',
          700: '#434863',
          800: '#383d54',
          900: '#323647',
          950: '#232530',
        }
      }
    },
  },
  plugins: [],
}

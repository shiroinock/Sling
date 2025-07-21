/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['variant', ['&:is(.dark *)', '&:is(.dark)']],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
}

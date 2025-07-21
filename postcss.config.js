export default {
  plugins: {
    '@tailwindcss/postcss': {
      base: process.cwd(),
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
    },
    autoprefixer: {}
  }
}

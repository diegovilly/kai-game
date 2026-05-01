/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#E3F2FD',
        'panel-bg': '#1E293B',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sandhan: {
          blue: { 900: '#0F172A', 800: '#1E293B', 700: '#1E3A8A', 600: '#1D4ED8', 500: '#3B82F6' },
          orange: { 500: '#F97316', 400: '#FB923C', 300: '#FED7AA' },
          green: '#10B981',
          yellow: '#F59E0B',
          red: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

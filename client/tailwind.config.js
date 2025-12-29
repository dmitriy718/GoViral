/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald
          foreground: '#FFFFFF',
        },
        background: '#F9FAFB',
        foreground: '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

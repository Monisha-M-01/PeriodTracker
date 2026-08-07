/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        ritvi: ['Dancing Script', 'cursive'],
      }
    },
  },
  plugins: [],
}

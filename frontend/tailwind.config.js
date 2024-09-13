/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line
  ],
  theme: {
    extend: {
      colors: {
        customGreen: '#00A47C', 
      },
    },
  },
  plugins: [],
}
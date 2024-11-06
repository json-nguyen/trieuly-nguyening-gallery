/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-purple': '#D8CFEE',  
        'clicked-purple': '#A985D0', 
      },
      fontFamily: {
        'quincy': ['Quincy', 'serif'],
      },
    },
  },
  plugins: [],
}


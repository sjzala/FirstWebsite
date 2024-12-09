/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs', 
    './public/**/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ["fantasy"], // or any theme you prefer
  },
}


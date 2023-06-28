/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      colors: {
        'gray-input': 'rgba(238, 238, 238, .7)',
        'principal-gray': '#393E46',
        'secondary-gray': '#929AAB',
        'hard-gray': '#1E1E1E',
        'polished-white': '#F7F7F7'
      },
    },
  },
  plugins: [],
}


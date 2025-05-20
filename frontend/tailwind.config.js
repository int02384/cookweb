/** @type {import('tailwindcss').Config} */
module.exports = {
  // ενεργοποίηση dark mode via class
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      // custom palette
      colors: {
        primary: {
          light: '#7f9cf5',
          DEFAULT: '#5a67d8',
          dark: '#4c51bf'
        },
        accent: {
          light: '#f6ad55',
          DEFAULT: '#ed8936',
          dark: '#dd6b20'
        }
      },
      // custom font stack
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'ui-serif', 'serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

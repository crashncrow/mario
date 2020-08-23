module.exports = {
  purge: [
    './components/**/*.js',
    './pages/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'bg': "url('/bg.png')",
      }) ,
      spacing: {
        '7': '1.75rem',
        '9': '2.25rem',
        '11': '2.75rem',
        '13': '3.25rem',
        '14': '3.50rem',
        '15': '3.75rem',
      }
    }
  },
  variants: {
    outline: ['focus'],
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
  }
}

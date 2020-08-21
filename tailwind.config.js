module.exports = {
  purge: [
    './components/**/*.js',
    './pages/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'bg': "url('/bg.png')",
      })
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

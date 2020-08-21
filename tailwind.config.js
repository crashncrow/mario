module.exports = {
  purge: [
    './components/**/*.tsx',
    './components/**/*.js',
    './pages/**/*.tsx',
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
}

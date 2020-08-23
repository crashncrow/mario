module.exports = {
  purge: {
    content: [
    './components/**/*.js',
    './pages/**/*.js'],
    options: {
      whitelist: [
        'w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-7', 'w-8', 
        'w-9', 'w-10', 'w-11', 'w-12','w-13', 'w-14', 'w-15', 
        'w-16', 'w-17', 'w-18', 'w-19', 'w-20', 'w-21', 'w-22',
        'w-23', 'w-24', 'w-25', 'w-26', 'w-27', 'w-28', 'w-29', 
        'w-30', 'w-31', 'w-32'
      ],
    }
  },
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
        '17': '4.25rem',
        '18': '4.50rem',
        '19': '4.75rem',
        '21': '5.25rem',
        '22': '5.50rem',
        '23': '5.75rem',
        '25': '6.25rem',
        '26': '6.50rem',
        '27': '6.75rem',
        '28': '7.00rem',
        '29': '7.25rem',
        '30': '7.50rem',
        '31': '7.75rem',
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

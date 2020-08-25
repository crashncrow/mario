module.exports = {
  purge: [
    './components/**/*.js',
    './pages/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'green-light': '#6cdb01',
        'green-dark': '#049204',
        'blue-sky': '#5b95fc',
        'brick-light': '#f9c87d',
        'brick-dark': '#db6c03',
        'mario-red': '#d82801',
        'mario-skin': '#fd9838',
        'mario-brown': '#886f03'
      },
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
        '32': '8.00rem',
        '33': '8.25rem',
        '34': '8.50rem',
        '35': '8.75rem',
        '36': '9.00rem',
        '37': '9.25rem',
        '38': '9.50rem',
        '39': '9.75rem',
        '40': '10.00rem',
        '41': '10.25rem',
        '42': '10.50rem',
        '43': '10.75rem',
        '44': '11.00rem',
        '45': '11.25rem',
        '46': '11.50rem',
        '47': '11.75rem',
        '48': '12.00rem',
        '49': '12.25rem',
        '50': '12.50rem',
        '51': '12.75rem',
        '52': '13.00rem',
        '53': '13.25rem',
        '54': '13.50rem',
        '55': '13.75rem',
        '56': '14.00rem',
        '57': '14.25rem',
        '58': '14.50rem',
        '59': '14.75rem',
        '60': '15.00rem',
        '61': '15.25rem',
        '62': '15.50rem',
        '63': '15.75rem',
        '64': '16.00rem',
        '65': '16.25rem',
        '66': '16.50rem',
        '67': '16.75rem',
        '68': '17.00rem',
        '69': '17.25rem',
        '70': '17.50rem',
        '71': '17.75rem',
        '72': '18.00rem',
        '73': '18.25rem',
        '74': '18.50rem',
        '75': '18.75rem',
        '76': '19.00rem',
        '77': '19.25rem',
        '78': '19.50rem',
        '79': '19.75rem',
        '80': '20.00rem',
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

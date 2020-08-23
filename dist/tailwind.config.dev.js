"use strict";

module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.js'],
  theme: {
    extend: {
      backgroundImage: function backgroundImage(theme) {
        return {
          'bg': "url('/bg.png')"
        };
      },
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
        '48': '11.25rem',
        '64': '16.25rem'
      }
    }
  },
  variants: {
    outline: ['focus']
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true
  }
};
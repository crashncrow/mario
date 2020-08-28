"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var purgecss = ['@fullhuman/postcss-purgecss', {
  content: ['./components/**/*.js', './pages/**/*.js', './libs/**/*.js'],
  defaultExtractor: function defaultExtractor(content) {
    return content.match(/[\w-/:]+(?<!:)/g) || [];
  }
}];
module.exports = {
  plugins: ['postcss-import', 'tailwindcss', 'autoprefixer'].concat(_toConsumableArray(process.env.NODE_ENV === 'production' ? [purgecss] : [purgecss]))
};
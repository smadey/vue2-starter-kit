const autoprefixer = require('autoprefixer');

const AUTOPREFIXER_BROWSERS = ['last 3 versions'];

module.exports = {
  postcss: [
    autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }),
  ],
};

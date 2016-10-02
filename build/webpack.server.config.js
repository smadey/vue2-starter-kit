const webpack = require('webpack');

const pkg = require('../package.json');
const base = require('./webpack.base.config');

module.exports = Object.assign({}, base, {
  target: 'node',
  devtool: false,
  entry: {
    server: './src/server.js',
  },
  output: Object.assign({}, base.output, {
    libraryTarget: 'commonjs2',
  }),
  externals: Object.keys(pkg.dependencies),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"',
    }),
  ],
});

const path = require('path');

const webpack = require('webpack');

const version = require('../package.json').version;
const vueConfig = require('./vue-loader.config');

// 以“版本号”为增量标志
const filename = process.env.NODE_ENV === 'production' ? (version + '/[name]') : '[name]';

module.exports = {
  devtool: '#source-map',
  entry: {
    client: './src/client.js',
    'client-vendors': ['vue', 'vue-router', 'vuex', 'es6-promise'],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: filename + '.js',
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot(\?#iefix)?|ttf|(svg#.+))$/i,
        loader: 'file',
        query: {
          name: filename + '.[ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      vue: vueConfig,
    }),
  ],
};

const webpack = require('webpack')

const version = require('../package.json').version;
const vueConfig = require('./vue-loader.config');
const base = require('./webpack.base.config');

// 以“版本号”为增量标志
const filename = process.env.NODE_ENV === 'production' ? (version + '/[name]') : '[name]';

const config = Object.assign({}, base, {
  plugins: base.plugins.concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'client-vendors',
      filename: filename + '.js'
    }),
  ]),
});

if (process.env.NODE_ENV === 'production') {
  const ExtractTextPlugin = require('extract-text-webpack-plugin');

  vueConfig.loaders = {
    css: ExtractTextPlugin.extract({
      loader: 'css-loader',
    }),
  };

  config.plugins.push(
    new ExtractTextPlugin(filename.replace('[name]', 'style') + '.css'), // 强制命名为 style.css
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    })
  );
}

module.exports = config;

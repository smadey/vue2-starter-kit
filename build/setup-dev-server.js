const path = require('path');
const webpack = require('webpack');
const MFS = require('memory-fs');

const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');

module.exports = function setupDevServer (app, onUpdate) {
  clientConfig.entry.client = ['webpack-hot-middleware/client', clientConfig.entry.client];
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  const clientCompiler = webpack(clientConfig);
  app.use(require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false,
    },
  }));
  app.use(require('webpack-hot-middleware')(clientCompiler));

  const mfs = new MFS();

  const outputFilename = serverConfig.output.filename.replace('[name]', 'server');
  const outputPath = path.join(serverConfig.output.path, outputFilename);

  const serverCompiler = webpack(serverConfig);
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) {
      throw err;
    }

    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(err => console.warn(err));

    onUpdate(mfs.readFileSync(outputPath, 'utf-8'));
  });
}

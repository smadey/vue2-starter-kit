process.env.VUE_ENV = 'server';
const port = process.env.PORT || 8880;
const isProd = process.env.NODE_ENV === 'production';

const fs = require('fs');
const path = require('path');

const express = require('express');
const serialize = require('serialize-javascript');
const vueServerRenderer = require('vue-server-renderer');
const lruCache = require('lru-cache');

const version = require('../package.json').version;

const uri = file => path.resolve(__dirname, file);
const dist = isProd ? `dist/${version}` : 'dist';

const app = express();

const html = (() => {
  const template = fs.readFileSync(uri('./views/index.html'), 'utf-8');

  const style = isProd ? `<link rel="stylesheet" href="/${dist}/style.css" />` : '';

  const script = `<script src="/${dist}/client-vendors.js"></script><script src="/${dist}/client.js"></script>`;

  const partials = template.replace('{{ STYLE }}', style)
    .replace('{{ SCRIPT }}', script)
    .split('{{ APP }}');

  return {
    head: partials[0],
    tail: partials[1],
  };
})();

var renderer;

if (isProd) {
  const bundlePath = uri(`../${dist}/server.js`);
  renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'));
} else {
  require('../build/setup-dev-server')(app, bundle => {
    renderer = createRenderer(bundle);
  });
}

function createRenderer(bundle) {
  return vueServerRenderer.createBundleRenderer(bundle, {
    cache: lruCache({
      max: 1000,
      maxAge: 1000 * 60 * 15,
    }),
  });
}

app.use('/dist', express.static(uri('../dist')));

app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.');
  }

  var start = Date.now();
  var firstChunk = true;

  const context = { url: req.url };
  const renderStream = renderer.renderToStream(context);

  res.write(html.head);

  renderStream.on('data', chunk => {
    if (firstChunk) {
      firstChunk = false;

      if (context.initialState) {
        res.write(
          `<script>window.__INITIAL_STATE__=${
            serialize(context.initialState, { isJSON: true })
          }</script>`
        );
      }
    }
    res.write(chunk);
  });

  renderStream.on('end', () => {
    res.end(html.tail);
    console.log(`request cost: ${Date.now() - start}ms`);
  });

  renderStream.on('error', err => {
    throw err;
  });

});

app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
});

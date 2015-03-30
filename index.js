'use strict';

let fs = require('fs'),
    path = require('path'),
    koa = require('koa'),
    serve = require('koa-static'),
    views = require('koa-views'),
    logger = require('koa-logger'),
    conditional = require('koa-conditional-get'),
    etag = require('koa-etag'),
    error = require('koa-error'),
    body = require('koa-body'),
    methodOverride = require('koa-methodoverride'),
    send = require('koa-send'),
    router = require('koa-router')(),
    app = koa();

app
  .use(body())
  .use(methodOverride())
  .use(logger())
  .use(conditional())
  .use(etag())
  .use(error())
  .use(serve(path.join(__dirname, 'public')));

// Jade templates
app.use(views(path.join(__dirname, 'server/views'), {
  default: 'jade'
}));

// index route
router.get('/', function* () {
  let scripts = [],
      styles = [];

  console.log(app.env);
  if (app.env === 'production') {
    scripts.push('bundle.js');
    styles.push('bundle.css');
  } else {
    scripts.push(
      '/packages/system.js',
      '/config.js',
      '/scripts/loader.js'
    );
    styles.push(
      '/styles/index.css'
    );
  }

  yield this.render('index', {
    scripts: scripts,
    styles: styles
  });

});

// serve jspm config file
router.get('/config.js', function* (next) {
  yield send(this, path.join(__dirname, 'jspm.config.js'));
});

router.get('/test', function* (next) {
  this.body = 'Hello, world';
});

// serve jspm packages
router.get(/^\/packages\//, serve(path.join(__dirname, 'client')));

// use router
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4000);

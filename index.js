'use strict';

import fs from 'fs';
import path from 'path';
import koa from 'koa';
import serve from 'koa-static';
import views from 'koa-views';
import logger from 'koa-logger';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import error from 'koa-error';
import body from 'koa-body';
import methodOverride from 'koa-methodoverride';
import send from 'koa-send';
import mount from 'koa-mount';

const router = require('koa-router')();
const app = koa();

app
  .use(body())
  .use(methodOverride())
  .use(logger())
  .use(conditional())
  .use(etag())
  .use(error())
  .use(serve(path.join(__dirname, 'public')))
  .use(mount('/jspm_packages', serve(path.join(__dirname, 'jspm_packages'))));

// Jade templates
app.use(views(path.join(__dirname, 'server/views'), {
  default: 'jade'
}));

// index route
router.get('/', function* () {
  yield this.render('index');
});

// serve jspm configuration file
router.get('/config.js', function* (next) {
  yield send(this, path.join(__dirname, 'jspm.config.js'));
});

// use router
app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.app.emit('error', err, this);
  }
});

app.on('error', function (err) {
  console.error(err.stack);
});

app.listen(process.env.PORT || (process.env.NODE_ENV === 'production' ? 80 : 3000));

'use strict';

import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import views from 'koa-views';
import logger from 'koa-logger';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import error from 'koa-error';
import bodyParser from 'koa-bodyparser';
import methodOverride from 'koa-methodoverride';
import send from 'koa-send';
import mount from 'koa-mount';
import convert from 'koa-convert';

const router = require('koa-router')();
const app = new Koa();

app
  .use(bodyParser())
  .use(methodOverride())
  .use(logger())
  .use(convert(conditional()))
  .use(convert(etag()))
  .use(convert(error()))
  .use(convert(serve(path.join(__dirname, 'public'))))
  .use(convert(mount('/jspm_packages', convert(serve(path.join(__dirname, 'jspm_packages'))))));

// Jade templates
app.use(convert(views(path.join(__dirname, 'server/views'), {
  default: 'jade'
})));

// serve jspm configuration file
// router.get('/config.js', async function (ctx, next) {
//   console.log(ctx.path);
//   await send(ctx, path.join(__dirname, 'jspm.config.js'));
// });

app.use(async function (ctx, next) {
  if (ctx.path === '/config.js') {
    await send(ctx, path.join(__dirname, 'jspm.config.js'));
  } else {
    await next();
  }
});

// index route
router.get('/', convert(function *() {
  yield this.render('index');
}));

// use router
app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(convert(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.app.emit('error', err, this);
  }
}));

app.on('error', function (err) {
  console.error(err.stack);
});

app.listen(process.env.PORT || (process.env.NODE_ENV === 'production' ? 80 : 3000));

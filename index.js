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
import helmet from 'koa-helmet';

const router = require('koa-router')();
const app = new Koa();

app
  .use(helmet())
  .use(bodyParser())
  .use(methodOverride())
  .use(logger())
  .use(convert(conditional()))
  .use(convert(etag()))
  .use(convert(error()))
  .use(convert(serve(path.join(__dirname, 'public'))))
  .use(convert(mount('/jspm_packages', convert(serve(path.join(__dirname, 'jspm_packages'))))));

// use Jade templates
app.use(convert(views(path.join(__dirname, 'server/views'), {
  extension: 'jade'
})));

// serve jspm configuration file
app.use(async function (ctx, next) {
  ctx.path === '/config.js'
    ? await send(ctx, 'jspm.config.js', { root: __dirname })
    : await next();
});

// index route
router.get('/', convert(function *() {
  yield this.render('index');
}));

// use router
app
  .use(router.routes())
  .use(router.allowedMethods());

// 404 error handler
app.use(async function (ctx, next) {
  if (ctx.status !== 404) await next();

  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body
  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<p>Not Found</p>';
      break;
    case 'json':
      ctx.body = {
        message: 'Not Found'
      };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Not Found';
  }
});

// other error handler
app.use(async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.type = 'html';
    ctx.body = '<p>Something gone really wrong.</p>';

    ctx.app.emit('error', err, ctx);
  }
});

app.use(async function () {
  throw new Error();
});

app.on('error', function (err) {
  console.log(err);
});

app.listen(process.env.PORT || (process.env.NODE_ENV === 'production' ? 80 : 3000));

export { app, router };

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import { browserSync, BROWSERSYNC_DELAY } from './config';

/**
 * Development helpers.
 */
gulp.task('nodemon', callback => {
  let called = false;

  return nodemon({
    script: 'index.js',
    ext: 'js jade',
    ignore: ['client/**', 'public/**'],
    execMap: {
      'js': './node_modules/babel-cli/bin/babel-node.js'
    }
  })
  .on('start', () => {
    if (!called) {
      setTimeout(callback, BROWSERSYNC_DELAY);
      called = true;
    }
  })
  .on('restart', () => {
    setTimeout(() => {
      browserSync.reload({ stream: false });
    }, BROWSERSYNC_DELAY);
  });

});

gulp.task('sync', ['nodemon'], () => {
  browserSync.init({
    files: ['public/**/*'],
    proxy: 'localhost:' + (process.env.PORT || 3000),
    port: 4000,
    browser: 'google-chrome',
    notify: false
  });
});

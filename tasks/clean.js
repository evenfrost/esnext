import gulp from 'gulp';
import del from 'del';
import { paths } from './config';

/**
 * Cleaners.
 */
gulp.task('clean', callback => {
  del([
    paths.build,
    'public/scripts',
    'public/styles',
    'public/images'
  ]).then(() => {
    callback();
  });
});

import gulp from 'gulp';
import watch from 'gulp-watch';
import { paths } from './config';

/**
 * Watchers.
 */
gulp.task('watch', () => {
  watch(paths.css.src, () => {
    gulp.start('styles:dev');
  });
  watch(paths.js.src, () => {
    gulp.start('scripts.client:dev');
  });
  watch(paths.images.src, () => {
    gulp.start('images:dev');
  });
  watch(paths.static.src, () => {
    gulp.start('static');
  });
}); 

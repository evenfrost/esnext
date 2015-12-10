import gulp from 'gulp';
import plumber from 'gulp-plumber';
import { paths } from './config';

/**
 * Images. Development workflow.
 */
gulp.task('images:dev', () => {
  return gulp.src(paths.images.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.images.dest));
});

/**
 * Images. Production build.
 */
gulp.task('images:build', () => {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.build));
});

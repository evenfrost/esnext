import gulp from 'gulp';
import plumber from 'gulp-plumber';
import { paths } from './config';

/**
 * Static assets.
 */
gulp.task('static:dev', () => {
  return gulp.src(paths.static.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.static.dest));
});

gulp.task('static:build', () => {
  return gulp.src(paths.static.src)
    .pipe(gulp.dest(paths.static.build));
});

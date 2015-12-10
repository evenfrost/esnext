import gulp from 'gulp';
import plumber from 'gulp-plumber';
import stylus from 'gulp-stylus';
import nib from 'nib';
import concatCss from 'gulp-concat-css';
import minifyCss from 'gulp-minify-css';
import { paths, browserSync } from './config';

/**
 * Styles. Development workflow.
 */
gulp.task('styles:dev', () => {
  return gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(stylus({
      use: [nib()],
      import: ['nib']
    }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream());
});

/**
 * Styles. Production build.
 */
gulp.task('styles:build', () => {
  return gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(stylus({
      use: [nib()],
      import: ['nib']
    }))
    .pipe(concatCss('bundle.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.css.build));
});

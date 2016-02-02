import gulp from 'gulp';
import plumber from 'gulp-plumber';
import gulpFilter from 'gulp-filter';
import babel from 'gulp-babel';
import changed from 'gulp-changed';
import shell from 'gulp-shell';
import { paths, browserSync } from './config';

/**
 * Server scripts. Production build.
 *
 * Builds all server files under 'build/server' directory,
 * running them through Babel and excluding Jade views.
 * Transpiler excludes stable V8 esnext options that are shipped in node.js.
 */
gulp.task('scripts.server:build', () => {
  let filter = gulpFilter('**/*.js', { restore: true });

  return gulp.src([paths.server.src, paths.index, paths.private], { base: './' })
    .pipe(plumber())
    .pipe(filter)
    .pipe(babel())
    .pipe(filter.restore)
    .pipe(gulp.dest(paths.server.build));
});

/**
 * Client scripts. Development workflow.
 */
gulp.task('scripts.client:dev', () => {
  return gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(changed(paths.js.dest))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
});

/**
 * Client scripts. Production build.
 */
gulp.task('scripts.client:build', () => {
  return gulp.src('')
    .pipe(plumber())
    .pipe(shell('node node_modules/jspm/jspm.js bundle-sfx --minify ' + paths.js.index + ' ' + paths.js.build));
});

'use strict';

const gulp = require('gulp');
const changed = require('gulp-changed');
const stylus = require('gulp-stylus');
const nib = require('nib');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');
const del = require('del');
const rename = require('gulp-rename');
const shell = require('gulp-shell');
const gulpif = require('gulp-if');
const gulpFilter = require('gulp-filter');
const babel = require('gulp-babel');
const concatCss = require('gulp-concat-css');
const minifyCss = require('gulp-minify-css');

const paths = {
  index: 'index.js',
  build: 'build',
  js: {
    src: 'client/scripts/**/*.js',
    index: 'client/scripts/index',
    dest: 'public/scripts',
    build: 'build/public/bundle.js'
  },
  css: {
    src: 'client/styles/**/*.styl',
    dest: 'public/styles',
    build: 'build/public'
  },
  server: {
    src: 'server/**',
    build: 'build',
    views: 'server/views'
  }
};

// do not transpile stable V8 ES.next features
const babelBlacklist = [
  'es6.blockScoping',
  'es6.constants',
  'es6.forOf',
  'es6.templateLiterals',
  'regenerator'
];

/**
 * Server scripts. Production build.
 *
 * Builds all server files under 'server' directory
 * into 'build/server' directory, running them through
 * Babel and excluding Jade views.
 * While running through Babel, excludes
 * stable V8 esnext options that are shipped in io.js.
 */
gulp.task('scripts.server:build', function () {
  let filter = gulpFilter('**/*.js');

  return gulp.src([paths.server.src, paths.index], { base: './' })
    .pipe(plumber())
    .pipe(filter)
    .pipe(babel({
      blacklist: babelBlacklist
    }))
    .pipe(filter.restore())
    .pipe(gulp.dest(paths.server.build));
});

/**
 * Client scripts. Development workflow.
 */
gulp.task('scripts.client:dev', function () {
  return gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(changed(paths.js.dest))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(livereload());
});

/**
 * Client scripts. Production build.
 */
gulp.task('scripts.client:build', function () {
  return gulp.src('')
    .pipe(plumber())
    .pipe(shell('jspm bundle-sfx --minify ' + paths.js.index + ' ' + paths.js.build));
});

/**
 * Styles. Development workflow.
 */
gulp.task('styles:dev', function () {
  return gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(stylus({
      use: [nib()],
      import: ['nib'],
    }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(livereload());
});

/**
 * Styles. Production build.
 */
gulp.task('styles:build', function () {
  return gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(stylus({
      use: [nib()],
      import: ['nib'],
    }))
    .pipe(concatCss('bundle.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.css.build));
});

/**
 * Watchers.
 */
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(paths.css.src, { gaze: { maxListeners: 999 }}, ['styles:dev']);
  gulp.watch(paths.js.src, { gaze: { maxListeners: 999 }}, ['scripts.client:dev']);
}); 

/**
 * Cleaners.
 */
gulp.task('clean', function (cb) {
  del([
    paths.build + '/**/*',
    // paths.js.build,
    // paths.css.build,
    paths.js.dest,
    paths.css.dest
  ], cb);
});

/**
 * Development helpers.
 */
gulp.task('dev', function () {
  nodemon({
    script: 'index.js',
    ext: 'js jade',
    ignore: ['client/**', 'public/**'],
    execMap: {
      'js': 'babel-node --blacklist ' + babelBlacklist.join(',')
    }
  });
});

gulp.task('build', function (callback) {
  runSequence('clean', ['scripts.server:build', 'scripts.client:build', 'styles:build'], callback);
});

/**
 * Default task.
 */
gulp.task('default', function (callback) {
  runSequence('clean', ['scripts.client:dev', 'styles:dev'], 'watch', 'dev', callback);
});

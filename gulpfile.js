var gulp = require('gulp'),
    changed = require('gulp-changed'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence'),
    del = require('del'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    shell = require('gulp-shell'),
    gulpif = require('gulp-if'),
    lazypipe = require('lazypipe'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    argv = require('yargs').argv,

    paths = {
      js: {
        src: 'client/scripts/**/*.js',
        dest: 'public/scripts',
        build: 'public/bundle.js'
      },
      css: {
        src: 'client/styles/**/*.styl',
        dest: 'public/styles',
        build: 'public'
      }
    },

    production = argv.production;

/**
 * Scripts. Development workflow.
 */
gulp.task('scripts', function () {
  return gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(changed(paths.js.dest))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(livereload());
});

/**
 * Scripts. Production build.
 */
gulp.task('scripts.build', function () {
  return gulp.src('')
    .pipe(plumber())
    .pipe(shell('jspm bundle-sfx scripts/index ' + paths.js.build));
});

/**
 * Styles. Development workflow.
 */
gulp.task('styles', function () {
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
gulp.task('styles.build', function () {
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
  gulp.watch(paths.css.src, { gaze: { maxListeners: 999 }}, ['styles']);
  gulp.watch(paths.js.src, { gaze: { maxListeners: 999 }}, ['scripts']);
}); 

/**
 * Cleaners.
 */
gulp.task('clean', function (cb) {
  del([
    paths.js.build,
    paths.css.build,
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
      'js': 'iojs --harmony_arrow_functions'
    }
  });
});

gulp.task('build', function (callback) {
  runSequence('clean', ['scripts.build', 'styles.build'], callback);
});

/**
 * Default task.
 */
gulp.task('default', function (callback) {
  runSequence('clean', ['scripts', 'styles'], 'watch', 'dev', callback);
});

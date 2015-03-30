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
    argv = require('yargs').argv,

    paths = {
      SRC_JS: 'client/scripts/**/*.js',
      SRC_CSS: 'client/styles/**/*.styl',
      DEST_JS: 'public/scripts',
      DEST_CSS: 'public/styles',
      BUILD_JS: 'public/build.js',
      BUILD_CSS: 'public/build.css'
    },

    production = argv.production;

gulp.task('scripts', function () {
  return gulp.src(paths.SRC_JS)
    .pipe(plumber())
    .pipe(changed(paths.DEST_JS))
    .pipe(gulp.dest(paths.DEST_JS))
    .pipe(livereload());
});

// gulp.task('scripts.prod', function () {
//   return gulp.src('')
//     .pipe(plumber())
//     .pipe(shell('jspm bundle-sfx scripts/index ' + paths.BUILD_JS));
// });

/**
 * Styles.
 */
gulp.task('styles', function () {
  return gulp.src(paths.SRC_CSS)
    .pipe(plumber())
    .pipe(stylus({
      use: [nib()],
      import: ['nib'],
    }))
    .pipe(gulp.dest(paths.DEST_CSS))
    .pipe(livereload());
});

/**
 * Watchers.
 */
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(paths.SRC_CSS, { gaze: { maxListeners: 999 }}, ['styles']);
  gulp.watch(paths.SRC_JS, { gaze: { maxListeners: 999 }}, ['scripts']);
}); 

/**
 * Cleaners.
 */
gulp.task('clean', function (cb) {
  del([
    paths.BUILD_JS,
    paths.BUILD_CSS,
    paths.DEST_JS,
    paths.DEST_CSS
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
    nodeArgs: ['--harmony_arrow_functions'],
    execMap: {
      'js': 'iojs'
    }
  })
    .on('start', ['watch'])
    .on('change', ['watch']);
});

/**
 * Default task.
 */
gulp.task('default', function (callback) {
  runSequence('clean', ['styles', 'scripts'], 'dev', callback);
});

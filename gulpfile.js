'use strict';

const gulp = require('gulp');
const changed = require('gulp-changed');
const stylus = require('gulp-stylus');
const nib = require('nib');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');
const del = require('del');
const rename = require('gulp-rename');
const shell = require('gulp-shell');
const gulpif = require('gulp-if');
const gulpFilter = require('gulp-filter');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const concatCss = require('gulp-concat-css');
const minifyCss = require('gulp-minify-css');

const paths = {
  index: 'index.js',
  private: 'private/**/*',
  build: 'build',
  js: {
    src: 'client/**/*.js',
    index: 'client/scripts/index.js',
    dest: 'public',
    build: 'build/public/bundle.js'
  },
  css: {
    src: 'client/styles/**/*.styl',
    dest: 'public/styles',
    build: 'build/public'
  },
  images: {
    src: 'client/images/**/*',
    dest: 'public/images',
    build: 'build/public/images'
  },
  rootAssets: {
    src: 'client/root/**/*',
    dest: 'public',
    build: 'build/public'
  },
  server: {
    src: 'server/**',
    build: 'build',
    views: 'server/views'
  }
};

let babelPresets = [
  'stage-2',
  'es2015-node5'
];

const BROWSERSYNC_DELAY = 1000;

/**
 * Server scripts. Production build.
 *
 * Builds all server files under 'server' directory
 * into 'build/server' directory, running them through
 * Babel and excluding Jade views.
 * While running through Babel, excludes
 * stable V8 esnext options that are shipped in io.js.
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
    .pipe(shell('jspm bundle-sfx --minify ' + paths.js.index + ' ' + paths.js.build));
});

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

/**
 * Root assets.
 */
gulp.task('rootAssets:dev', () => {
  return gulp.src(paths.rootAssets.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.rootAssets.dest));
});

gulp.task('rootAssets:build', () => {
  return gulp.src(paths.rootAssets.src)
    .pipe(gulp.dest(paths.rootAssets.build));
});

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
  watch(paths.rootAssets.src, () => {
    gulp.start('rootAssets');
  });
}); 

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

/**
 * Default task.
 */
gulp.task('default', callback => {
  runSequence('clean', ['scripts.client:dev', 'styles:dev', 'images:dev', 'rootAssets:dev'], 'watch', 'sync', callback);
});

/**
 * Build task.
 */
gulp.task('build', callback => {
  runSequence('clean', ['scripts.server:build', 'scripts.client:build', 'styles:build', 'images:build', 'rootAssets:build'], callback);
});

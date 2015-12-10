import BrowserSync from 'browser-sync';

export const paths = {
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
  static: {
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

export const browserSync = BrowserSync.create();

export const BROWSERSYNC_DELAY = 1000;

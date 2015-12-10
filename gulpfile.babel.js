import gulp from 'gulp';
import runSequence from 'run-sequence';

import './tasks/scripts';
import './tasks/styles';
import './tasks/images';
import './tasks/static';
import './tasks/watchers';
import './tasks/clean';
import './tasks/helpers';

/**
 * Default task.
 */
gulp.task('default', callback => {
  runSequence('clean', ['scripts.client:dev', 'styles:dev', 'images:dev', 'static:dev'], 'watch', 'sync', callback);
});

/**
 * Build task.
 */
gulp.task('build', callback => {
  runSequence('clean', ['scripts.server:build', 'scripts.client:build', 'styles:build', 'images:build', 'static:build'], callback);
});

const gulp = require('gulp');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');
const del = require('del');
const tsProject = ts.createProject('tsconfig.json');

function _build(cb) {
  del.sync(['build']);
  tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('build'))
  cb();
}

function _watch(cb) {
  gulp.watch('./src/**/*.ts', _build);
  cb();
}

function _start(cb) {
  nodemon({
    script: './build/index.js',
    watch: './build/',
  });
  cb();
}

exports.build = _build;
exports.start = _start;
exports.watch = gulp.series(
  _build,
  gulp.parallel(_watch, _start),
);
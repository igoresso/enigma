'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const server = require('browser-sync').create();
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const csso = require("gulp-csso");
const autoprefixer = require("autoprefixer");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");

gulp.task('clean', () => del('build'));

gulp.task('copy', () =>
  gulp
    .src([
      'source/fonts/**/*.{woff,woff2}',
      'source/img/**'
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build'))
);

gulp.task('html', () =>
  gulp
    .src('source/*.html')
    .pipe(plumber())
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('build'))
);

gulp.task('styles', () =>
  gulp
    .src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
);

gulp.task('scripts', () =>
  gulp
    .src('source/js/main.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rollup({plugins: [babel()]}, 'iife'))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('build/js'))
);

gulp.task('build', gulp.series('clean', gulp.parallel('copy', 'html', 'styles', 'scripts')));

gulp.task('serve', gulp.parallel(browserSync, watchFiles));

function browserSync(done) {
  server.init({
    server: {
      baseDir: 'build/'
    },
    port: 3000
  });
  done();
}

function browserSyncReload(done) {
  server.reload();
  done();
}

function watchFiles() {
  gulp.watch('source/js/**/*.js', gulp.series('scripts', browserSyncReload));
  gulp.watch('source/sass/**/*.scss', gulp.series('styles', browserSyncReload));
  gulp.watch('source/*.html', gulp.series('html', browserSyncReload));
}

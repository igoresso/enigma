'use strict';

const gulp = require('gulp');
const clean = require('gulp-clean');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('@rollup/stream');
const babel = require('@rollup/plugin-babel').default;
const minify = require('gulp-babel-minify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const csso = require('gulp-csso');
const autoprefixer = require('autoprefixer');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');

// Clean task to delete the build directory
gulp.task('clean', () => gulp.src('build', { read: false, allowEmpty: true }).pipe(clean()));

// Copy task for fonts and images
gulp.task('copy', () =>
  gulp
    .src(['source/fonts/**/*.{woff,woff2}', 'source/img/**'], {
      base: 'source',
    })
    .pipe(gulp.dest('build')),
);

// HTML task to process HTML files with PostHTML
gulp.task('html', () =>
  gulp
    .src('source/*.html')
    .pipe(plumber())
    .pipe(posthtml([include()]))
    .pipe(gulp.dest('build')),
);

// Styles task to compile SCSS to CSS with sourcemaps and PostCSS
gulp.task('styles', () =>
  gulp
    .src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('build/css'))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css')),
);

// Scripts task to bundle JS files with Rollup and Babel
gulp.task('scripts', () =>
  rollup({
    input: 'source/js/main.js',
    plugins: [babel()],
    output: {
      format: 'iife',
      sourcemap: true, // Rollup will generate source maps
    },
  })
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(minify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/js')),
);

// Build task to run clean, copy, html, styles, and scripts in series
gulp.task('build', gulp.series('clean', gulp.parallel('copy', 'html', 'styles', 'scripts')));

// Serve task to start a development server with BrowserSync and watch for changes
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: 'build/',
    },
    port: 3000,
  });

  gulp.watch('source/js/**/*.js', gulp.series('scripts', browserSync.reload));
  gulp.watch('source/sass/**/*.scss', gulp.series('styles', browserSync.reload));
  gulp.watch('source/*.html', gulp.series('html', browserSync.reload));
});

// Default task to build and serve the project
gulp.task('default', gulp.series('build', 'serve'));

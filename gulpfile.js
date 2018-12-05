"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const autoprefixer = require("autoprefixer");
const minify = require("gulp-csso");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const server = require("browser-sync").create();
const del = require("del");

gulp.task("clean", clean);
gulp.task("copy", copy);
gulp.task("images", images);
gulp.task("html", html);
gulp.task("style", style);

gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("copy", "style", "html"))
);

gulp.task("serve", gulp.parallel(watchFiles, browserSync));

function clean() {
  return del("build");
};

function copy() {
  return gulp
    .src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/js/**"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
};

function images() {
  return gulp
    .src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
}

function style() {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
}

function html() {
  return gulp
    .src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
};

function browserSync(done) {
  server.init({
    server: {
      baseDir: "build/"
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
  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series(style, browserSyncReload));
  gulp.watch("source/*.html", gulp.series(html, browserSyncReload));
}

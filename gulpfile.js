//require gulp and other dependencies
'use strict';
var gulp = require('gulp'),
    fs = require('fs'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    nunjucksRender = require('gulp-nunjucks-render'),
    browserSync = require('browser-sync').create(),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    awspublish = require('gulp-awspublish'),
    data = require('gulp-data');

//html templating using nunjucks task
gulp.task('nunjucks', function() {
  nunjucksRender.nunjucks.configure(['templates/']);
  // Gets .html and .nunjucks files in pages
  return gulp.src('pages/**/*.+(html|nunjucks)')
  //import data to nunjucks file
  .pipe(nunjucksRender())
  .pipe(gulp.dest('./public/'));
});

//scripts task
gulp.task('scripts', function() {
  return gulp.src('./src/scripts/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./public/static/js/'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./public/static/js/'));
});

// styles task
gulp.task('styles', function() {
  return gulp.src('./src/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/static/css/'))
    .pipe(autoprefixer('last 2 version'))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./public/static/css/'));
});

//compress images
gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./public/static/img/'));
});

//clean out static folder
gulp.task('clean', function(cb) {
    del(['static/css', 'static/js', 'static/img'], cb)
});

gulp.task('build', ['styles', 'scripts', 'nunjucks' ]);

//publish to AWS S3
gulp.task('deploy', ['build'], function () {

  //create a new publisher
  var publisher = awspublish.create(JSON.parse(fs.readFileSync('./aws.json')));
  // define custom headers
  var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };

  return gulp.src('./public/**/*')
    .pipe(awspublish.gzip({ ext: '' }))
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

// watch task
gulp.task('watch', function() {
  
  browserSync.init({
    notify: false,
    files: ['public/static/**/*.{js,css}'],
    server: {baseDir: "./public/"}
  });

  gulp.watch('./pages/**/*.nunjucks', ['nunjucks']);
  gulp.watch('./templates/**/*.nunjucks', ['nunjucks']);
  gulp.watch('./src/scripts/*.js', ['scripts']);
  gulp.watch('./src/styles/*.scss', ['styles']);
  gulp.watch('./src/images/**/*', ['images']);
});

//default task, called when run 'gulp' from terminal
gulp.task('default', ['watch']);

var gulp    = require('gulp');
var plumber = require('gulp-plumber');
var stylus  = require('gulp-stylus');
var nib     = require('nib');
var config  = require('../config').stylus;

gulp.task('stylus', function() {
    return gulp.src(config.src)
        .pipe(plumber())
        .pipe(stylus({use: nib()}))
        .pipe(gulp.dest(config.dest));
});

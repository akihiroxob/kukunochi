var gulp    = require('gulp');
var watch   = require('gulp-watch');
var config  = require('../config');

gulp.task('watch', function() {
    console.log(config.watch.js)
    watch(config.watch.js, function(){
        gulp.start(['build']);
    });
});

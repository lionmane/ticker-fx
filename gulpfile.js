var gulp = require('gulp');
var uglifyJS = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

// ----
// DEVELOPMENT Tasks

gulp.task('js-minified', function(){
    return gulp.src('tickerfx.js')
        .pipe(uglifyJS())
        .pipe(concat('tickerfx.min.js'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('js', function(){
    return gulp.src('tickerfx.js')
        .pipe(sourcemaps.init())
        .pipe(concat('tickerfx.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/'))
});

// ----
// TARGETS

gulp.task('default', [ 'js-minified', 'js' ]);
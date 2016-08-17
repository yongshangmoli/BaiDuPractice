var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('styles', function() {
  var sources = gulp.src(['scss/**.scss','!scss/main.scss'], {read: false});
  return gulp.src('scss/main.scss')
        .pipe(inject(sources, {
            starttag: '//inject:scss',
            endtag: '//endinject',
            transform: function (filepath) {
              return '@import"' + filepath + '";';
            },
            addRootSlash: false
          }))
        .pipe(gulp.dest('scss'))
        .pipe(sass())//编译scss到css文件夹
        .pipe(gulp.dest('css'))
        .pipe(cssnano())//压缩css文件夹到css文件夹
        .pipe(rename({
            suffix: ".min"
        }))
         .pipe(gulp.dest('css'));
});

gulp.task('inject',function(){
  var target = gulp.src('./index.html');
  var sources = gulp.src('./css/**.min.css',{read: false});
  return target.pipe(inject(sources,{relative:true}))
      .pipe(gulp.dest(''))
});

gulp.task('clean',function(){
  del(['css/main.css']).then(paths => {
  console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

gulp.task('default',function(){
  runSequence('clean','styles','inject','clean');
})

gulp.task('watch',['styles'], function (){
  gulp.watch('scss/**.scss', ['styles']);
});

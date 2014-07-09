var gulp         = require('gulp')
var less         = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer')
var cssmin       = require('gulp-cssmin')
var uglify       = require('gulp-uglify')
var imagemin     = require('gulp-imagemin')
var processhtml  = require('gulp-processhtml')
var htmlmin      = require('gulp-htmlmin')
var nodemon      = require('gulp-nodemon')
var concat       = require('gulp-concat')

gulp.task('scripts', function () {
  gulp.src('src/js/*.js')
  .pipe(uglify())
  .pipe(concat('all.js', {newLine: '\r\n'}))
  .pipe(gulp.dest('build/js/'))
})

gulp.task('styles', function () {
  gulp.src('src/less/styles.less')
  .pipe(less('styles.css'))
  .pipe(autoprefixer())
  .pipe(gulp.dest('src/css/'))
  .pipe(cssmin())
  .pipe(gulp.dest('build/css/'))
})

gulp.task('images', function () {
  gulp.src('src/images/**/*')
  .pipe(imagemin({ progressive: true, svgoPlugins: [{removeViewBox: false}] }))
  .pipe(gulp.dest('build/images/'))
})

gulp.task('html', function () {
  gulp.src('src/*.html')
  .pipe(processhtml('index.html'))
  .pipe(htmlmin('index.html'))
  .pipe(gulp.dest('build/'))
})

gulp.task('watch', function () {
  gulp.watch('src/js/*.js', ['scripts'])
  gulp.watch('src/less/*.less', ['styles'])
  gulp.watch('src/images/**/*', ['images'])
  gulp.watch('src/*.html', ['html'])
})

gulp.task('server', function () {
  nodemon({
    script: 'server.js'
  , ext: 'html js'
  , env: { 'NODE_ENV': 'development' }
  , ignore: ['build/**']
  })
  .on('restart', function () {
    console.log('restarted!')
  })
})

gulp.task('default', ['scripts', 'styles', 'images', 'html', 'watch', 'server'])

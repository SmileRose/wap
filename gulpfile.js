/*!
 * step1: npm install gulp -g 进行全局安装
 * step2: gulp -v 检测安装情况
 * step3: npm init 进行package.json配置
 * step4: npm install gulp --save-dev  本地安装（生成node_modules文件夹）
 * step5 gulp -v 检测安装情况 （正常情况应该包含本地和全局两个信息）
 * *
 * $ npm install gulp-ruby-sass gulp-sass gulp-autoprefixer gulp-minify-css gulp-imagemin imagemin-pngquant gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-rev-append gulp-utf8-convert gulp-cache del  gulp-htmlmin  browser-sync --save-dev
 */
// Load plugins
//css
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    // jshint = require('gulp-jshint'),
    //img
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    //js
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rev = require('gulp-rev-append'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del'),
    utf8Convert = require('gulp-utf8-convert');
   var browserSync = require('browser-sync').create();
// fileinclude = require('gulp-file-include'),// include 文件用
//  template = require('gulp-template'),//替换变量以及动态html用
// css
gulp.task('css', function() {
    return sass('src/**/*.scss', { style: 'expanded' }) //以expand当时进行编译sass
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')) //给编译的sass添加前缀
        .pipe(utf8Convert()) //转化成utf-8编码， 可以省略
        .pipe(gulp.dest('dist/')) //保存到目标文件夹dist下
        .pipe(rename({ suffix: '.min' })) //重命名
        .pipe(minifycss({  //压缩css
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('dist/')) //保存
        .pipe(notify({ message: 'css task complete' }))
        .pipe(browserSync.stream()); //浏览器进行刷新
});
// js
gulp.task('js', function() {
    return gulp.src('src/**/*.js')
        //   .pipe(jshint())
        //  .pipe(jshint.reporter('default')) // 输出检查结果
        .pipe(gulp.dest('dist/js'))
        .pipe(concat('main.js')) //让所有的js压缩到main里面
        .pipe(gulp.dest('dist/js')) //保存到js目录下
        .pipe(uglify()) //压缩
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'js task complete' }))
        .pipe(browserSync.stream()); //浏览器进行刷新
});
// img
gulp.task('img', function() {
    return gulp.src('src/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            //  use: [pngquant()] //使用pngquant来压缩png图片
        })))
        .pipe(gulp.dest('dist/'))
        .pipe(notify({ message: 'img task complete' }))
        .pipe(browserSync.stream()); //浏览器进行刷新
});
//html
gulp.task('html', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src('src/html/*.html')
        .pipe(rev()) //版本控制
        .pipe(gulp.dest('dist/html'))
         .pipe(htmlmin(options)) //压缩html文件
         .pipe(gulp.dest('dist/html/min'))
        .pipe(notify({ message: 'html task complete' }))
        .pipe(browserSync.stream()); //浏览器进行刷新
});
// Clean
gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/img', 'dist/html'], cb)
});
// Default task
gulp.task('default', ['watch'], function() {
    gulp.start('css', 'js', 'img', 'html');
});
// Watch
gulp.task('watch', ["html", "css" , "js" , "img"], function() {
    browserSync.init({
            server : "./"
        });
    gulp.watch('src/**/*.scss', ['css']);
    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/img/*', ['img']);
    gulp.watch('src/**/*.html', ['html']);
    // livereload.listen();
    // gulp.watch(['dist/**']).on('change', livereload.changed);
   gulp.watch(['dist/**']).on('change', browserSync.reload); //浏览器刷新
});

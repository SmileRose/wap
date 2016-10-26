/*!
 * step1: npm install gulp -g 进行全局安装
 * step2: gulp -v 检测安装情况
 * step3: npm init 进行package.json配置
 * step4: npm install gulp --save-dev  本地安装（生成node_modules文件夹）
 * step5 gulp -v 检测安装情况 （正常情况应该包含本地和全局两个信息）
 * *
 * $ npm install gulp-ruby-sass gulp-sass gulp-autoprefixer gulp-minify-css gulp-imagemin imagemin-pngquant gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-rev-append gulp-utf8-convert gulp-cache del  gulp-htmlmin  browser-sync gulp-file-include jshint gulp-jshint --save-dev
 使用npm install --save-dev jshint gulp-jshint
 */
// Load plugins
//css
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'), //sass
    autoprefixer = require('gulp-autoprefixer'), //各大浏览器前缀
    minifycss = require('gulp-minify-css'), //压缩css

    //img
    imagemin = require('gulp-imagemin'), //压缩img
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'), //中命名
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    //js

    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rev = require('gulp-rev-append'), //页面的引用添加版本号，清除页面引用缓存
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del'),
    fileinclude = require('gulp-file-include'), // include 文件用
    utf8Convert = require('gulp-utf8-convert');
var browserSync = require('browser-sync').create(); //浏览器刷新必备
fileinclude = require('gulp-file-include'), // include 文件用
    //  template = require('gulp-template'),//替换变量以及动态html用
    // css
    gulp.task('css', function() {
        return sass('src/**/*.scss', { style: 'expanded' }) //以expand当时进行编译sass
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')) //给编译的sass添加前缀
            .pipe(utf8Convert()) //转化成utf-8编码， 可以省略
            .pipe(gulp.dest('dist/')) //保存到目标文件夹dist下
            .pipe(rename({ suffix: '.min' })) //重命名
            .pipe(minifycss({ //压缩css
                keepSpecialComments: 0
            }))
            .pipe(gulp.dest('dist/')) //保存
            .pipe(notify({ message: 'css task complete' }))
            .pipe(browserSync.stream()); //浏览器进行刷新
    });
// js
gulp.task('js', function() {
    return gulp.src('src/**/*.js')
          .pipe(jshint())
        .pipe(jshint.reporter('default')) // 输出检查结果
        .pipe(gulp.dest('dist/'))

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
    return gulp.src('src/img/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({ //只修改改变过的图片
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest('dist/img/'))
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
        .pipe(fileinclude({ //include文件
            prefix: '@@',
            basepath: '@file'
        }))
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
gulp.task('watch', ["html", "css", "js", "img"], function() {
    browserSync.init({
        server: "./"
    });
    gulp.watch('src/**/*.scss', ['css']);
    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/img/*', ['img']);
    gulp.watch('src/**/*.html', ['html']);
    // livereload.listen();
    // gulp.watch(['dist/**']).on('change', livereload.changed);
    gulp.watch(['dist/**']).on('change', browserSync.reload); //浏览器刷新
});

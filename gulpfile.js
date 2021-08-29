//gulp new version
const gulp = require('gulp'),
    htmlExtend = require('gulp-html-extend'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat');
//uglify=require('gulp-uglify');


const BABEL_POLYFILL = 'node_modules/babel-polyfill/dist/polyfill.js';

const plugin=require('./plugin');


var directory = {
    src: './src',
    public: './public'
};

//directory.views = directory.app.concat('/views');
//directory.styles = directory.app.concat('/styles');
//directory.scripts = directory.app.concat('/scripts');
directory.assets = directory.public.concat('/assets');
directory.components = directory.assets.concat('/components');

directory.destination = {
    styles: directory.assets.concat('/css'),
    scripts: directory.assets.concat('/js')
};


function views(cb) {
    cb();
    return gulp.src('./src/views/*.html')
        .pipe(htmlExtend({annotations: true, verbose: false}))
        .pipe(gulp.dest('./public'));
}

function styles(cb) {
    cb();
    return gulp.src('./src/styles/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        //.pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./public/assets/css'));
}

function scripts(cb) {
    cb();
    return gulp.src(
        [BABEL_POLYFILL,
            './src/scripts/scripts.js'
        ])
        .pipe(concat('scripts.js'))
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('./public/assets/js'))

}


function components(){
    console.log("here");
    return gulp.src(plugin.styles.map(function (path){return directory.components.concat(path)}))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('components.css'))
        .pipe(gulp.dest(directory.destination.styles))
}

exports.default = function () {
    gulp.task(components());
    gulp.watch('./src/views/**/*.html', views);
    gulp.watch('./src/styles/**/*.scss', gulp.series(styles));
    gulp.watch('./src/styles/*.css', gulp.series(styles));
    gulp.watch('./src/scripts/scripts.js', gulp.series(scripts));
}
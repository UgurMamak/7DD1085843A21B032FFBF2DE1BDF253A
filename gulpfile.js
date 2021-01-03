var gulp = require('gulp'),
    babel = require('gulp-babel'),
    gulpif = require('gulp-if'),
    gulpIgnore = require('gulp-ignore'),
    rename = require("gulp-rename"),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    minifyJs = require('gulp-uglify'),//Js minimize eder.
    minifyCss = require('gulp-clean-css'),//Css minimize eder.
    sourceMaps = require('gulp-sourcemaps'),
    extend = require('gulp-html-extend'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

var browserSync = require('browser-sync').create();

var fileExtensions = {
    styles: "/**/*.scss",
    scripts: "/**/*.js",
    views: "/**/*.html"
}

var argv = require('yargs').argv;

var directory = {
    src: './src',
    public: './public',
};

var plugin=require('./plugin');

//kaynak dizinler
directory.views = directory.src.concat('/views');
directory.styles = directory.src.concat('/styles');
directory.scripts = directory.src.concat('/scripts');

directory.assets = directory.public.concat('/assets');
directory.components = directory.assets.concat('/components');


//varış dizini
directory.destination = {
    styles: directory.assets.concat('/css'),
    scripts: directory.assets.concat('/js')
};

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: directory.public
        }
    });
});

gulp.task('views', function () {
    return gulp.src(directory.views.concat('/*.html'))//view içindeki html dosyaları alt dizinledeki html dosyalarını oluşturmadık.
        .pipe(extend({annotations: false, verbose: false}))
        .pipe(gulp.dest(directory.public));
});

gulp.task('styles', function () {
    return gulp.src(directory.styles.concat("/styles.scss"))
        .pipe(gulpif(argv.sourceMaps, sourceMaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulpif(argv.sourceMaps, sourceMaps.write()))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(directory.destination.styles))

        //production
        .pipe(gulpIgnore.exclude(!argv.production))
        .pipe(minifyCss({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(directory.destination.styles))
        .pipe(browserSync.stream());


});

gulp.task('scripts', function () {
    return gulp.src(directory.scripts.concat(fileExtensions.scripts))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat("scripts.js"))
        .pipe(gulp.dest(directory.destination.scripts))

        //Production
        .pipe(gulpIgnore.exclude(!argv.production))
        .pipe(minifyJs())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(directory.destination.scripts))
        .pipe(browserSync.stream());

});

//components eksik (dosya yollarında ayarlama yapamam lazım merger katmanının  amacı bu)
gulp.task('components',function (){
   // gulp.src(config.components.styles.files.map(function(path){ return directory.components.concat(path); }))
    //style files

    //script files
    //gulp.src([...plugin.components.scripts.files.map(function(path){ return directory.components.concat(path); }), directory.scripts.concat('/bootstrap/bootstrap.bundle.min.js')])
  return   gulp.src(plugin.components.scripts.files.map(function (path){return directory.components.concat(path);}))
        .pipe(concat(plugin.components.scripts.concat))
        .pipe(gulp.dest(directory.destination.scripts))

        // Production
        .pipe(gulpIgnore.exclude(!argv.production))
        .pipe(minifyJs())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(directory.destination.scripts));

});

gulp.task("start", function () {

    //views
    gulp.watch(directory.views.concat(fileExtensions.views), gulp.series(['views']));

    //styles
    gulp.watch(directory.styles.concat(fileExtensions.styles), gulp.series(['styles']));

    //JS Files
    gulp.watch(directory.scripts.concat(fileExtensions.scripts), gulp.series(['scripts2']));

});


gulp.task('default',gulp.series(['start']));
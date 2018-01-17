"use strict";

var gulp        = require('gulp'),
	pug         = require('gulp-pug'),
	sass        = require('gulp-sass'),
	concat      = require('gulp-concat'),
	plumber     = require('gulp-plumber'),
	prefix      = require('gulp-autoprefixer'),
	imagemin    = require('gulp-imagemin'),
	browserSync = require('browser-sync').create();

var useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	cssmin = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	rimraf = require('rimraf'),
	notify = require('gulp-notify');

var paths = {
			preDevDir: 'blocks/',
			devDir: 'app/',
			node: 'node_modules/',
			outputDir: 'dist/',
		};

/*********************************
		Developer tasks
*********************************/

//move 
gulp.task('move', function(){
	return gulp.src([paths.node +'bootstrap/**/*'])
	.pipe(gulp.dest(paths.preDevDir + 'bootstrap'))
});

//pug compile
gulp.task('pug', function() {
	return gulp.src([paths.preDevDir + '*.pug'])
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(paths.devDir))
		.pipe(browserSync.stream())
});

//sass compile
gulp.task('sass', function() {
	return gulp.src(paths.preDevDir + 'styles/**/*')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix({
			browsers: ['last 10 versions'],
			cascade: true
		}))
		.pipe(gulp.dest(paths.devDir + 'css/'))
		.pipe(browserSync.stream());
});

//js compile
gulp.task('scripts', function() {
	return gulp.src([
			paths.preDevDir + 'js/main.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.devDir + 'js/'))
		.pipe(browserSync.stream());
});

//watch
gulp.task('watch', function() {
	gulp.watch(paths.preDevDir + '**/*.pug', ['pug']);
	gulp.watch(paths.preDevDir + 'styles/**/*', ['sass']);
	gulp.watch(paths.preDevDir + 'js/**/*.js', ['scripts']);
});

//server
gulp.task('browser-sync', function() {
	browserSync.init({
		port: 3000,
		server: {
			baseDir: paths.devDir
		},
		notify: false
	});
});

/*********************************
		Production tasks
*********************************/

//clean
gulp.task('clean', function(cb) {
	rimraf(paths.outputDir, cb);
});

//css 
gulp.task('build', ['clean'], function () {
	return gulp.src(paths.devDir + '*.html')
		.pipe( useref() )
		.pipe( gulpif('*.js', uglify()) )
		.pipe( gulpif('*.css', cssmin()) )
		.pipe( gulp.dest(paths.outputDir) );
});

//copy images to outputDir
gulp.task('imgBuild', ['clean'], function() {
	return gulp.src(paths.devDir + 'images/**')
		.pipe(imagemin())
		.pipe(gulp.dest(paths.outputDir + 'images/'));
});


//default
gulp.task('default', ['move', 'pug', 'sass', 'scripts', 'browser-sync', 'watch' ]);

//production
gulp.task('prod', ['build', 'imgBuild']);


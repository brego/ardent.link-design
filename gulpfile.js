(function() {
	'use strict';

	var gulp = require('gulp'),
		$    = require('gulp-load-plugins')({
			pattern: [
				'gulp-*', 'gulp.*', 'del', 'mkdirp'
			],
			rename: {
				'gulp-scss-lint': 'sassLint'
			}
		});

	gulp.task('default', ['watch']);

	/**
	 * Watcher tasks
	 */

	gulp.task('watch', [
		'lint:scripts', 'build:scripts', 'lint:styles', 'build:styles'
	], function() {
		gulp.watch('source/scripts/**/*.js', [
			'lint:scripts', 'build:scripts'
		])
			.on('change', function() { console.log('\n\n'); });
		gulp.watch('source/stylesheets/**/*.scss', [
			'lint:styles', 'build:styles'
		])
			.on('change', function() { console.log('\n\n'); });
	});

	/**
	 * Build tasks
	 */

	gulp.task('build', [
		'build:scripts', 'build:styles', 'build:assets'
	]);

	gulp.task('build:scripts', ['lint:scripts'], function() {
		gulp.src('source/scripts/**/*.js')
			.pipe($.changed('build/scripts'))
			.pipe($.sourcemaps.init())
			.pipe($.uglify())
			.pipe($.rev())
			.pipe($.sourcemaps.write('.'))
			.pipe(gulp.dest('build/scripts'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest('build/scripts'));
	});

	gulp.task('build:styles', ['lint:styles'], function() {
		gulp.src('source/stylesheets/**/*.scss')
			.pipe($.changed('build/stylesheets'))
			.pipe($.sourcemaps.init())
			.pipe($.sass({
				style: 'compressed',
				includePaths: require('node-bourbon').includePaths
			}))
			.pipe($.autoprefixer())
			.pipe($.minifyCss())
			.pipe($.rev())
			.pipe($.sourcemaps.write('.'))
			.pipe(gulp.dest('build/stylesheets'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest('build/stylesheets'));
	});

	gulp.task('build:assets', function() {
		gulp.src([
			'source/*.ico',
			'source/*.png',
			'source/*.xml'
		])
			.pipe($.changed('build/'))
			.pipe(gulp.dest('build/'));

		gulp.src(['source/fonts/*', '!**/fontello-config.json'])
			.pipe($.changed('build/fonts'))
			.pipe($.rev())
			.pipe(gulp.dest('build/fonts'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest('build/fonts'));

		gulp.src('source/images/*')
			.pipe($.changed('build/images'))
			.pipe($.rev())
			.pipe(gulp.dest('build/images'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest('build/images'));
	});

	/**
	 * Lint tasks
	 */

	gulp.task('lint:scripts', function() {
		return gulp.src(['source/scripts/**/*.js', '!**/external/*.js'])
			.pipe($.jshint())
			.pipe($.jshint.reporter('jshint-stylish'))
			.pipe($.jshint.reporter('fail'));
	});

	gulp.task('lint:styles', function() {
		return gulp.src(['source/stylesheets/**/*.scss', '!**/_reset.scss'])
			.pipe($.sassLint({
				config: '.scss-lint.yml'
			}))
			.pipe($.sassLint.failReporter());
	});

	/**
	 * Cleanup tasks
	 */

	gulp.task('clean', function(callback) {
		$.del('build/');
		$.mkdirp('build/');
		callback();
	});

	gulp.task('clean:assets', function() {
		return $.del([
			'build/*.ico',
			'build/*.png',
			'build/*.xml',
			'build/fonts/*',
			'build/fonts/',
			'build/images/*',
			'build/images/'
		]);
	});

	gulp.task('clean:styles', function() {
		return $.del(['build/stylesheets/*']);
	});

	gulp.task('clean:scripts', function() {
		return $.del(['build/scripts/*']);
	});

})();

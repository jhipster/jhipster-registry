// Generated on 2016-06-06 using generator-jhipster 3.4.0
'use strict';

var gulp = require('gulp'),
    rev = require('gulp-rev'),
    templateCache = require('gulp-angular-templatecache'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    ngConstant = require('gulp-ng-constant'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    argv = require('yargs').argv,
    gutil = require('gulp-util'),
    protractor = require('gulp-protractor').protractor,
    es = require('event-stream'),
    flatten = require('gulp-flatten'),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    KarmaServer = require('karma').Server,
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    gulpIf = require('gulp-if'),
    inject = require('gulp-inject'),
    angularFilesort = require('gulp-angular-filesort'),
    naturalSort = require('gulp-natural-sort'),
    bowerFiles = require('main-bower-files');

var handleErrors = require('./gulp/handleErrors'),
    serve = require('./gulp/serve'),
    util = require('./gulp/utils'),
    build = require('./gulp/build');


var config = require('./gulp/config');

gulp.task('clean', function () {
    return del([config.dist], { dot: true });
});

gulp.task('copy', function () {
    return es.merge(
        gulp.src(config.bower + 'bootswatch-dist/fonts/*.*')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.dist + 'content/fonts/'))
        .pipe(rev())
        .pipe(gulp.dest(config.dist + 'content/fonts/'))
        .pipe(rev.manifest(config.revManifest, {
            base: config.dist,
            merge: true
        }))
        .pipe(gulp.dest(config.dist)),
        gulp.src(config.app + 'content/**/*.{woff,woff2,svg,ttf,eot,otf}')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.dist + 'content/fonts/'))
        .pipe(flatten())
        .pipe(rev())
        .pipe(gulp.dest(config.dist + 'content/fonts/'))
        .pipe(rev.manifest(config.revManifest, {
            base: config.dist,
            merge: true
        }))
        .pipe(gulp.dest(config.dist)),
        gulp.src([config.app + 'robots.txt', config.app + 'favicon.ico', config.app + '.htaccess'], { dot: true })
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.dist))
        .pipe(gulp.dest(config.dist))
    );
});

gulp.task('images', function () {
    return gulp.src(config.app + 'content/images/**')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.dist + 'content/images'))
        .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
        .pipe(rev())
        .pipe(gulp.dest(config.dist + 'content/images'))
        .pipe(rev.manifest(config.revManifest, {
            base: config.dist,
            merge: true
        }))
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.reload({stream: true}));
});



gulp.task('styles', [], function () {
    return gulp.src(config.app + 'content/css')
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('inject', ['inject:dep', 'inject:app']);
gulp.task('inject:dep', ['inject:test', 'inject:vendor']);

gulp.task('inject:app', function () {
    return gulp.src(config.app + 'index.html')
        .pipe(inject(gulp.src(config.app + 'app/**/*.js')
            .pipe(naturalSort())
            .pipe(angularFilesort()), {relative: true}))
        .pipe(gulp.dest(config.app));
});

gulp.task('inject:vendor', function () {
    var stream = gulp.src(config.app + 'index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {
            name: 'bower',
            relative: true
        }))
        .pipe(gulp.dest(config.app));

    return stream;
});

gulp.task('inject:test', function () {
    return gulp.src(config.test + 'karma.conf.js')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(gulp.src(bowerFiles({includeDev: true, filter: ['**/*.js']}), {read: false}), {
            starttag: '// bower:js',
            endtag: '// endbower',
            transform: function (filepath) {
                return '\'' + filepath.substring(1, filepath.length) + '\',';
            }
        }))
        .pipe(gulp.dest(config.test));
});

gulp.task('inject:troubleshoot', function () {
    /* this task removes the troubleshooting content from index.html*/
    return gulp.src(config.app + 'index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        /* having empty src as we dont have to read any files*/
        .pipe(inject(gulp.src('', {read: false}), {
            starttag: '<!-- inject:troubleshoot -->',
            removeTags: true,
            transform: function () {
                return '<!-- Angular views -->';
            }
        }))
        .pipe(gulp.dest(config.app));
});

gulp.task('assets:prod', ['images', 'styles', 'html'], build);

gulp.task('html', function () {
    return gulp.src(config.app + 'app/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateCache({
            module: 'JHipsterRegistryApp',
            root: 'app/',
            moduleSystem: 'IIFE'
        }))
        .pipe(gulp.dest(config.tmp));
});

gulp.task('ngconstant:dev', function () {
    return ngConstant({
        name: 'JHipsterRegistryApp',
        constants: {
            VERSION: util.parseVersion(),
            DEBUG_INFO_ENABLED: true
        },
        template: config.constantTemplate,
        stream: true
    })
    .pipe(rename('app.constants.js'))
    .pipe(gulp.dest(config.app + 'app/'));
});

gulp.task('ngconstant:prod', function () {
    return ngConstant({
        name: 'JHipsterRegistryApp',
        constants: {
            VERSION: util.parseVersion(),
            DEBUG_INFO_ENABLED: false
        },
        template: config.constantTemplate,
        stream: true
    })
    .pipe(rename('app.constants.js'))
    .pipe(gulp.dest(config.app + 'app/'));
});

// check app for eslint errors
gulp.task('eslint', function () {
    return gulp.src(['gulpfile.js', config.app + 'app/**/*.js'])
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

// check app for eslint errors anf fix some of them
gulp.task('eslint:fix', function () {
    return gulp.src(config.app + 'app/**/*.js')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(gulpIf(util.isLintFixed, gulp.dest(config.app + 'app')));
});

gulp.task('test', ['inject:test', 'ngconstant:dev'], function (done) {
    new KarmaServer({
        configFile: __dirname + '/' + config.test + 'karma.conf.js',
        singleRun: true
    }, done).start();
});

/* to run individual suites pass `gulp itest --suite suiteName` */
gulp.task('protractor', function () {
    var configObj = {
        configFile: config.test + 'protractor.conf.js'
    };
    if (argv.suite) {
        configObj['args'] = ['--suite', argv.suite];
    }
    return gulp.src([])
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(protractor(configObj))
        .on('error', function () {
            gutil.log('E2E Tests failed');
            process.exit(1);
        });
});

gulp.task('itest', ['protractor']);

gulp.task('watch', function () {
    gulp.watch('bower.json', ['install']);
    gulp.watch(['gulpfile.js', 'pom.xml'], ['ngconstant:dev']);
    gulp.watch(config.app + 'content/css/**/*.css', ['styles']);
    gulp.watch(config.app + 'content/images/**', ['images']);
    gulp.watch(config.app + 'app/**/*.js', ['inject:app']);
    gulp.watch([config.app + '*.html', config.app + 'app/**', config.app + 'i18n/**']).on('change', browserSync.reload);
});

gulp.task('install', function () {
    runSequence(['inject:dep', 'ngconstant:dev'], 'inject:app', 'inject:troubleshoot');
});

gulp.task('serve', function () {
    runSequence('install', serve);
});

gulp.task('build', ['clean'], function (cb) {
    runSequence(['copy', 'inject:vendor', 'ngconstant:prod'], 'inject:app', 'inject:troubleshoot', 'assets:prod', cb);
});

gulp.task('default', ['serve']);

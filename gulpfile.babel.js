require('babel-register')();

import gulp from 'gulp';
import {exec} from 'child_process';
import fs from 'fs';
import path from 'path';

import gulpLoadPlugins from 'gulp-load-plugins';
import browserify from 'browserify';
import babelify from 'babelify';
import del from 'del';
import Promise from 'bluebird';
import srcStream from 'vinyl-source-stream';
const $ = gulpLoadPlugins();
const pkg = JSON.parse(fs.readFileSync('./package.json'));

function lint(files, options) {
    return () => {
        return gulp.src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
    };
}

gulp.task('clean', del.bind(null, ['build', `${pkg.name}-*.tgz`]));

gulp.task('lint', lint(['src/{,*/}*.js{,x}']));

gulp.task('npmpack', ['build'], () => {
    return new Promise((resolve, reject) => {
        exec('npm pack', (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout.toString());
            }
        });
    });
});

gulp.task('demoInstall', ['npmpack'], () => {
    return new Promise((resolve, reject) => {
        exec(`npm install ../${pkg.name}-${pkg.version}.tgz`, {
            cwd: path.join(__dirname, 'example')
        }, (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout.toString());
            }
        });
    });
});

gulp.task('demoBuild', ['demoInstall'], () => {
    return browserify({
        entries: 'example/demo.jsx',
        debug: true,
        transform: [babelify]
    }).bundle()
    .pipe(srcStream('demo.bundle.js'))
    .pipe(gulp.dest('example'));

});

gulp.task('demo', ['demoBuild', 'watch'], () => {
    return $.connect.server({
        root: 'example',
        livereload: true
    });
});

gulp.task('watch', () => {
    return gulp.watch(['example/*.html', 'src/{,*/}*.js{,x}', 'example/demo.jsx'], ['demoBuild']);
});

gulp.task('build', ['clean', 'lint'], () => {

    return gulp.src('src/{,*/}*.js{,x}')
        .pipe($.plumber())
        .pipe($.babel())
        .pipe(gulp.dest('build/'));
});

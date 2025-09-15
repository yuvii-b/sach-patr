const path = require('path');
const { src, dest, series, parallel } = require('gulp');
const sass = require('gulp-dart-sass');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

module.exports = (conf) => {

  // ------------------------
  // Build CSS
  // ------------------------
  const buildCssTask = function () {
    return src([
        '**/*.scss',         // include all SCSS
        '!**/_*.scss',       // exclude partials
        '!html/**/*',
        '!html-starter/**/*',
        '!html-demo/**/*',
        '!dist/**/*',
        '!build/**/*',
        '!assets/**/*',
        '!tasks/**/*',
        '!node_modules/**/*',
        '!_temp/**/*',
        '!node-script/**/*'
      ], { allowEmpty: true })
      .pipe(gulpIf(conf.sourcemaps, sourcemaps.init()))
      .pipe(
        sass({ outputStyle: conf.minify ? 'compressed' : 'expanded' }).on('error', sass.logError)
      )
      .pipe(gulpIf(conf.sourcemaps, sourcemaps.write()))
      .pipe(dest(path.join(conf.distPath, 'assets', 'css')))
      .pipe(browserSync.stream());
  };

  // ------------------------
  // Autoprefix CSS
  // ------------------------
  const buildAutoprefixCssTask = function () {
    return src([
        path.join(conf.distPath, 'assets', 'css', '*.css')
      ], { allowEmpty: true })
      .pipe(gulpIf(conf.sourcemaps, sourcemaps.init({ loadMaps: true })))
      .pipe(autoprefixer())
      .pipe(gulpIf(conf.sourcemaps, sourcemaps.write()))
      .pipe(dest(path.join(conf.distPath, 'assets', 'css')))
      .pipe(browserSync.stream());
  };

  // ------------------------
  // Build JS
  // ------------------------
  const buildJsTask = function (cb) {
    const webpack = require('webpack');
    const webpackConfig = require('../webpack.config');
    webpack(webpackConfig, (err, stats) => {
      if (err) return cb(err);
      console.log(stats.toString({ colors: true }));
      browserSync.reload();
      cb();
    });
  };

  // ------------------------
  // Build Fonts
  // ------------------------
  const FONT_TASKS = [
    { name: 'boxicons', path: 'node_modules/boxicons/fonts/*' }
  ].map(font => {
    const taskFn = function () {
      return src([font.path], { allowEmpty: true })
        .pipe(dest(path.join(conf.distPath, 'assets', 'fonts', font.name)));
    };
    Object.defineProperty(taskFn, 'name', { value: `buildFonts${font.name}` });
    return taskFn;
  });

  const buildFontsTask = parallel(...FONT_TASKS);

  // ------------------------
  // Copy other assets
  // ------------------------
  const buildCopyTask = function () {
    // Copy the entire assets directory preserving folder structure
    return src([
        'assets/**',
        '!assets/**/*.scss'
      ], { allowEmpty: true })
      .pipe(dest(path.join(conf.distPath, 'assets')));
  };

  // ------------------------
  // Build HTML
  // ------------------------
  const buildHtmlTask = function () {
    return src([
        path.join(conf.buildTemplatePath, '*.html'), // template HTML
        'index.html' // root index.html
      ], { allowEmpty: true })
      .pipe(dest(conf.distPath));
  };

  // ------------------------
  // Build All
  // ------------------------
  const buildAllTask = series(
    buildCssTask,
    buildAutoprefixCssTask,
    buildJsTask,
    buildFontsTask,
    buildCopyTask,
    buildHtmlTask
  );

  return {
    css: series(buildCssTask, buildAutoprefixCssTask),
    js: buildJsTask,
    fonts: buildFontsTask,
    copy: buildCopyTask,
    html: buildHtmlTask,
    all: buildAllTask
  };
};

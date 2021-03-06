# gulp-uglify-es
gulp stream to uglify with 'terser' (es6 supported).

terser is the new 'uglify-es'. uglify-es is no longer maintained.

## Install
npm install --save-dev gulp-uglify-es

## Usage
gulpfile.js
```js
let gulp = require("gulp");
let rename = require("gulp-rename");
let uglify = require('gulp-uglify-es').default;

gulp.task("uglify", function () {
	return gulp.src("lib/bundle.js")
		.pipe(rename("bundle.min.js"))
		.pipe(uglify(/* options */))
		.pipe(gulp.dest("lib/"));
});
```
For documentation about the options-object, See the [Uglify API Reference](https://www.npmjs.com/package/terser#api-reference).

## Source maps
To generate source maps, use [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps).  
Example:  
```js
let gulp = require("gulp");
let rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify-es').default;

gulp.task("uglify", function () {
	return gulp.src("lib/bundle.js")
		.pipe(rename("bundle.min.js"))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write()) // Inline source maps.
		// For external source map file:
		//.pipe(sourcemaps.write("./maps")) // In this case: lib/maps/bundle.min.js.map
		.pipe(gulp.dest("lib/"));
});
```
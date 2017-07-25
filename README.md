# gulp-ts-package
gulp stream to uglify with 'uglify-es' (es6 supported).

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
		.pipe(uglify(/* options */))
		.pipe(rename("bundle.min.js"))
		.pipe(gulp.dest("lib/"));
});
```
For documentation about the options-object, See [Uglify API Reference](https://www.npmjs.com/package/uglify-es#API_Reference).
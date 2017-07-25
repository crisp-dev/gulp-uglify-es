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
			.pipe(uglify())
			.pipe(rename("bundle.min.js"))
			.pipe(gulp.dest("bundles/"));
});
```
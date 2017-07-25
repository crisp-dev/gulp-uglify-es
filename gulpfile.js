"use strict";
let gulp = require("gulp");
let ts = require('gulp-typescript');
let del = require("del");
let changed = require("itay-gulp-changed");
let merge = require("merge2");

let paths = {
	tsconfig: "./src/tsconfig.json",
	tsGlob: "./src/**/*.ts",
	dest: "./lib",
};

gulp.task("test", () => {
	let uglify = require("./lib/index.js").default;
	let gutil = require("gulp-util");
	let rename = require("gulp-rename");

	return gulp.src("test/bundle.js")
		.pipe(uglify())
		.pipe(rename("bundle.min.js"))
		.pipe(gutil.buffer(function (err, files) {
			let bundleString = files[0].contents.toString();
			// console.log(files[0].path)
			// console.log(bundleString);

			if (bundleString.indexOf(`function(e,o)`) < 0) throw "Failed.";
		}));
});

gulp.task("build", function () {
	let tsProject = ts.createProject(paths.tsconfig, { declaration: true });

	let tsResult = gulp.src(paths.tsGlob)
		.pipe(changed())
		.pipe(tsProject());

	return merge([
		tsResult.dts
			.pipe(gulp.dest(paths.dest)),
		tsResult.js
			.pipe(gulp.dest(paths.dest))
	]);
});

gulp.task("clean", function () {
	return del([
		paths.dest + '**/*',
		"./.localStorage"
	]);
});
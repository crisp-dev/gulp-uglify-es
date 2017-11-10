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
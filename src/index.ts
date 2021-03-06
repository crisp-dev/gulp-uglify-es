import ObjectStream, { EnteredArgs, EndedArgs, Transform } from "o-stream";
import * as File from "vinyl";
import * as PluginError from "plugin-error";
const Uglify = require("terser");
const applySourceMap = require("vinyl-sourcemaps-apply");

const PLUGIN_NAME = "gulp-uglify-es";

export default function plugin(uglifyOptions?: any): Transform {
	return ObjectStream.transform({
		onEntered: (args: EnteredArgs<File, File>) => {
			let file = args.object;

			throwIfStream(file);

			if (file.isNull() || !file.contents) {
				args.output.push(file);
				return;
			}

			if (file.sourceMap) {
				uglifyOptions = setUglifySourceMapOptions(uglifyOptions, file);
			}

			let fileMap: any = {};
			fileMap[file.relative] = file.contents.toString();

			let result = Uglify.minify(fileMap, uglifyOptions);

			if (result.error) {
				throw new PluginError(PLUGIN_NAME, result.error);
			}

			file.contents = new Buffer(result.code);

			if (result.map) {
				applySourceMap(file, JSON.parse(result.map));
			}

			args.output.push(file);
		}
	});
}

function setUglifySourceMapOptions(uglifyOptions: any, file: File) {
	uglifyOptions = uglifyOptions || {};
	uglifyOptions.sourceMap = uglifyOptions.sourceMap || {};
	let sourceMap = uglifyOptions.sourceMap;

	// console.log(file.sourceMap);
	sourceMap.filename = file.sourceMap.file;
	sourceMap.includeSources = true;

	if (sourceMap.url !== undefined && sourceMap.url !== null) {
		sourceMap.url = undefined;
		console.warn("Uglify options.sourceMap.url should not be set. Deleting it.");
	}

	if (file.sourceMap.mappings) {
		sourceMap.content = file.sourceMap;
	}

	return uglifyOptions;
}

function throwIfStream(file: File) {
	if (file.isStream()) {
		throw new PluginError(PLUGIN_NAME, 'Streams are not supported.');
	}
}

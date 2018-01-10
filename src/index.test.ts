import { TestParams, TestSuite } from "just-test-api";
import { expect } from "chai";
import ObjectStream, { Transform } from "o-stream";
import plugin from "./index";
import * as sourcemaps from "gulp-sourcemaps";
const Vinyl = require("vinyl");

const FILE_PATH = "bundle.js";
const FILE_MIN_PATH = "bundle.min.js";
const FILE_TEXT = "class MyClass { constructor() { let asdf = 1; console.info(asdf); } }";
const FILE_TEXT_UGLIFIED = "class MyClass{constructor(){console.info(1)}}";

export default function (suite: TestSuite): void {
	suite.test("When recieves a valid file, then uglify it.", async test => {
		test.arrange();
		let stream = plugin();
		let file = createGulpTextFile(FILE_TEXT);

		test.act();
		stream.write(file);
		let actual = stream.read();

		test.assert();
		expect(stream.read()).to.be.null;
		expect(actual.contents.toString()).to.equal(FILE_TEXT_UGLIFIED);
	});

	suite.test("When recieves a file without contents, then pass through.", test => {
		test.arrange();
		let stream = plugin();
		let file = new Vinyl({ path: FILE_PATH, contents: null });

		test.act();
		stream.write(file);
		let actual = stream.read();

		test.assert();
		expect(stream.read()).to.be.null;
		expect(actual).to.equal(file);
	});

	suite.describe("When created with source-map", suite => {
		suite.test("Test source maps are created in external file.", test => {
			test.arrange();
			let inStream = ObjectStream.transform({});

			let outStream = inStream
				.pipe(sourcemaps.init())
				.pipe(plugin())
				.pipe(sourcemaps.write("./maps"));

			let file = createGulpTextFile(FILE_TEXT);

			test.act();
			inStream.write(file);
			let mapFile = outStream.read() as any;
			let actual = outStream.read() as any;

			test.assert();
			const sourceMapString = "\n//# sourceMappingURL=maps/bundle.min.js.map\n";
			expect(outStream.read()).to.be.null;
			expect(actual.contents.toString()).to.equal(FILE_TEXT_UGLIFIED + sourceMapString);

			let map = JSON.parse(mapFile.contents.toString());
			// console.log(map);
			expect(map.sources[0]).to.equal(FILE_MIN_PATH);
			expect(map.mappings.length).to.be.greaterThan(0);
			expect(map.file).to.equal("../" + FILE_MIN_PATH);
			expect(map.sourcesContent[0]).to.equal(FILE_TEXT);
		});
		
		suite.test("Test source maps are created inline.", test => {
			test.arrange();
			let inStream = ObjectStream.transform({});

			let outStream = inStream
				.pipe(sourcemaps.init())
				.pipe(plugin())
				.pipe(sourcemaps.write()) as Transform;

			let file = createGulpTextFile(FILE_TEXT);

			test.act();
			inStream.write(file);
			let actual: Vinyl = outStream.read();

			test.assert();
			const sourceMapString = "\n//# sourceMappingURL=data:application/json;charset=utf8;base64";
			expect(outStream.read()).to.be.null;
			expect(actual.contents!.toString().startsWith(FILE_TEXT_UGLIFIED + sourceMapString)).to.true;
		});
	});
}

function createGulpTextFile(text: string): Vinyl {
	return new Vinyl({
		path: FILE_MIN_PATH,
		contents: new Buffer(FILE_TEXT)
	});
}

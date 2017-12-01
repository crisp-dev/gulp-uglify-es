import { TestParams, TestSuite } from "just-test-api";
import { expect } from "chai";
import ObjectStream, { Transform } from "o-stream";
import * as gutil from "gulp-util";
import plugin from "./index";
import * as sourcemaps from "gulp-sourcemaps";

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
		let file = new gutil.File({ path: "bundle.js", contents: null });

		test.act();
		stream.write(file);
		let actual = stream.read();

		test.assert();
		expect(stream.read()).to.be.null;
		expect(actual).to.equal(file);
	});

	suite.describe("When created with source-map", suite => {
		suite.test("Test source maps are created.", test => {

			// Finish this test. Add to README. Publish. Comment and close issue.

			test.arrange();
			let inStream = ObjectStream.transform({});

			let outStream = inStream
				.pipe(sourcemaps.init())
				.pipe(plugin())
				.pipe(sourcemaps.write("./maps"));

			let file = createGulpTextFile(FILE_TEXT);

			test.act();
			inStream.write(file);
			let maps = outStream.read() as any;
			let actual = outStream.read() as any;

			test.assert();
			const sourceMapString = "\n//# sourceMappingURL=maps/bundle.js.map\n";
			expect(outStream.read()).to.be.null;
			expect(actual.contents.toString()).to.equal(FILE_TEXT_UGLIFIED + sourceMapString);
			expect(maps.contents.toString().length).to.be.greaterThan(0);
		});
	});
}

function createGulpTextFile(text: string): gutil.File {
	return new gutil.File({
		path: "bundle.js",
		contents: new Buffer(FILE_TEXT)
	});
}
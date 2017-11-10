import { TestParams, TestSuite } from "just-test-api";
import ObjectStream from "o-stream";
import * as gutil from "gulp-util";
import plugin from "./index";

export default function (suite: TestSuite): void {
	suite.test("When recieves a valid file, then uglify it.", async test => {
		await testText("class MyClass { }", output => output === "class MyClass{}");
	});

	suite.test("When recieves a file without contents, then throws.", async test => {
		await testFile(new gutil.File({ contents: null }), (output, error) => {
			if (!error) {
				throw new Error("Expected an error but none was thrown.");
			}

			return true;
		});
	});
}

function createBundleFile(content: string): gutil.File {
	return new gutil.File({
		path: "bundle.js",
		contents: new Buffer(content)
	});
}

type Validation = (output: string | undefined, error: any | undefined) => boolean;

function testText(input: string, validation: Validation): Promise<void> {
	return testFile(createBundleFile(input), validation);
}

function testFile(file: gutil.File, validation: Validation): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		let input = file.contents ? file.contents.toString() : null;
		let fileStream = ObjectStream.fromArray([file]);

		fileStream.pipe(plugin())
			.pipe(ObjectStream.transform<gutil.File, void>({
				onEntered: args => {
					let output = args.object.contents!.toString();

					try {
						if (validation(output, undefined)) {
							resolve();
						}
						else {
							reject(`Validation returned false. Input: ${input}. Output:${output}`);
						}
					} catch (error) {
						reject(error);
					}
				},
				onSourceStreamError: args => {
					try {
						if (validation(undefined, args.error)) {
							resolve();
						}
						else {
							reject(`Validation returned false. Error: ${args.error}.`);
						}
					} catch (error) {
						reject(error);
					}
				}
			}));
	});
}
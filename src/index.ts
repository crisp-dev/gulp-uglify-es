import ObjectStream, { EnteredArgs, EndedArgs, Transform } from "o-stream";
import * as gutil from "gulp-util";
const Uglify = require("uglify-es");

export default function plugin(options?: any): Transform {
    return ObjectStream.transform({
        onEntered: (args: EnteredArgs<gutil.File, gutil.File>) => {
			if(!args.object.contents){
				throw new Error(`Invalid file with path: ${args.object.path}. The file has no contents.`);
			}

			let result = Uglify.minify(args.object.contents.toString(), options);

            if (result.error) {
                throw result.error;
            }

            args.object.contents = new Buffer(result.code);

            args.output.push(args.object);
        }
    });
}
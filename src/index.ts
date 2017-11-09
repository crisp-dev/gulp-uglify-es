import ObjectStream, { EnteredArgs, EndedArgs, Transform } from "o-stream";
import * as gutil from "gulp-util";
const Uglify = require("uglify-es");

export default function plugin(options?: any): Transform {
    return ObjectStream.transform({
        onEntered: (args: EnteredArgs<gutil.File, gutil.File>) => {
            let result = Uglify.minify(args.object.contents.toString() as string, options);

            if (result.error) {
                throw result.error;
            }

            args.object.contents = new Buffer(result.code);

            args.output.push(args.object);
        }
    });
}
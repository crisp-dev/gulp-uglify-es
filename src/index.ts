import ObjectStream, { EnteredArgs, EndedArgs, Transform } from "o-stream";
import * as gutil from "gulp-util";
const Uglify = require("uglify-es");
// const gulpExec: () => Transform = require("gulp-exec");

// let execUglifyOption = { continueOnError: false, pipeStdout: true };
// let uglify = gulpExec.bind(null,
// "call ./node_modules/.bin/uglifyjs \"<%= file.path %>\"", execUglifyOption);

export default function plugin(options?: any): Transform {
    // let result = uglify();
    // result.on('error', function (err: any) {
    //     gutil.log(gutil.colors.red('[Error]'), err.toString());
    //     this.emit('end');
    // });

    // return result;

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
define("something", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SomeClass {
        constructor() {
            let longVariableName = 100;

            for (let i = 0; i < longVariableName; i++) {
                console.log(i);
            }
        }
        myFunction(myArg1) {
            console.log(myArg1);
        }
    }
    exports.SomeClass = SomeClass;
});

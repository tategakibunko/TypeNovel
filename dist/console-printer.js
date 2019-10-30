"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StdConsolePrinter = /** @class */ (function () {
    function StdConsolePrinter() {
    }
    StdConsolePrinter.prototype.printOutput = function (output) {
        console.log(output);
    };
    StdConsolePrinter.prototype.printValidationError = function (error) {
        var pos = error.codePos;
        var path = pos.path ? pos.path + " " : '';
        console.log(path + "line:" + error.codePos.line + ", col:" + error.codePos.startColumn + "-" + error.codePos.endColumn + ", " + error.message);
    };
    return StdConsolePrinter;
}());
exports.StdConsolePrinter = StdConsolePrinter;
//# sourceMappingURL=console-printer.js.map
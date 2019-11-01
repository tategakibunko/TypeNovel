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
        console.error(path + "line:" + (error.codePos.line + 1) + ", col:" + error.codePos.startColumn + ", " + error.message);
    };
    return StdConsolePrinter;
}());
exports.StdConsolePrinter = StdConsolePrinter;
//# sourceMappingURL=console-printer.js.map
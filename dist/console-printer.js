"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StdConsolePrinter {
    printOutput(output) {
        console.log(output);
    }
    printValidationError(error) {
        const pos = error.codePos;
        const path = pos.path ? `${pos.path} ` : '';
        console.error(`${path}line:${error.codePos.startLine + 1}, col:${error.codePos.startColumn}, ${error.message}`);
    }
}
exports.StdConsolePrinter = StdConsolePrinter;
//# sourceMappingURL=console-printer.js.map
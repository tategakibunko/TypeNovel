"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var modules_1 = require("./modules");
var commandpost = __importStar(require("commandpost"));
var pkg = require('../package.json');
/*
  TypeNovel compiler

  Usage: tnc [options] [--] <inputFile>

  Options:

    --init             Generate default 'tnconfig.json'
    --minify           Minify output html
    --config <path>    Specify path of 'tnconfig.json'
    --format <format>  Output format('text' or 'html')
*/
var root = commandpost
    .create("tnc <inputFile>")
    .version("" + pkg.version, "-v, --version")
    .description("TypeNovel compiler")
    .option("--init", "Generate default 'tnconfig.json'")
    .option("--minify", "Minify output html")
    .option("--config <path>", "Specify path of 'tnconfig.json'")
    .option("--format <format>", "Output format('text' or 'html')")
    .action(function (opts, args) {
    var result = modules_1.Tnc.exec({
        config: opts.config[0],
        minify: opts.minify,
        format: opts.format[0],
        inputFile: args.inputFile
    });
    var printer = new modules_1.StdConsolePrinter();
    result.errors.forEach(function (error) { return printer.printValidationError(error); });
    if (result.errors.length > 0) {
        console.log('\n');
    }
    printer.printOutput(result.output);
});
if (process.argv.some(function (arg) { return arg === '--init'; })) {
    modules_1.Tnc.init();
    process.exit(1);
}
commandpost
    .exec(root, process.argv)
    .catch(function (err) {
    if (err instanceof Error) {
        console.error(err.stack);
    }
    else {
        console.error(err);
    }
    process.exit(1);
});
//# sourceMappingURL=main.js.map
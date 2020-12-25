"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules");
const fs = __importStar(require("fs"));
const commandpost = __importStar(require("commandpost"));
const pkg = require('../package.json');
/*
  TypeNovel compiler

  Usage: tnc [options] [--] <inputFile>

  Options:

    --init             Generate default 'tnconfig.json'
    --minify           Minify output html
    --output <path>    Specify output path(if none, stdout is used)
    --config <path>    Specify path of 'tnconfig.json'
    --format <format>  Output format('text' or 'html')
*/
const root = commandpost
    .create("tnc <inputFile>")
    .version(`${pkg.version}`, "-v, --version")
    .description("TypeNovel compiler")
    .option("--init", "Generate default 'tnconfig.json'")
    .option("--minify", "Minify output html")
    .option("--output <path>", "Specify output path(if none, stdout is used)")
    .option("--config <path>", "Specify path of 'tnconfig.json'")
    .option("--format <format>", "Output format('text' or 'html')")
    .action((opts, args) => {
    const outputPath = opts.output[0];
    const result = modules_1.Tnc.fromFile(args.inputFile, {
        config: opts.config[0],
        minify: opts.minify,
        format: opts.format[0],
    });
    const printer = new modules_1.StdConsolePrinter();
    result.errors.forEach(error => printer.printValidationError(error));
    if (result.errors.length > 0) {
        console.log('\n');
    }
    if (outputPath) {
        fs.writeFileSync(outputPath, result.output, { encoding: 'utf8' });
    }
    else {
        printer.printOutput(result.output);
    }
});
if (process.argv.some(arg => arg === '--init')) {
    modules_1.Tnc.init();
    process.exit(1);
}
commandpost
    .exec(root, process.argv)
    .catch(err => {
    if (err instanceof Error) {
        console.error(err.stack);
    }
    else {
        console.error(err);
    }
    process.exit(1);
});
//# sourceMappingURL=main.js.map
import {
  StdConsolePrinter,
  OutputFormat,
  Tnc,
} from './modules';

import * as fs from 'fs';
import * as commandpost from "commandpost";

const pkg: any = require('../package.json');

interface CliOptions {
  init: boolean;
  output: string[];
  config: string[];
  minify: boolean;
  format: OutputFormat[];
}

interface CliArgs {
  inputFile: string;
}

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
  .create<CliOptions, CliArgs>("tnc <inputFile>")
  .version(`${pkg.version}`, "-v, --version")
  .description("TypeNovel compiler")
  .option("--init", "Generate default 'tnconfig.json'")
  .option("--minify", "Minify output html")
  .option("--output <path>", "Specify output path(if none, stdout is used)")
  .option("--config <path>", "Specify path of 'tnconfig.json'")
  .option("--format <format>", "Output format('text' or 'html')")
  .action((opts, args) => {
    const outputPath = opts.output[0];
    const result = Tnc.fromFile(args.inputFile, {
      config: opts.config[0],
      minify: opts.minify,
      format: opts.format[0],
    });
    const printer = new StdConsolePrinter();
    result.errors.forEach(error => printer.printValidationError(error));
    if (result.errors.length > 0) {
      console.log('\n');
    }
    if (outputPath) {
      fs.writeFileSync(outputPath, result.output, { encoding: 'utf8' });
    } else {
      printer.printOutput(result.output);
    }
  });

if (process.argv.some(arg => arg === '--init')) {
  Tnc.init();
  process.exit(1);
}

commandpost
  .exec(root, process.argv)
  .catch(err => {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error(err);
    }
    process.exit(1);
  });


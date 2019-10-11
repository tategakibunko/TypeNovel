import {
  StdConsolePrinter,
  OutputFormat,
  Tnc,
} from './modules';

import * as commandpost from "commandpost";

const pkg: any = require('../package.json');

interface CliOptions {
  init: boolean;
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
    --config <path>    Specify path of 'tnconfig.json'
    --format <format>  Output format('text' or 'html')
*/
const root = commandpost
  .create<CliOptions, CliArgs>("tnc <inputFile>")
  .version(`${pkg.version}`, "-v, --version")
  .description("TypeNovel compiler")
  .option("--init", "Generate default 'tnconfig.json'")
  .option("--minify", "Minify output html")
  .option("--config <path>", "Specify path of 'tnconfig.json'")
  .option("--format <format>", "Output format('text' or 'html')")
  .action((opts, args) => {
    const result = Tnc.exec({
      config: opts.config[0],
      minify: opts.minify,
      format: opts.format[0],
      inputFile: args.inputFile
    });
    const printer = new StdConsolePrinter();
    result.errors.forEach(error => printer.printValidationError(error));
    if (result.errors.length > 0) {
      console.log('\n');
    }
    printer.printOutput(result.output);
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


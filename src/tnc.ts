import {
  Utils,
  Config,
  Compile,
  CompileResult,
  CompileArgs,
  NearlyParser,
  AstMapper,
  NodeMapper,
  NodeWhiteSpaceCleaner,
  NodeBuilder,
  DuplicateConstraintChecker,
  UnAnnotatedConstraintChecker,
  UndefinedConstraintChecker,
  StdHtmlFormatter,
  MinifiedHtmlFormatter,
  PlainTextFormatter,
} from './modules';

export type OutputFormat = 'text' | 'html';

export interface TncArgs {
  config?: string; // path to tnconfig.json.
  minify?: boolean; // minify output or not.
  format?: OutputFormat; // 'text' or 'html'
  inputFile: string; // file to compile(*.tn)
}

export class Tnc {
  static init() {
    Config.initTnConfig();
    console.log("'tnconfig.json' is generated.");
  }

  static exec(args: TncArgs): CompileResult {
    // console.log(args);
    const path = Utils.getPath(args.inputFile);
    const config = Config.loadTnConfig(args.config || 'tnconfig.json');
    const rootBlockName = config.compilerOptions.rootBlockName || 'body';

    // String -> Ast[]
    let typeNovelParser = new NearlyParser();

    // Ast[] -> Ast'[]
    let astMappers: AstMapper[] = [
    ];

    // Ast[] -> TnNode[]
    let astConverter = new NodeBuilder(config.markupMap || {});

    // TnNode[] -> TnNode[]
    let nodeMappers: NodeMapper[] = [
      new NodeWhiteSpaceCleaner(),
    ];

    // TnNode[] -> ValidationError[]
    let nodeValidators = [];
    if (config.compilerOptions.warnDuplicateConstraint) {
      nodeValidators.push(new DuplicateConstraintChecker());
    }
    if (config.compilerOptions.warnUnannotatedConstraint) {
      nodeValidators.push(new UnAnnotatedConstraintChecker());
    }
    if (config.compilerOptions.warnUndefinedConstraint) {
      nodeValidators.push(new UndefinedConstraintChecker());
    }

    // TnNode[] -> string[]
    const format = args.format || 'html';
    const nodeFormatter = format === 'text' ? new PlainTextFormatter() :
      (args.minify ? new MinifiedHtmlFormatter() : new StdHtmlFormatter());

    const compileArgs: CompileArgs = {
      path,
      rootBlockName,
      typeNovelParser,
      astMappers,
      astConverter,
      nodeMappers,
      nodeValidators,
      nodeFormatter,
    };

    return Compile.fromFile(path, compileArgs);
  }
}


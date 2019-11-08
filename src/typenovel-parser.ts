const nearley = require('nearley');
import * as fs from 'fs';
import grammar from './grammar';
import {
  Ast,
  CompileAstArgs,
  AstExpander,
  DefaultRootBlockName,
} from './modules';

export interface TypeNovelParser {
  astListFromFile: (path: string) => Ast[];
  astListFromString: (source: string) => Ast[];
  astFromFile: (path: string, opt: CompileAstArgs) => Ast;
  astFromString: (source: string, opt: CompileAstArgs) => Ast;
}

export class NearlyParser implements TypeNovelParser {
  private createRootAst(children: Ast[], opt: CompileAstArgs): Ast {
    let ast: Ast = new Ast({
      type: 'block',
      name: opt.rootBlockName || DefaultRootBlockName,
      codePos: { path: opt.path, startLine: 0, endLine: 0, startColumn: 0, endColumn: 0 },
      args: [],
      value: '',
      children,
    });
    return ast;
  }

  public astListFromFile(path: string): Ast[] {
    const source = fs.readFileSync(path, { encoding: 'utf-8' });
    return this.astListFromString(source);
  }

  public astListFromString(source: string): Ast[] {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    const results = parser.feed(source).results as Ast[][][];
    if (results.length === 0) {
      console.error('Parsing failed!');
      return [];
    }
    if (results.length > 1) {
      console.error('Ambigous grammar!');
    }
    const astList: Ast[] = results[0].map(ret => ret[0]);
    return astList;
  }

  public astFromFile(path: string, opt: CompileAstArgs): Ast {
    const source = fs.readFileSync(path, { encoding: 'utf-8' });
    return this.astFromString(source, { path, ...opt });
  }

  public astFromString(source: string, opt: CompileAstArgs): Ast {
    const astList = this.astListFromString(source);

    // Ast[] -> Ast (wrap single top-level body)
    const ast = this.createRootAst(astList, opt);

    // expand $include(path)
    const astExpander = new AstExpander(this);
    return ast.acceptAstMapper(astExpander, { path: opt.path });
  }
}


const nearley = require('nearley');
import * as fs from 'fs';
import grammar from './grammar';
import {
  Ast,
  AstExpander,
} from './modules';

// (String | Filepath) -> Ast[]
export interface TypeNovelParser {
  astFromFile: (path: string) => Ast[];
  astFromString: (source: string, path?: string) => Ast[];
}

export class NearlyParser implements TypeNovelParser {
  public astFromFile(path: string): Ast[] {
    const source = fs.readFileSync(path, { encoding: 'utf-8' });
    return this.astFromString(source, path);
  }

  public astFromString(source: string, path?: string): Ast[] {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    const results = parser.feed(source).results as Ast[][][];
    if (results.length === 0) {
      console.error('Parsing failed!');
      return [];
    }
    if (results.length > 1) {
      console.error('Ambigous grammar!');
    }
    const astExpander = new AstExpander(this);
    return results[0].map(ret => ret[0]).map(ast => {
      return ast.acceptAstMapper(astExpander, { path });
    });
  }
}


import * as fs from 'fs';
import {
  Ast,
  TnNode,
  DefaultRootBlockName,
  TypeNovelParser,
  ValidationError,
  AstMapper,
  AstConverter,
  NodeMapper,
  NodeFormatter,
  NodeValidator,
} from './modules';

export interface CompileResult {
  output: string;
  errors: ValidationError[];
}

export interface CompileAstArgs {
  path?: string; // source file path(optional)
  rootBlockName?: string;
  typeNovelParser: TypeNovelParser; // string -> Ast[]
  astMappers: AstMapper[]; // Ast -> Ast'
}

export interface CompileNodeArgs extends CompileAstArgs {
  astConverter: AstConverter; // Ast -> TnNode
  nodeMappers: NodeMapper[]; // TnNode -> TnNode'
}

export interface CompileArgs extends CompileNodeArgs {
  nodeValidators: NodeValidator[]; // TnNode -> ValidationError[]
  nodeFormatter: NodeFormatter; // TnNode -> string
}

/*
export interface CompileArgs {
  path?: string; // source file path(optional)
  rootBlockName?: string;
  typeNovelParser: TypeNovelParser; // string -> Ast[]
  astMappers: AstMapper[]; // Ast -> Ast'
  astConverter: AstConverter; // Ast -> TnNode
  nodeMappers: NodeMapper[]; // TnNode -> TnNode'
  nodeValidators: NodeValidator[]; // TnNode -> ValidationError[]
  nodeFormatter: NodeFormatter; // TnNode -> string
}
*/

export class Compile {
  static astFromFile(path: string, opt: CompileAstArgs): Ast {
    const source = fs.readFileSync(path, { encoding: 'utf-8' });
    return this.astFromString(source, { ...opt, path });
  }

  static astFromString(source: string, opt: CompileAstArgs): Ast {
    // String -> Ast []
    let astList = opt.typeNovelParser.astFromString(source, opt.path);

    // Ast[] -> Ast (wrap single top-level body)
    let ast: Ast = (astList.length === 1) ? astList[0] : new Ast({
      type: 'block',
      name: opt.rootBlockName || DefaultRootBlockName,
      codePos: { line: 0, startColumn: 0, endColumn: 0 },
      args: [],
      value: '',
      children: astList
    });

    // Ast -> Ast'
    ast = opt.astMappers.reduce((acm, mapper) => {
      return acm.acceptAstMapper(mapper, { path: opt.path });
    }, ast);

    return ast;
  }

  static nodeFromFile(path: string, opt: CompileNodeArgs): TnNode {
    const source = fs.readFileSync(path, { encoding: 'utf-8' });
    return this.nodeFromString(source, { ...opt, path });
  }

  static nodeFromString(source: string, opt: CompileNodeArgs): TnNode {
    const ast = this.astFromString(source, opt);
    // Ast -> TnNode
    let node = ast.acceptAstConverter(opt.astConverter);

    // TnNode -> TnNode'
    node = opt.nodeMappers.reduce((acm, mapper) => {
      return acm.acceptNodeMapper(mapper);
    }, node);

    return node;
  }

  static fromString(source: string, opt: CompileArgs): CompileResult {
    const node = this.nodeFromString(source, opt);

    // TnNode -> ValidationError[]
    const errors: ValidationError[] = opt.nodeValidators
      .reduce((acm, validator) => {
        return acm.concat(node.acceptNodeValidator(validator));
      }, [] as ValidationError[])
      .sort((e1, e2) => e1.codePos.line - e2.codePos.line);

    // TnNode -> string
    const output = node.acceptNodeFormatter(opt.nodeFormatter, 0);

    return { output, errors };
  }

  static fromFile(path: string, opt: CompileArgs): CompileResult {
    const source = fs.readFileSync(path, { encoding: 'utf-8' });
    return this.fromString(source, { ...opt, path });
  }
}

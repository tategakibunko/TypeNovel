import {
  Ast,
  TypeNovelParser,
} from './modules';

// Ast -> Ast'
export interface AstMapper {
  visitTextAst: (ast: Ast, opt: {
    path?: string,
    parent?: Ast,
  }) => Ast;

  visitAnnotAst: (ast: Ast, opt: {
    path?: string,
    parent?: Ast,
  }) => Ast;

  visitBlockAst: (ast: Ast, opt: {
    path?: string,
    parent?: Ast,
  }) => Ast;
}

// Do nothing.
export class IdAstMapper implements AstMapper {
  public visitTextAst(ast: Ast, opt: {
    path?: string,
    parent?: Ast,
  }): Ast {
    return ast;
  }

  public visitAnnotAst(ast: Ast, opt: {
    path?: string,
    parent?: Ast,
  }): Ast {
    return ast;
  }

  public visitBlockAst(ast: Ast, opt: {
    path?: string,
    parent?: Ast,
  }): Ast {
    return ast;
  }
}

// 1. set source path
// 2. expand 'included' source to Ast[]
export class AstExpander extends IdAstMapper {
  private parser: TypeNovelParser; // used to expand child source to Ast[]

  constructor(parser: TypeNovelParser) {
    super();
    this.parser = parser;
  }

  public visitBlockAst(ast: Ast, opt: {
    path?: string,
    parent?: Ast,
  }): Ast {
    return ast.expandChildren(this.parser, opt.path).mapChildren(child => {
      return child.acceptAstMapper(this, { path: opt.path, parent: ast });
    })
  }
}

export class AstWhiteSpaceCleaner extends IdAstMapper {
  public visitBlockAst(ast: Ast, opt: {
    path?: string,
    parent?: Ast,
  }): Ast {
    return ast
      .filterChildren(child => !child.isWhiteSpace())
      .mapChildren(child => child.acceptAstMapper(this, { path: opt.path, parent: ast }));
  }
}

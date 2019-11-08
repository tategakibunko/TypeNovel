import { Utils, CodePos, TnNode, AstMapper, AstConverter, BlockNode, TypeNovelParser } from './modules';
import * as fs from 'fs';

export type AstType = 'text' | 'annot' | 'block';

export class Ast {
  private type: AstType;
  private name: string;
  private codePos: CodePos;
  private args: any[];
  private value: string;
  private children: Ast[];

  constructor(args: {
    type: AstType,
    name: string,
    codePos: CodePos,
    args: any[],
    value: string,
    children: Ast[]
  }) {
    this.type = args.type;
    this.name = args.name;
    this.codePos = args.codePos;
    this.args = args.args;
    this.value = args.value;
    this.children = args.children;
  }

  public isWhiteSpace(): boolean {
    return this.type === 'text' && this.value.replace(/\s+/g, '') === '';
  }

  public filterChildren(fn: (child: Ast) => boolean): Ast {
    this.children = this.children.filter(child => fn(child));
    return this;
  }

  public mapChildren(fn: (child: Ast) => Ast): Ast {
    this.children = this.children.map(child => fn(child));
    return this;
  }

  private expandInclude(parser: TypeNovelParser, path?: string): Ast[] {
    if (this.type === 'annot' && this.name === 'include') {
      const filepath = Utils.getPath(this.args[0], path);
      // If file not exists, $include("foo.tn") will be compiled to <include>foo.tn</include>.
      return fs.existsSync(filepath) ? parser.astListFromFile(filepath) : [this];
    }
    return [this];
  }

  public expandIncludedChildren(parser: TypeNovelParser, path?: string): Ast {
    this.children = this.children.reduce((acm, child) => {
      return acm.concat(child.expandInclude(parser, path));
    }, [] as Ast[]);
    return this;
  }

  public acceptAstMapper(visitor: AstMapper, opt: {
    path?: string,
    parent?: Ast,
  }): Ast {
    if (!this.codePos.path) {
      this.codePos.path = opt.path;
    }
    switch (this.type) {
      case 'text': return visitor.visitTextAst(this, opt);
      case 'annot': return visitor.visitAnnotAst(this, opt);
      case 'block': return visitor.visitBlockAst(this, opt);
      default: throw new Error(`undefined ast type(${this.type})`);
    }
  }

  public acceptAstConverter(visitor: AstConverter, parent?: BlockNode): TnNode {
    switch (this.type) {
      case 'text': return visitor.visitTextAst({
        name: this.name,
        value: this.value,
        codePos: this.codePos,
        parent,
      });

      case 'annot': return visitor.visitAnnotAst({
        name: this.name,
        key: '$' + this.name,
        args: this.args,
        codePos: this.codePos,
        parent,
      });

      case 'block': return visitor.visitBlockAst({
        name: this.name,
        args: this.args,
        key: '@' + this.name,
        codePos: this.codePos,
        children: this.children,
        parent,
      });

      default: throw new Error(`undefined ast type(${this.type})`);
    }
  }
}


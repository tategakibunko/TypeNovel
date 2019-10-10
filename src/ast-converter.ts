import {
  MarkupMap,
  CodePos,
  Ast,
  BlockNode,
  AnnotNode,
  TextNode,
} from './modules';

// Ast -> TnNode
export interface AstConverter {
  visitTextAst: (args: {
    value: string;
    codePos: CodePos;
    parent?: BlockNode;
  }) => TextNode;

  visitAnnotAst: (args: {
    name: string;
    key: string;
    args: any[];
    codePos: CodePos;
    parent?: BlockNode;
  }) => AnnotNode;

  visitBlockAst: (args: {
    name: string;
    key: string;
    args: any[];
    codePos: CodePos;
    children: Ast[];
    parent?: BlockNode;
  }) => BlockNode;
}

// Build TnNode from Ast
export class NodeBuilder implements AstConverter {
  private uniqueId: number;
  private markupMap: MarkupMap;

  constructor(markupMap: MarkupMap) {
    this.uniqueId = 0;
    this.markupMap = markupMap;
  }

  public visitTextAst(args: {
    value: string,
    codePos: CodePos,
    parent?: BlockNode,
  }): TextNode {
    return new TextNode({
      ...args,
      uniqueId: this.uniqueId++,
    })
  }

  public visitAnnotAst(args: {
    name: string,
    key: string,
    args: any[],
    codePos: CodePos,
    parent?: BlockNode,
  }): AnnotNode {
    return new AnnotNode({
      ...args,
      uniqueId: this.uniqueId++,
      map: (this.markupMap[args.key] || {}),
    });
  }

  public visitBlockAst(args: {
    name: string,
    key: string,
    args: any[],
    codePos: CodePos,
    children: Ast[],
    parent?: BlockNode,
  }): BlockNode {
    // Create block node with no children.
    // Because 'temporary parent block' is required to visit args.children.
    // So children of block is set AFTER all child is visited.
    const block = new BlockNode({
      ...args,
      uniqueId: this.uniqueId++,
      map: (this.markupMap[args.key] || {}),
    });
    const children = args.children.map(child => child.acceptAstConverter(this, block)); // block is 'parent'.
    return block.setChildren(children);
  }
}


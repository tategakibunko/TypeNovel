import {
  TnNode,
  BlockNode,
  NodeMapper,
  NodeFormatter,
  NodeValidator,
  ValidationError,
  CodePos,
} from './modules';

export class TextNode extends TnNode {
  private value: string;

  constructor(args: {
    parent?: BlockNode,
    codePos: CodePos,
    value: string,
    uniqueId: number,
  }) {
    super();
    this.name = '(text)';
    this.codePos = args.codePos;
    this.value = args.value;
    this.parent = args.parent;
    this.uniqueId = args.uniqueId;
  }

  public isTextNode(): boolean {
    return true;
  }

  public setEmpty(): TextNode {
    this.value = '';
    return this;
  }

  public isWhiteSpace(): boolean {
    return this.value.replace(/\s+/g, '') === '';
  }

  public toString(): string {
    const str = this.value.replace(/\n/g, '\\n').replace(/\s/g, '(s)');
    return `text: [${str}]`;
  }

  public hasCRLF(): boolean {
    return this.value.indexOf('\n') >= 0;
  }

  public startsWith(str: string): boolean {
    return this.value.startsWith(str);
  }

  public acceptNodeMapper(visitor: NodeMapper): TextNode {
    return visitor.visitTextNode(this);
  }

  public acceptNodeFormatter(visitor: NodeFormatter, indent: number): string {
    return visitor.visitTextNode({
      content: this.value,
      isWhiteSpacePre: this.parent ? this.parent.isWhiteSpacePre() : false,
      isFirstChild: this.isFirstChild(),
      isLastChild: this.isLastChild(),
      prev: this.prev,
      next: this.next,
      indent,
    });
  }

  public acceptNodeValidator(visitor: NodeValidator): ValidationError[] {
    return visitor.visitTextNode(this, this.codePos);
  }
}

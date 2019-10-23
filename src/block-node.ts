import {
  TnNode,
  AnnotNode,
  TextNode,
  NodeMapper,
  NodeFormatter,
  NodeValidator,
  ValidationError,
  CodePos,
  MarkupMapItem,
  WhiteSpace,
} from './modules';

export class BlockNode extends TnNode {
  private tagName: string;
  private id: string;
  private className: string;
  private attrs: any;
  private args: any[];
  private constraints: any;
  private children: TnNode[];
  private codePos: CodePos;
  private content?: string;
  private whiteSpace: WhiteSpace;

  constructor(args: {
    name: string,
    args: any[],
    parent?: BlockNode,
    codePos: CodePos,
    map: MarkupMapItem,
    uniqueId: number,
  }) {
    super();
    this.name = args.name;
    this.args = args.args;
    this.tagName = args.map.tagName || args.name, this.args;
    this.id = args.map.id || '';
    this.className = args.map.className || '';
    this.content = args.map.content;
    this.whiteSpace = args.map.whiteSpace || 'normal';
    this.constraints = this.parseConstraints(args.args);
    const mmapAttrs = (args.map ? (args.map.attributes || {}) : {});
    const cntrsAttrs = this.parseConstraintsAttrs(this.constraints);
    this.attrs = { ...mmapAttrs, ...cntrsAttrs };
    this.parent = args.parent;
    this.codePos = args.codePos;
    this.uniqueId = args.uniqueId;
    this.children = []; // empty by default
  }

  public isBlockNode(): boolean {
    return true;
  }

  public toString(): string {
    return `block(${this.name}) with ${this.children.length} children`;
  }

  public filterChildren(fn: (child: TnNode) => boolean): BlockNode {
    this.children = this.children.filter(child => fn(child));
    return this;
  }

  public mapChildren(fn: (child: TnNode) => TnNode): BlockNode {
    this.children = this.children.map(child => fn(child));
    return this;
  }

  public getChildCount(): number {
    return this.children.length;
  }

  public getChildrenOfType(name: string): TnNode[] {
    return this.children.filter(c => c.name === name);
  }

  public getChildCountOfType(child: TnNode): number {
    return this.getChildrenOfType(child.name).length;
  }

  public getIndexOfChild(child: TnNode): number {
    return this.children.indexOf(child);
  }

  public getIndexOfType(child: TnNode): number {
    return this.getChildrenOfType(child.name).indexOf(child);
  }

  public getChild(index: number): TnNode | undefined {
    return this.children[index] || undefined;
  }

  public setChildren(children: TnNode[]): BlockNode {
    this.children = children;
    return this;
  }

  public isWhiteSpacePre(): boolean {
    return this.whiteSpace === 'pre';
  }

  private parseConstraints(args: any[]): any {
    return (args[0] && typeof args[0] === 'object') ? args[0] : {};
  }

  private parseConstraintsAttrs(constraints: any): any {
    return this.getConstraintNames().reduce((acm: any, name: string) => {
      acm[`data-${name}`] = String(constraints[name]);
      return acm;
    }, {});
  }

  private getConstraintNames(): string[] {
    return Object.keys(this.constraints);
  }

  public getConstraintValue(name: string): any {
    return this.constraints[name];
  }

  public findConstraintValue(name: string): any {
    if (typeof this.constraints[name] !== 'undefined') {
      return this.constraints[name];
    }
    return this.parent ? this.parent.findConstraintValue(name) : undefined;
  }

  private hasConstraintDef(name: string): boolean {
    return this.getConstraintNames().some(cntr => cntr === name);
  }

  public findConstraintOwner(name: string): BlockNode | undefined {
    if (this.hasConstraintDef(name)) {
      return this;
    }
    if (this.parent) {
      return this.parent.findConstraintOwner(name);
    }
    return undefined;
  }

  public getDuplicateConstraints(): { codePos: CodePos, name: string }[] {
    let names = this.getConstraintNames();
    if (!this.parent || names.length === 0) {
      return [];
    }
    let ret: { codePos: CodePos, name: string }[] = [];
    names.forEach(name => {
      let node = this.parent ? this.parent.findConstraintOwner(name) : undefined;
      if (node !== undefined) {
        // console.log(`${name} is already defined at ${node.codePos}`);
        ret.push({ codePos: node.codePos, name });
      }
    });
    return ret;
  }

  public findAnnot(name: string): TnNode | undefined {
    const children = this.children.filter(child => !child.isTextNode());
    for (let i = 0; i < children.length; i++) {
      if (children[i].isBlockNode()) {
        const annot = (<BlockNode>children[i]).findAnnot(name);
        if (annot) {
          return annot;
        }
      } else if (children[i].isAnnotNode() && children[i].name === name) {
        return children[i];
      }
    }
    return undefined;
  }

  public isIgnoredConstraint(name: string): boolean {
    const value = String(this.getConstraintValue(name));
    return value.startsWith("?");
  }

  public getUnAnnotatedConstraintNames(): string[] {
    return this.getConstraintNames()
      .filter(name => !this.isIgnoredConstraint(name))
      .filter(name => this.findAnnot(name) === undefined);
  }

  public acceptNodeMapper(visitor: NodeMapper): BlockNode {
    return visitor.visitBlockNode(this);
  }

  public acceptNodeFormatter(visitor: NodeFormatter, indent: number): string {
    return visitor.visitBlockNode({
      name: this.name,
      tagName: this.evalAttrValue(this.tagName, this.args),
      id: this.evalAttrValue(this.id, this.args),
      className: this.evalAttrValue(this.className, this.args),
      attrs: this.evalAttrs(this.name, this.args, this.attrs),
      args: this.args,
      content: this.content,
      children: this.children,
      prev: this.prev,
      next: this.next,
      indent,
    });
  }

  public acceptNodeValidator(visitor: NodeValidator): ValidationError[] {
    const validations = visitor.visitBlockNode(this, this.codePos);
    return this.children.reduce((acm, node) => {
      const valis = node.acceptNodeValidator(visitor);
      return acm.concat(valis);
    }, validations);
  }
}


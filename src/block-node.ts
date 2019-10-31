import {
  TnNode,
  AnnotNode,
  Constraint,
  ConstraintCollection,
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
  private constraints: ConstraintCollection;
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
    this.constraints = this.parseConstraints(args.args[0]);
    const mmapAttrs = (args.map ? (args.map.attributes || {}) : {});
    this.attrs = { ...mmapAttrs, ...this.constraints.attrs };
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

  private parseConstraints(arg0: any): ConstraintCollection {
    return (arg0 && arg0 instanceof ConstraintCollection) ? arg0 : new ConstraintCollection([]);
  }

  private getConstraint(name: string): Constraint | undefined {
    return this.constraints.get(name);
  }

  public getConstraintNames(includeParents = false): string[] {
    let names = (this.parent && includeParents) ? this.parent.getConstraintNames(includeParents) : [];
    this.constraints.keys.forEach(name => {
      if (names.indexOf(name) < 0) {
        names.push(name);
      }
    })
    return names;
  }

  public getConstraintValue(name: string): any {
    const cntr = this.getConstraint(name);
    const value = cntr ? cntr.value : undefined;
    return value;
  }

  public findConstraint(name: string): Constraint | undefined {
    const cntr = this.getConstraint(name);
    if (cntr !== undefined) {
      return cntr;
    }
    return this.parent ? this.parent.findConstraint(name) : undefined;
  }

  public findConstraintOwner(name: string): BlockNode | undefined {
    if (this.constraints.containsKey(name)) {
      return this;
    }
    if (this.parent) {
      return this.parent.findConstraintOwner(name);
    }
    return undefined;
  }

  public getDuplicateConstraints(): { prevCntr: Constraint, dupCntr: Constraint }[] {
    if (!this.parent || this.constraints.length === 0) {
      return [];
    }
    let ret: { prevCntr: Constraint, dupCntr: Constraint }[] = [];
    this.constraints.forEach(cntr => {
      let prevCntr = this.parent ? this.parent.getConstraint(cntr.key) : undefined;
      if (prevCntr !== undefined) {
        ret.push({ dupCntr: cntr, prevCntr });
      }
    });
    return ret;
  }

  public findAnnot(name: string): AnnotNode | undefined {
    const children = this.children.filter(child => !child.isTextNode());
    for (let i = 0; i < children.length; i++) {
      if (children[i].isBlockNode()) {
        const annot = (<BlockNode>children[i]).findAnnot(name);
        if (annot) {
          return annot;
        }
      } else if (children[i].isAnnotNode() && children[i].name === name) {
        return children[i] as AnnotNode;
      }
    }
    return undefined;
  }

  public getUnAnnotatedConstraints(): Constraint[] {
    return this.constraints.filter(cntr => {
      return !cntr.isIgnoredConstraint() && this.findAnnot(cntr.key) === undefined;
    });
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


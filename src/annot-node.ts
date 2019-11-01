import {
  TnNode,
  Constraint,
  ConstraintCollection,
  BlockNode,
  NodeMapper,
  NodeFormatter,
  NodeValidator,
  ValidationError,
  CodePos,
  MarkupMapItem,
} from './modules';

/*
  [example]

  @scene({
    season: 'winter',
    words: [1, 2, 'switch!']
    taro:{
      name: 'taro',
      age: 10
    }
  }){
    $season()        // '<season>winter</season>'
    $season('Xmas')  // '<season>Xmas</season>'
    $foo("bar")      // '<foo>bar</foo>'
    $foo()           // '<foo>undefined</foo>'
    $taro("name")    // '<taro-name>taro</taro-name>'
    $taro("age")     // '<taro-age>10</taro-age>'
    $taro("ouch")    // '<taro-ouch>undefined</taro-ouch>'
    $words(2)        // '<words>switch!</words>
  }
*/
export class AnnotNode extends TnNode {
  private tagName: string;
  private id: string;
  private className: string;
  private attrs: any;
  private args: any[];
  private value: string;
  private codePos: CodePos;
  private content?: string;
  private constraint?: Constraint;
  private validate: boolean;
  private selfClosing: boolean;

  constructor(args: {
    name: string,
    args: any,
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
    this.validate = args.map.validate === false ? false : true;
    this.selfClosing = args.map.selfClosing === true;
    this.codePos = args.codePos;
    this.parent = args.parent;
    this.uniqueId = args.uniqueId;
    this.attrs = (args.map ? (args.map.attributes || {}) : {});
    this.constraint = args.parent ? args.parent.findConstraint(this.name) : undefined;
    this.value = args.map.content || this.getAnnotValue(args.name, args.args, this.constraint);
  }

  public isAnnotNode(): boolean {
    return true;
  }

  public toString(): string {
    return `annot(${this.name}): ${this.value}`;
  }

  private getAnnotValue(name: string, args: any[], constraint?: Constraint): string {
    // console.log('annot value(%s), args:%o, constraint:', name, args, constraint);
    if (args.length === 0) {
      // $foo() => 'undefined'
      if (constraint === undefined) {
        return 'undefined';
      }
      // $season() => 'winter'
      return String(constraint.value);
    }
    const aval = args[0];

    // $foo('aaa!') => 'aaa!'
    if (constraint === undefined) {
      return String(aval);
    }
    const cval = constraint.value;

    // $season('Xmas') => 'Xmas'
    if (typeof cval === 'string') {
      return String(aval);
    }
    // $words(2) => 'switch!'
    if (cval instanceof Array) {
      return String(cval[parseInt(aval, 10)]);
    }
    if (cval instanceof ConstraintCollection) {
      const cntr = cval.get(aval);
      this.tagName = [name].concat(args).join('-');
      // $taro("ouch") => <taro-ouch>undefined</taro-ouch>
      if (!cntr) {
        return 'undefined';
      }
      // $taro("age") => <taro-age>20</taro-age>
      const oval = args.reduce((acm, arg) => {
        if (acm instanceof ConstraintCollection) {
          const cntr = acm.get(arg);
          return cntr ? cntr.value : undefined;
        }
        return String(acm);
      }, cval);
      return String(oval);
    }
    return String(aval);
  }

  public acceptNodeMapper(visitor: NodeMapper): AnnotNode {
    return visitor.visitAnnotNode(this);
  }

  public acceptNodeFormatter(visitor: NodeFormatter, indent: number): string {
    return visitor.visitAnnotNode({
      name: this.name,
      tagName: this.evalAttrValue(this.tagName, this.args),
      id: this.evalAttrValue(this.id, this.args),
      className: this.evalAttrValue(this.className, this.args),
      attrs: this.evalAttrs(this.name, this.args, this.attrs),
      args: this.args,
      content: this.content || this.value,
      selfClosing: this.selfClosing,
      prev: this.prev,
      next: this.next,
      indent,
    });
  }

  public isValidateTarget(): boolean {
    return this.validate;
  }

  public isUndefinedAnnot(): boolean {
    if (this.parent) {
      return this.parent.findConstraintOwner(this.name) === undefined;
    }
    return true;
  }

  public acceptNodeValidator(visitor: NodeValidator): ValidationError[] {
    return visitor.visitAnnotNode(this, this.codePos);
  }
}


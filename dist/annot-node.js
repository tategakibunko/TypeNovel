"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules");
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
class AnnotNode extends modules_1.TnNode {
    constructor(args) {
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
    isAnnotNode() {
        return true;
    }
    toString() {
        return `annot(${this.name}): ${this.value}`;
    }
    getAnnotValue(name, args, constraint) {
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
        if (cval instanceof modules_1.ConstraintCollection) {
            const cntr = cval.get(aval);
            this.tagName = [name].concat(args).join('-');
            // $taro("ouch") => <taro-ouch>undefined</taro-ouch>
            if (!cntr) {
                return 'undefined';
            }
            // $taro("age") => <taro-age>20</taro-age>
            const oval = args.reduce((acm, arg) => {
                if (acm instanceof modules_1.ConstraintCollection) {
                    const cntr = acm.get(arg);
                    return cntr ? cntr.value : undefined;
                }
                return String(acm);
            }, cval);
            return String(oval);
        }
        return String(aval);
    }
    acceptNodeMapper(visitor) {
        return visitor.visitAnnotNode(this);
    }
    acceptNodeFormatter(visitor, indent) {
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
    isValidateTarget() {
        return this.validate;
    }
    isUndefinedAnnot() {
        if (this.parent) {
            return this.parent.findConstraintOwner(this.name) === undefined;
        }
        return true;
    }
    acceptNodeValidator(visitor) {
        return visitor.visitAnnotNode(this, this.codePos);
    }
}
exports.AnnotNode = AnnotNode;
//# sourceMappingURL=annot-node.js.map
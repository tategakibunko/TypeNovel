"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var modules_1 = require("./modules");
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
    $foo()           // '<foo>foo</foo>'
    $taro("name")    // '<taro-name>taro</taro-name>'
    $taro("age")     // '<taro-age>10</taro-age>'
    $taro("ouch")    // '<taro></taro>'
    $words(2)        // '<words>switch!</words>
  }
*/
var AnnotNode = /** @class */ (function (_super) {
    __extends(AnnotNode, _super);
    function AnnotNode(args) {
        var _this = _super.call(this) || this;
        _this.name = args.name;
        _this.args = args.args;
        _this.tagName = args.map.tagName || args.name, _this.args;
        _this.id = args.map.id || '';
        _this.className = args.map.className || '';
        _this.content = args.map.content;
        _this.validate = args.map.validate === false ? false : true;
        _this.selfClosing = args.map.selfClosing === true;
        _this.codePos = args.codePos;
        _this.parent = args.parent;
        _this.uniqueId = args.uniqueId;
        _this.attrs = (args.map ? (args.map.attributes || {}) : {});
        _this.constraint = args.parent ? args.parent.findConstraintValue(_this.name) : undefined;
        _this.value = args.map.content || _this.getAnnotValue(args.name, args.args, _this.constraint);
        return _this;
    }
    AnnotNode.prototype.isAnnotNode = function () {
        return true;
    };
    AnnotNode.prototype.toString = function () {
        return "annot(" + this.name + "): " + this.value;
    };
    AnnotNode.prototype.getAnnotValue = function (name, args, constraint) {
        if (args.length === 0) {
            // $foo() => 'foo'
            if (constraint === undefined) {
                return name;
            }
            // $season() => 'winter'
            return String(constraint);
        }
        var aval = args[0];
        // $foo('aaa!') => 'aaa!'
        if (constraint === undefined) {
            return String(aval);
        }
        // $season('Xmas') => 'Xmas'
        if (typeof constraint === 'string') {
            return String(aval);
        }
        // $words(2) => 'switch!'
        if (constraint instanceof Array) {
            return String(constraint[parseInt(aval, 10)]);
        }
        if (typeof constraint === 'object') {
            // $taro("ouch") => <taro></taro>
            if (!constraint[aval]) {
                return '';
            }
            // $taro("age") => <taro-age>20</taro-age>
            this.tagName = [name].concat(args).join('-');
            var oval = args.reduce(function (acm, arg) {
                return typeof acm === 'object' ? (acm[arg] || '') : String(acm);
            }, constraint);
            return String(oval);
        }
        return String(aval);
    };
    AnnotNode.prototype.acceptNodeMapper = function (visitor) {
        return visitor.visitAnnotNode(this);
    };
    AnnotNode.prototype.acceptNodeFormatter = function (visitor, indent) {
        return visitor.visitAnnotNode({
            name: this.name,
            tagName: this.evalAttrValue(this.tagName, this.args),
            id: this.evalAttrValue(this.id, this.args),
            className: this.evalAttrValue(this.className, this.args),
            attrs: this.evalAttrs(this.name, this.args, this.attrs),
            content: this.content || this.value,
            selfClosing: this.selfClosing,
            prev: this.prev,
            next: this.next,
            indent: indent,
        });
    };
    AnnotNode.prototype.isValidateTarget = function () {
        return this.validate;
    };
    AnnotNode.prototype.isUndefinedAnnot = function () {
        if (this.parent) {
            return this.parent.findConstraintOwner(this.name) === undefined;
        }
        return true;
    };
    AnnotNode.prototype.acceptNodeValidator = function (visitor) {
        return visitor.visitAnnotNode(this, this.codePos);
    };
    return AnnotNode;
}(modules_1.TnNode));
exports.AnnotNode = AnnotNode;
//# sourceMappingURL=annot-node.js.map
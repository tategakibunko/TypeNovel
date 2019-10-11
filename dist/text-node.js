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
var TextNode = /** @class */ (function (_super) {
    __extends(TextNode, _super);
    function TextNode(args) {
        var _this = _super.call(this) || this;
        _this.name = '(text)';
        _this.codePos = args.codePos;
        _this.value = args.value;
        _this.parent = args.parent;
        _this.uniqueId = args.uniqueId;
        return _this;
    }
    TextNode.prototype.setEmpty = function () {
        this.value = '';
        return this;
    };
    TextNode.prototype.isWhiteSpace = function () {
        return this.value.replace(/\s+/g, '') === '';
    };
    TextNode.prototype.toString = function () {
        var str = this.value.replace(/\n/g, '\\n').replace(/\s/g, '(s)');
        return "text: [" + str + "]";
    };
    TextNode.prototype.hasCRLF = function () {
        return this.value.indexOf('\n') >= 0;
    };
    TextNode.prototype.startsWith = function (str) {
        return this.value.startsWith(str);
    };
    TextNode.prototype.acceptNodeMapper = function (visitor) {
        return visitor.visitTextNode(this);
    };
    TextNode.prototype.acceptNodeFormatter = function (visitor, indent) {
        return visitor.visitTextNode({
            content: this.value,
            isWhiteSpacePre: this.parent ? this.parent.isWhiteSpacePre() : false,
            isFirstChild: this.isFirstChild(),
            isLastChild: this.isLastChild(),
            prev: this.prev,
            next: this.next,
            indent: indent,
        });
    };
    TextNode.prototype.acceptNodeValidator = function (visitor) {
        return visitor.visitTextNode(this, this.codePos);
    };
    return TextNode;
}(modules_1.TnNode));
exports.TextNode = TextNode;
//# sourceMappingURL=text-node.js.map
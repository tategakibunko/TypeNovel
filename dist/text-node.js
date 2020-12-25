"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules");
class TextNode extends modules_1.TnNode {
    constructor(args) {
        super();
        this.name = args.name;
        this.codePos = args.codePos;
        this.value = args.value;
        this.parent = args.parent;
        this.uniqueId = args.uniqueId;
    }
    isTextNode() {
        return true;
    }
    setEmpty() {
        this.value = '';
        return this;
    }
    isWhiteSpace() {
        return this.value.replace(/\s+/g, '') === '';
    }
    toString() {
        const str = this.value.replace(/\n/g, '\\n').replace(/\s/g, '(s)');
        return `text: [${str}]`;
    }
    hasCRLF() {
        return this.value.indexOf('\n') >= 0;
    }
    startsWith(str) {
        return this.value.startsWith(str);
    }
    acceptNodeMapper(visitor) {
        return visitor.visitTextNode(this);
    }
    acceptNodeFormatter(visitor, indent) {
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
    acceptNodeValidator(visitor) {
        return visitor.visitTextNode(this, this.codePos);
    }
}
exports.TextNode = TextNode;
//# sourceMappingURL=text-node.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules");
// Build TnNode from Ast
class NodeBuilder {
    constructor(markupMap) {
        this.uniqueId = 0;
        this.markupMap = markupMap;
    }
    visitTextAst(args) {
        return new modules_1.TextNode(Object.assign(Object.assign({}, args), { uniqueId: this.uniqueId++ }));
    }
    visitAnnotAst(args) {
        return new modules_1.AnnotNode(Object.assign(Object.assign({}, args), { uniqueId: this.uniqueId++, map: (this.markupMap[args.key] || {}) }));
    }
    visitBlockAst(args) {
        // Create block node with no children.
        // Because 'temporary parent block' is required to visit args.children.
        // So children of block is set AFTER all child is visited.
        const block = new modules_1.BlockNode(Object.assign(Object.assign({}, args), { uniqueId: this.uniqueId++, map: (this.markupMap[args.key] || {}) }));
        const children = args.children.map(child => child.acceptAstConverter(this, block)); // block is 'parent'.
        return block.setChildren(children);
    }
}
exports.NodeBuilder = NodeBuilder;
//# sourceMappingURL=ast-converter.js.map
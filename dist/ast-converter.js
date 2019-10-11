"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var modules_1 = require("./modules");
// Build TnNode from Ast
var NodeBuilder = /** @class */ (function () {
    function NodeBuilder(markupMap) {
        this.uniqueId = 0;
        this.markupMap = markupMap;
    }
    NodeBuilder.prototype.visitTextAst = function (args) {
        return new modules_1.TextNode(__assign(__assign({}, args), { uniqueId: this.uniqueId++ }));
    };
    NodeBuilder.prototype.visitAnnotAst = function (args) {
        return new modules_1.AnnotNode(__assign(__assign({}, args), { uniqueId: this.uniqueId++, map: (this.markupMap[args.key] || {}) }));
    };
    NodeBuilder.prototype.visitBlockAst = function (args) {
        var _this = this;
        // Create block node with no children.
        // Because 'temporary parent block' is required to visit args.children.
        // So children of block is set AFTER all child is visited.
        var block = new modules_1.BlockNode(__assign(__assign({}, args), { uniqueId: this.uniqueId++, map: (this.markupMap[args.key] || {}) }));
        var children = args.children.map(function (child) { return child.acceptAstConverter(_this, block); }); // block is 'parent'.
        return block.setChildren(children);
    };
    return NodeBuilder;
}());
exports.NodeBuilder = NodeBuilder;
//# sourceMappingURL=ast-converter.js.map
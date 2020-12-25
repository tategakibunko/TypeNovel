"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TnNode {
    constructor() {
        this.name = '';
        this.uniqueId = 0;
        this.codePos = { startLine: -1, endLine: -1, startColumn: -1, endColumn: -1 };
    }
    isTextNode() {
        return false;
    }
    isAnnotNode() {
        return false;
    }
    isBlockNode() {
        return false;
    }
    get next() {
        if (this.parent) {
            return this.parent.getChild(this.index + 1);
        }
        return undefined;
    }
    get prev() {
        if (this.parent) {
            return this.parent.getChild(this.index - 1);
        }
        return undefined;
    }
    get index() {
        return this.parent ? this.parent.getIndexOfChild(this) : 0;
    }
    get nth() {
        return this.index + 1;
    }
    get indexOfType() {
        if (!this.parent) {
            return 0;
        }
        return this.parent.getIndexOfType(this);
    }
    isFirstChild() {
        return this.index === 0;
    }
    isLastChild() {
        return this.parent ? this.index === this.parent.getChildCount() - 1 : true;
    }
    evalAttrValue(value, args) {
        const index = this.index;
        const indexOfType = this.indexOfType;
        return value
            .replace(/<name>/g, this.name)
            .replace(/<arg(\d)>/g, (_, p1) => String(args[parseInt(p1) - 1] || ''))
            .replace(/<index>/g, String(index))
            .replace(/<indexOfType>/g, String(indexOfType))
            .replace(/<nth>/g, String(index + 1))
            .replace(/<nthOfType>/g, String(indexOfType + 1))
            .replace(/<uniqueId>/g, String(this.uniqueId))
            .trim();
    }
    evalAttrs(name, args, mapAttrs) {
        return Object.keys(mapAttrs).reduce((acm, key) => {
            acm[key] = this.evalAttrValue(mapAttrs[key], args);
            return acm;
        }, {});
    }
}
exports.TnNode = TnNode;
//# sourceMappingURL=node.js.map
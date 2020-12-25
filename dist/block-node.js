"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules");
class BlockNode extends modules_1.TnNode {
    constructor(args) {
        super();
        this.name = args.name;
        this.args = args.args;
        this.tagName = args.map.tagName || args.name, this.args;
        this.id = args.map.id || '';
        this.className = args.map.className || '';
        this.content = args.map.content;
        this.whiteSpace = args.map.whiteSpace || 'normal';
        this.parent = args.parent;
        this.codePos = args.codePos;
        this.uniqueId = args.uniqueId;
        this.constraints = this.parseConstraints(args.args[0], args.codePos.path);
        const mmapAttrs = (args.map ? (args.map.attributes || {}) : {});
        this.attrs = Object.assign(Object.assign({}, mmapAttrs), this.constraints.attrs);
        this.children = []; // empty by default
    }
    isBlockNode() {
        return true;
    }
    toString() {
        return `block(${this.name}) with ${this.children.length} children`;
    }
    filterChildren(fn) {
        this.children = this.children.filter(child => fn(child));
        return this;
    }
    mapChildren(fn) {
        this.children = this.children.map(child => fn(child));
        return this;
    }
    getChildCount() {
        return this.children.length;
    }
    getChildrenOfType(name) {
        return this.children.filter(c => c.name === name);
    }
    getChildCountOfType(child) {
        return this.getChildrenOfType(child.name).length;
    }
    getIndexOfChild(child) {
        return this.children.indexOf(child);
    }
    getIndexOfType(child) {
        return this.getChildrenOfType(child.name).indexOf(child);
    }
    getChild(index) {
        return this.children[index] || undefined;
    }
    getRange() {
        return new modules_1.CodeRange(this.codePos.startLine, this.codePos.endLine);
    }
    setChildren(children) {
        this.children = children;
        return this;
    }
    isWhiteSpacePre() {
        return this.whiteSpace === 'pre';
    }
    parseConstraints(arg0, path) {
        let cntrs = (arg0 && arg0 instanceof modules_1.ConstraintCollection) ? arg0 : new modules_1.ConstraintCollection([]);
        if (path) {
            cntrs.setPath(path);
        }
        return cntrs;
    }
    getConstraint(name) {
        return this.constraints.get(name);
    }
    queryNode(fn) {
        let result = fn(this) ? [this] : [];
        return this.children.reduce((acm, child) => {
            if (child.isBlockNode()) {
                acm = acm.concat(child.queryNode(fn));
            }
            else {
                acm = fn(child) ? acm.concat(child) : acm;
            }
            return acm;
        }, result);
    }
    getConstraints(includeParents = false) {
        let cntrs = (this.parent && includeParents) ? this.parent.getConstraints(includeParents) : [];
        this.constraints.forEach(cntr => {
            if (!cntrs.some(c => c.key === cntr.key)) {
                cntrs.push(cntr);
            }
        });
        return cntrs;
    }
    getConstraintValue(name) {
        const cntr = this.getConstraint(name);
        const value = cntr ? cntr.value : undefined;
        return value;
    }
    findConstraint(name) {
        const cntr = this.getConstraint(name);
        if (cntr !== undefined) {
            return cntr;
        }
        return this.parent ? this.parent.findConstraint(name) : undefined;
    }
    findConstraintOwner(name) {
        if (this.constraints.containsKey(name)) {
            return this;
        }
        if (this.parent) {
            return this.parent.findConstraintOwner(name);
        }
        return undefined;
    }
    getDuplicateConstraints() {
        if (!this.parent || this.constraints.length === 0) {
            return [];
        }
        let ret = [];
        this.constraints.forEach(cntr => {
            let prevCntr = this.parent ? this.parent.getConstraint(cntr.key) : undefined;
            if (prevCntr !== undefined) {
                ret.push({ dupCntr: cntr, prevCntr });
            }
        });
        return ret;
    }
    findAnnot(name) {
        const children = this.children.filter(child => !child.isTextNode());
        for (let i = 0; i < children.length; i++) {
            if (children[i].isBlockNode()) {
                const annot = children[i].findAnnot(name);
                if (annot) {
                    return annot;
                }
            }
            else if (children[i].isAnnotNode() && children[i].name === name) {
                return children[i];
            }
        }
        return undefined;
    }
    getUnAnnotatedConstraints() {
        return this.constraints.filter(cntr => {
            return !cntr.isIgnoredConstraint() && this.findAnnot(cntr.key) === undefined;
        });
    }
    acceptNodeMapper(visitor) {
        return visitor.visitBlockNode(this);
    }
    acceptNodeFormatter(visitor, indent) {
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
    acceptNodeValidator(visitor) {
        const validations = visitor.visitBlockNode(this, this.codePos);
        return this.children.reduce((acm, node) => {
            const valis = node.acceptNodeValidator(visitor);
            return acm.concat(valis);
        }, validations);
    }
}
exports.BlockNode = BlockNode;
//# sourceMappingURL=block-node.js.map
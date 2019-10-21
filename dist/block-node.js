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
var BlockNode = /** @class */ (function (_super) {
    __extends(BlockNode, _super);
    function BlockNode(args) {
        var _this = _super.call(this) || this;
        _this.name = args.name;
        _this.args = args.args;
        _this.tagName = args.map.tagName || args.name, _this.args;
        _this.id = args.map.id || '';
        _this.className = args.map.className || '';
        _this.content = args.map.content;
        _this.whiteSpace = args.map.whiteSpace || 'normal';
        _this.constraints = _this.parseConstraints(args.args);
        var mmapAttrs = (args.map ? (args.map.attributes || {}) : {});
        var cntrsAttrs = _this.parseConstraintsAttrs(_this.constraints);
        _this.attrs = __assign(__assign({}, mmapAttrs), cntrsAttrs);
        _this.parent = args.parent;
        _this.codePos = args.codePos;
        _this.uniqueId = args.uniqueId;
        _this.children = []; // empty by default
        return _this;
    }
    BlockNode.prototype.isBlockNode = function () {
        return true;
    };
    BlockNode.prototype.toString = function () {
        return "block(" + this.name + ") with " + this.children.length + " children";
    };
    BlockNode.prototype.filterChildren = function (fn) {
        this.children = this.children.filter(function (child) { return fn(child); });
        return this;
    };
    BlockNode.prototype.mapChildren = function (fn) {
        this.children = this.children.map(function (child) { return fn(child); });
        return this;
    };
    BlockNode.prototype.getChildCount = function () {
        return this.children.length;
    };
    BlockNode.prototype.getChildrenOfType = function (name) {
        return this.children.filter(function (c) { return c.name === name; });
    };
    BlockNode.prototype.getChildCountOfType = function (child) {
        return this.getChildrenOfType(child.name).length;
    };
    BlockNode.prototype.getIndexOfChild = function (child) {
        return this.children.indexOf(child);
    };
    BlockNode.prototype.getIndexOfType = function (child) {
        return this.getChildrenOfType(child.name).indexOf(child);
    };
    BlockNode.prototype.getChild = function (index) {
        return this.children[index] || undefined;
    };
    BlockNode.prototype.setChildren = function (children) {
        this.children = children;
        return this;
    };
    BlockNode.prototype.isWhiteSpacePre = function () {
        return this.whiteSpace === 'pre';
    };
    BlockNode.prototype.parseConstraints = function (args) {
        return (args[0] && typeof args[0] === 'object') ? args[0] : {};
    };
    BlockNode.prototype.parseConstraintsAttrs = function (constraints) {
        return this.getConstraintNames().reduce(function (acm, name) {
            acm["data-" + name] = String(constraints[name]);
            return acm;
        }, {});
    };
    BlockNode.prototype.getConstraintNames = function () {
        return Object.keys(this.constraints);
    };
    BlockNode.prototype.getConstraintValue = function (name) {
        return this.constraints[name];
    };
    BlockNode.prototype.findConstraintValue = function (name) {
        if (typeof this.constraints[name] !== 'undefined') {
            return this.constraints[name];
        }
        return this.parent ? this.parent.findConstraintValue(name) : undefined;
    };
    BlockNode.prototype.hasConstraintDef = function (name) {
        return this.getConstraintNames().some(function (cntr) { return cntr === name; });
    };
    BlockNode.prototype.findConstraintOwner = function (name) {
        if (this.hasConstraintDef(name)) {
            return this;
        }
        if (this.parent) {
            return this.parent.findConstraintOwner(name);
        }
        return undefined;
    };
    BlockNode.prototype.getDuplicateConstraints = function () {
        var _this = this;
        var names = this.getConstraintNames();
        if (!this.parent || names.length === 0) {
            return [];
        }
        var ret = [];
        names.forEach(function (name) {
            var node = _this.parent ? _this.parent.findConstraintOwner(name) : undefined;
            if (node !== undefined) {
                // console.log(`${name} is already defined at ${node.codePos}`);
                ret.push({ codePos: node.codePos, name: name });
            }
        });
        return ret;
    };
    BlockNode.prototype.findAnnot = function (name) {
        var children = this.children.filter(function (child) { return !child.isTextNode(); });
        for (var i = 0; i < children.length; i++) {
            if (children[i].isBlockNode()) {
                var annot = children[i].findAnnot(name);
                if (annot) {
                    return annot;
                }
            }
            else if (children[i].isAnnotNode() && children[i].name === name) {
                return children[i];
            }
        }
        return undefined;
    };
    BlockNode.prototype.isIgnoredConstraint = function (name) {
        var value = String(this.getConstraintValue(name));
        return value.startsWith("?");
    };
    BlockNode.prototype.getUnAnnotatedConstraintNames = function () {
        var _this = this;
        return this.getConstraintNames()
            .filter(function (name) { return !_this.isIgnoredConstraint(name); })
            .filter(function (name) { return _this.findAnnot(name) === undefined; });
    };
    BlockNode.prototype.acceptNodeMapper = function (visitor) {
        return visitor.visitBlockNode(this);
    };
    BlockNode.prototype.acceptNodeFormatter = function (visitor, indent) {
        return visitor.visitBlockNode({
            name: this.name,
            tagName: this.evalAttrValue(this.tagName, this.args),
            id: this.evalAttrValue(this.id, this.args),
            className: this.evalAttrValue(this.className, this.args),
            attrs: this.evalAttrs(this.name, this.args, this.attrs),
            content: this.content,
            children: this.children,
            prev: this.prev,
            next: this.next,
            indent: indent,
        });
    };
    BlockNode.prototype.acceptNodeValidator = function (visitor) {
        var validations = visitor.visitBlockNode(this, this.codePos);
        return this.children.reduce(function (acm, node) {
            var valis = node.acceptNodeValidator(visitor);
            return acm.concat(valis);
        }, validations);
    };
    return BlockNode;
}(modules_1.TnNode));
exports.BlockNode = BlockNode;
//# sourceMappingURL=block-node.js.map
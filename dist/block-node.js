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
        _this.constraints = _this.parseConstraints(args.args[0]);
        var mmapAttrs = (args.map ? (args.map.attributes || {}) : {});
        _this.attrs = __assign(__assign({}, mmapAttrs), _this.constraints.attrs);
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
    BlockNode.prototype.parseConstraints = function (arg0) {
        return (arg0 && arg0 instanceof modules_1.ConstraintCollection) ? arg0 : new modules_1.ConstraintCollection([]);
    };
    BlockNode.prototype.getConstraint = function (name) {
        return this.constraints.get(name);
    };
    BlockNode.prototype.getConstraintNames = function (includeParents) {
        if (includeParents === void 0) { includeParents = false; }
        var names = (this.parent && includeParents) ? this.parent.getConstraintNames(includeParents) : [];
        this.constraints.keys.forEach(function (name) {
            if (names.indexOf(name) < 0) {
                names.push(name);
            }
        });
        return names;
    };
    BlockNode.prototype.getConstraintValue = function (name) {
        var cntr = this.getConstraint(name);
        var value = cntr ? cntr.value : undefined;
        return value;
    };
    BlockNode.prototype.findConstraint = function (name) {
        var cntr = this.getConstraint(name);
        if (cntr !== undefined) {
            return cntr;
        }
        return this.parent ? this.parent.findConstraint(name) : undefined;
    };
    BlockNode.prototype.findConstraintOwner = function (name) {
        if (this.constraints.containsKey(name)) {
            return this;
        }
        if (this.parent) {
            return this.parent.findConstraintOwner(name);
        }
        return undefined;
    };
    BlockNode.prototype.getDuplicateConstraints = function () {
        var _this = this;
        if (!this.parent || this.constraints.length === 0) {
            return [];
        }
        var ret = [];
        this.constraints.forEach(function (cntr) {
            var prevCntr = _this.parent ? _this.parent.getConstraint(cntr.key) : undefined;
            if (prevCntr !== undefined) {
                ret.push({ dupCntr: cntr, prevCntr: prevCntr });
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
    BlockNode.prototype.getUnAnnotatedConstraints = function () {
        var _this = this;
        return this.constraints.filter(function (cntr) {
            return !cntr.isIgnoredConstraint() && _this.findAnnot(cntr.key) === undefined;
        });
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
            args: this.args,
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
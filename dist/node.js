"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TnNode = /** @class */ (function () {
    function TnNode() {
        this.name = '';
        this.uniqueId = 0;
    }
    TnNode.prototype.isTextNode = function () {
        return false;
    };
    TnNode.prototype.isAnnotNode = function () {
        return false;
    };
    TnNode.prototype.isBlockNode = function () {
        return false;
    };
    Object.defineProperty(TnNode.prototype, "next", {
        get: function () {
            if (this.parent) {
                return this.parent.getChild(this.index + 1);
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TnNode.prototype, "prev", {
        get: function () {
            if (this.parent) {
                return this.parent.getChild(this.index - 1);
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TnNode.prototype, "index", {
        get: function () {
            return this.parent ? this.parent.getIndexOfChild(this) : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TnNode.prototype, "nth", {
        get: function () {
            return this.index + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TnNode.prototype, "indexOfType", {
        get: function () {
            if (!this.parent) {
                return 0;
            }
            return this.parent.getIndexOfType(this);
        },
        enumerable: true,
        configurable: true
    });
    TnNode.prototype.isFirstChild = function () {
        return this.index === 0;
    };
    TnNode.prototype.isLastChild = function () {
        return this.parent ? this.index === this.parent.getChildCount() - 1 : true;
    };
    TnNode.prototype.evalAttrValue = function (value, args) {
        var index = this.index;
        var indexOfType = this.indexOfType;
        return value
            .replace(/<name>/g, this.name)
            .replace(/<arg(\d)>/g, function (_, p1) { return String(args[parseInt(p1) - 1] || ''); })
            .replace(/<index>/g, String(index))
            .replace(/<indexOfType>/g, String(indexOfType))
            .replace(/<nth>/g, String(index + 1))
            .replace(/<nthOfType>/g, String(indexOfType + 1))
            .replace(/<uniqueId>/g, String(this.uniqueId))
            .trim();
    };
    TnNode.prototype.evalAttrs = function (name, args, mapAttrs) {
        var _this = this;
        return Object.keys(mapAttrs).reduce(function (acm, key) {
            acm[key] = _this.evalAttrValue(mapAttrs[key], args);
            return acm;
        }, {});
    };
    return TnNode;
}());
exports.TnNode = TnNode;
//# sourceMappingURL=node.js.map
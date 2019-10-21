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
var IdNodeMapper = /** @class */ (function () {
    function IdNodeMapper() {
    }
    IdNodeMapper.prototype.visitTextNode = function (node) {
        return node;
    };
    IdNodeMapper.prototype.visitAnnotNode = function (node) {
        return node;
    };
    IdNodeMapper.prototype.visitBlockNode = function (node) {
        return node;
    };
    return IdNodeMapper;
}());
exports.IdNodeMapper = IdNodeMapper;
var NodeWhiteSpaceCleaner = /** @class */ (function (_super) {
    __extends(NodeWhiteSpaceCleaner, _super);
    function NodeWhiteSpaceCleaner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodeWhiteSpaceCleaner.prototype.visitBlockNode = function (node) {
        var _this = this;
        return node
            .filterChildren(function (child) { return !(child.isTextNode() && child.isWhiteSpace()); })
            .mapChildren(function (child) { return child.acceptNodeMapper(_this); });
    };
    return NodeWhiteSpaceCleaner;
}(IdNodeMapper));
exports.NodeWhiteSpaceCleaner = NodeWhiteSpaceCleaner;
//# sourceMappingURL=node-mapper.js.map
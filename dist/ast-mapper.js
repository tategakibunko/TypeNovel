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
// Do nothing.
var IdAstMapper = /** @class */ (function () {
    function IdAstMapper() {
    }
    IdAstMapper.prototype.visitTextAst = function (ast, opt) {
        return ast;
    };
    IdAstMapper.prototype.visitAnnotAst = function (ast, opt) {
        return ast;
    };
    IdAstMapper.prototype.visitBlockAst = function (ast, opt) {
        return ast;
    };
    return IdAstMapper;
}());
exports.IdAstMapper = IdAstMapper;
// 1. set source path
// 2. expand 'included' source to Ast[]
var AstExpander = /** @class */ (function (_super) {
    __extends(AstExpander, _super);
    function AstExpander(parser) {
        var _this = _super.call(this) || this;
        _this.parser = parser;
        return _this;
    }
    AstExpander.prototype.visitBlockAst = function (ast, opt) {
        var _this = this;
        return ast.expandIncludedChildren(this.parser, opt.path).mapChildren(function (child) {
            return child.acceptAstMapper(_this, { path: opt.path, parent: ast });
        });
    };
    return AstExpander;
}(IdAstMapper));
exports.AstExpander = AstExpander;
var AstWhiteSpaceCleaner = /** @class */ (function (_super) {
    __extends(AstWhiteSpaceCleaner, _super);
    function AstWhiteSpaceCleaner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AstWhiteSpaceCleaner.prototype.visitBlockAst = function (ast, opt) {
        var _this = this;
        return ast
            .filterChildren(function (child) { return !child.isWhiteSpace(); })
            .mapChildren(function (child) { return child.acceptAstMapper(_this, { path: opt.path, parent: ast }); });
    };
    return AstWhiteSpaceCleaner;
}(IdAstMapper));
exports.AstWhiteSpaceCleaner = AstWhiteSpaceCleaner;
//# sourceMappingURL=ast-mapper.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Do nothing.
class IdAstMapper {
    visitTextAst(ast, opt) {
        return ast;
    }
    visitAnnotAst(ast, opt) {
        return ast;
    }
    visitBlockAst(ast, opt) {
        return ast;
    }
}
exports.IdAstMapper = IdAstMapper;
// 1. set source path
// 2. expand 'included' source to Ast[]
class AstExpander extends IdAstMapper {
    constructor(parser) {
        super();
        this.parser = parser;
    }
    visitBlockAst(ast, opt) {
        return ast.expandIncludedChildren(this.parser, opt.path).mapChildren(child => {
            return child.acceptAstMapper(this, { path: opt.path, parent: ast });
        });
    }
}
exports.AstExpander = AstExpander;
class AstWhiteSpaceCleaner extends IdAstMapper {
    visitBlockAst(ast, opt) {
        return ast
            .filterChildren(child => !child.isWhiteSpace())
            .mapChildren(child => child.acceptAstMapper(this, { path: opt.path, parent: ast }));
    }
}
exports.AstWhiteSpaceCleaner = AstWhiteSpaceCleaner;
//# sourceMappingURL=ast-mapper.js.map
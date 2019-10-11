import { Ast, TypeNovelParser } from './modules';
export interface AstMapper {
    visitTextAst: (ast: Ast, opt: {
        path?: string;
        parent?: Ast;
    }) => Ast;
    visitAnnotAst: (ast: Ast, opt: {
        path?: string;
        parent?: Ast;
    }) => Ast;
    visitBlockAst: (ast: Ast, opt: {
        path?: string;
        parent?: Ast;
    }) => Ast;
}
export declare class IdAstMapper implements AstMapper {
    visitTextAst(ast: Ast, opt: {
        path?: string;
        parent?: Ast;
    }): Ast;
    visitAnnotAst(ast: Ast, opt: {
        path?: string;
        parent?: Ast;
    }): Ast;
    visitBlockAst(ast: Ast, opt: {
        path?: string;
        parent?: Ast;
    }): Ast;
}
export declare class AstExpander extends IdAstMapper {
    private parser;
    constructor(parser: TypeNovelParser);
    visitBlockAst(ast: Ast, opt: {
        path?: string;
        parent?: Ast;
    }): Ast;
}
export declare class AstWhiteSpaceCleaner extends IdAstMapper {
    visitBlockAst(ast: Ast, opt: {
        path?: string;
        parent?: Ast;
    }): Ast;
}

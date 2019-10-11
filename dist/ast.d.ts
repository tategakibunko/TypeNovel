import { TnNode, AstMapper, AstConverter, BlockNode, TypeNovelParser } from './modules';
export declare type AstType = 'text' | 'annot' | 'block';
export interface CodePos {
    path?: string;
    line: number;
    col: number;
}
export declare class Ast {
    private type;
    private name;
    private codePos;
    private args;
    private value;
    private children;
    constructor(args: {
        type: AstType;
        name: string;
        codePos: CodePos;
        args: any[];
        value: string;
        children: Ast[];
    });
    isWhiteSpace(): boolean;
    filterChildren(fn: (child: Ast) => boolean): Ast;
    mapChildren(fn: (child: Ast) => Ast): Ast;
    private expandInclude;
    expandChildren(parser: TypeNovelParser, path?: string): Ast;
    acceptAstMapper(visitor: AstMapper, opt: {
        path?: string;
        parent?: Ast;
    }): Ast;
    acceptAstConverter(visitor: AstConverter, parent?: BlockNode): TnNode;
}

import { MarkupMap, CodePos, Ast, BlockNode, AnnotNode, TextNode } from './modules';
export interface AstConverter {
    visitTextAst: (args: {
        name: string;
        value: string;
        codePos: CodePos;
        parent?: BlockNode;
    }) => TextNode;
    visitAnnotAst: (args: {
        name: string;
        key: string;
        args: any[];
        codePos: CodePos;
        parent?: BlockNode;
    }) => AnnotNode;
    visitBlockAst: (args: {
        name: string;
        key: string;
        args: any[];
        codePos: CodePos;
        children: Ast[];
        parent?: BlockNode;
    }) => BlockNode;
}
export declare class NodeBuilder implements AstConverter {
    private uniqueId;
    private markupMap;
    constructor(markupMap: MarkupMap);
    visitTextAst(args: {
        name: string;
        value: string;
        codePos: CodePos;
        parent?: BlockNode;
    }): TextNode;
    visitAnnotAst(args: {
        name: string;
        key: string;
        args: any[];
        codePos: CodePos;
        parent?: BlockNode;
    }): AnnotNode;
    visitBlockAst(args: {
        name: string;
        key: string;
        args: any[];
        codePos: CodePos;
        children: Ast[];
        parent?: BlockNode;
    }): BlockNode;
}

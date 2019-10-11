import { TnNode, BlockNode, NodeMapper, NodeFormatter, NodeValidator, ValidationError, CodePos } from './modules';
export declare class TextNode extends TnNode {
    private codePos;
    private value;
    constructor(args: {
        parent?: BlockNode;
        codePos: CodePos;
        value: string;
        uniqueId: number;
    });
    setEmpty(): TextNode;
    isWhiteSpace(): boolean;
    toString(): string;
    hasCRLF(): boolean;
    startsWith(str: string): boolean;
    acceptNodeMapper(visitor: NodeMapper): TextNode;
    acceptNodeFormatter(visitor: NodeFormatter, indent: number): string;
    acceptNodeValidator(visitor: NodeValidator): ValidationError[];
}
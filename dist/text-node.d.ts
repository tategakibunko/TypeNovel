import { TnNode, BlockNode, NodeMapper, NodeFormatter, NodeValidator, ValidationError, CodePos } from './modules';
export declare class TextNode extends TnNode {
    private value;
    constructor(args: {
        name: string;
        parent?: BlockNode;
        codePos: CodePos;
        value: string;
        uniqueId: number;
    });
    isTextNode(): boolean;
    setEmpty(): TextNode;
    isWhiteSpace(): boolean;
    toString(): string;
    hasCRLF(): boolean;
    startsWith(str: string): boolean;
    acceptNodeMapper(visitor: NodeMapper): TextNode;
    acceptNodeFormatter(visitor: NodeFormatter, indent: number): string;
    acceptNodeValidator(visitor: NodeValidator): ValidationError[];
}

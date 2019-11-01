import { TnNode, BlockNode, NodeMapper, NodeFormatter, NodeValidator, ValidationError, CodePos, MarkupMapItem } from './modules';
export declare class AnnotNode extends TnNode {
    private tagName;
    private id;
    private className;
    private attrs;
    private args;
    private value;
    private content?;
    private constraint?;
    private validate;
    private selfClosing;
    constructor(args: {
        name: string;
        args: any;
        parent?: BlockNode;
        codePos: CodePos;
        map: MarkupMapItem;
        uniqueId: number;
    });
    isAnnotNode(): boolean;
    toString(): string;
    private getAnnotValue;
    acceptNodeMapper(visitor: NodeMapper): AnnotNode;
    acceptNodeFormatter(visitor: NodeFormatter, indent: number): string;
    isValidateTarget(): boolean;
    isUndefinedAnnot(): boolean;
    acceptNodeValidator(visitor: NodeValidator): ValidationError[];
}

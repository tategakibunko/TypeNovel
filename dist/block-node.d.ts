import { TnNode, NodeMapper, NodeFormatter, NodeValidator, ValidationError, CodePos, MarkupMapItem } from './modules';
export declare class BlockNode extends TnNode {
    private tagName;
    private id;
    private className;
    private attrs;
    private args;
    private constraints;
    private children;
    private codePos;
    private content?;
    private whiteSpace;
    constructor(args: {
        name: string;
        args: any[];
        parent?: BlockNode;
        codePos: CodePos;
        map: MarkupMapItem;
        uniqueId: number;
    });
    toString(): string;
    filterChildren(fn: (child: TnNode) => boolean): BlockNode;
    mapChildren(fn: (child: TnNode) => TnNode): BlockNode;
    getChildCount(): number;
    getChildrenOfType(name: string): TnNode[];
    getChildCountOfType(child: TnNode): number;
    getIndexOfChild(child: TnNode): number;
    getIndexOfType(child: TnNode): number;
    getChild(index: number): TnNode | undefined;
    setChildren(children: TnNode[]): BlockNode;
    isWhiteSpacePre(): boolean;
    private parseConstraints;
    private parseConstraintsAttrs;
    private getConstraintNames;
    getConstraintValue(name: string): any;
    findConstraintValue(name: string): any;
    private hasConstraintDef;
    findConstraintOwner(name: string): BlockNode | undefined;
    getDuplicateConstraints(): {
        codePos: CodePos;
        name: string;
    }[];
    findAnnot(name: string): TnNode | undefined;
    isIgnoredConstraint(name: string): boolean;
    getUnAnnotatedConstraintNames(): string[];
    acceptNodeMapper(visitor: NodeMapper): BlockNode;
    acceptNodeFormatter(visitor: NodeFormatter, indent: number): string;
    acceptNodeValidator(visitor: NodeValidator): ValidationError[];
}

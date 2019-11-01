import { TnNode, AnnotNode, Constraint, NodeMapper, NodeFormatter, NodeValidator, ValidationError, CodePos, MarkupMapItem } from './modules';
export declare class BlockNode extends TnNode {
    private tagName;
    private id;
    private className;
    private attrs;
    private args;
    private constraints;
    private children;
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
    isBlockNode(): boolean;
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
    private getConstraint;
    queryNode(fn: (node: TnNode) => boolean): TnNode[];
    getConstraints(includeParents?: boolean): Constraint[];
    getConstraintValue(name: string): any;
    findConstraint(name: string): Constraint | undefined;
    findConstraintOwner(name: string): BlockNode | undefined;
    getDuplicateConstraints(): {
        prevCntr: Constraint;
        dupCntr: Constraint;
    }[];
    findAnnot(name: string): AnnotNode | undefined;
    getUnAnnotatedConstraints(): Constraint[];
    acceptNodeMapper(visitor: NodeMapper): BlockNode;
    acceptNodeFormatter(visitor: NodeFormatter, indent: number): string;
    acceptNodeValidator(visitor: NodeValidator): ValidationError[];
}

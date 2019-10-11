import { BlockNode, NodeMapper, NodeFormatter, NodeValidator, ValidationError } from './modules';
export declare abstract class TnNode {
    name: string;
    uniqueId: number;
    parent?: BlockNode;
    abstract acceptNodeMapper(visitor: NodeMapper): TnNode;
    abstract acceptNodeFormatter(visitor: NodeFormatter, indent: number): string;
    abstract acceptNodeValidator(visitor: NodeValidator): ValidationError[];
    abstract toString(): string;
    readonly next: TnNode | undefined;
    readonly prev: TnNode | undefined;
    readonly index: number;
    readonly nth: number;
    readonly indexOfType: number;
    isFirstChild(): boolean;
    isLastChild(): boolean;
    protected evalAttrValue(value: string, args: any[]): string;
    protected evalAttrs(name: string, args: any[], mapAttrs: any): any;
}

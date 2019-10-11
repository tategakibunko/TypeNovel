import { TextNode, AnnotNode, BlockNode } from "./modules";
export interface NodeMapper {
    visitTextNode: (node: TextNode) => TextNode;
    visitAnnotNode: (node: AnnotNode) => AnnotNode;
    visitBlockNode: (node: BlockNode) => BlockNode;
}
export declare class IdNodeMapper implements NodeMapper {
    visitTextNode(node: TextNode): TextNode;
    visitAnnotNode(node: AnnotNode): AnnotNode;
    visitBlockNode(node: BlockNode): BlockNode;
}
export declare class NodeWhiteSpaceCleaner extends IdNodeMapper {
    visitBlockNode(node: BlockNode): BlockNode;
}

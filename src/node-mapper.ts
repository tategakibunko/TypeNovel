import {
  TextNode,
  AnnotNode,
  BlockNode,
} from "./modules";

export interface NodeMapper {
  visitTextNode: (node: TextNode) => TextNode;
  visitAnnotNode: (node: AnnotNode) => AnnotNode;
  visitBlockNode: (node: BlockNode) => BlockNode;
}

export class IdNodeMapper implements NodeMapper {
  public visitTextNode(node: TextNode): TextNode {
    return node;
  }
  public visitAnnotNode(node: AnnotNode): AnnotNode {
    return node;
  }
  public visitBlockNode(node: BlockNode): BlockNode {
    return node;
  }
}

export class NodeWhiteSpaceCleaner extends IdNodeMapper {
  public visitBlockNode(node: BlockNode): BlockNode {
    return node
      .filterChildren(child => !(child instanceof TextNode && (<TextNode>child).isWhiteSpace()))
      .mapChildren(child => child.acceptNodeMapper(this));
  }
}
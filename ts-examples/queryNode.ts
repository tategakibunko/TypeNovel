import {
  Compile,
  NearlyParser,
  NodeBuilder,
  TnNode,
  BlockNode,
  NodeWhiteSpaceCleaner,
  DefaultTnConfig,
} from '../dist';

function getNodeFromFile(path: string): BlockNode {
  return Compile.nodeFromFile(path, {
    typeNovelParser: new NearlyParser(),
    astMappers: [],
    astConverter: new NodeBuilder(DefaultTnConfig.markupMap || {}),
    nodeMappers: [new NodeWhiteSpaceCleaner()]
  }) as BlockNode;
}

function getNodeFromLineNo(topNode: BlockNode, lineNo: number): BlockNode | undefined {
  const nodes = topNode.queryNode((node: TnNode) => {
    return (node.isBlockNode() && node.codePos.line <= lineNo - 1);
  }).sort((n1, n2) => {
    return n2.codePos.line - n1.codePos.line;
  });

  return (nodes.length > 0) ? nodes[0] as BlockNode : undefined;
}

const topNode = getNodeFromFile('../tn-examples/example.tn');

for (let line = 1; line <= 50; line++) {
  const node = getNodeFromLineNo(topNode, line);
  if (node) {
    const cntrNames = node.getConstraints(true).map(cntr => cntr.key);
    console.log(`line: ${line}, block: ${node.name}, cntrs: ${cntrNames}`);
  }
}

import {
  Compile,
  NearlyParser,
  NodeBuilder,
  TnNode,
  BlockNode,
  DefaultTnConfig,
} from '../dist';

function getNodeFromFile(path: string): BlockNode {
  return Compile.nodeFromFile(path, {
    typeNovelParser: new NearlyParser(),
    astMappers: [],
    astConverter: new NodeBuilder(DefaultTnConfig.markupMap || {}),
    nodeMappers: [],
  }) as BlockNode;
}

function getNodeFromLineNo(topNode: BlockNode, lineNo: number): BlockNode | undefined {
  const topPath = topNode.codePos.path;
  const nodes = topNode.queryNode((node: TnNode) => {
    return node.isBlockNode() && node.codePos.path === topPath && (<BlockNode>node).getRange().isInside(lineNo - 1);
  }).sort((n1, n2) => {
    return n2.codePos.line - n1.codePos.line;
  });
  if (nodes.length > 1 && nodes.every(n => n.codePos.line === nodes[0].codePos.line)) {
    return nodes[nodes.length - 1] as BlockNode;
  }
  return (nodes.length > 0) ? nodes[0] as BlockNode : undefined;
}

const topNode = getNodeFromFile('../tn-examples/example.tn');
const topRange = topNode.getRange();

for (let lineNo = 1; lineNo <= topRange.endLine + 1; lineNo++) {
  const node = getNodeFromLineNo(topNode, lineNo);
  if (!node) {
    continue;
  }
  const nodeRange = node.getRange();
  const cntrNames = node.getConstraints(true).map(cntr => cntr.key);
  console.log(`line: ${lineNo}, block: ${node.name}, range: ${nodeRange.startLine + 1} - ${nodeRange.endLine + 1}, cntrs: [${cntrNames}]`);
}

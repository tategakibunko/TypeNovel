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
  let nodes = topNode.queryNode((node: TnNode) => {
    return node.isBlockNode() && node.codePos.path === topPath && (<BlockNode>node).getRange().isInside(lineNo - 1);
  }).sort((n1, n2) => {
    return n2.codePos.line - n1.codePos.line;
  });
  const maxLine = nodes[0].codePos.line;
  nodes = nodes.filter(n => n.codePos.line === maxLine);

  // if same line, select deepest child.
  return (nodes.length > 0) ? nodes[nodes.length - 1] as BlockNode : undefined;
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

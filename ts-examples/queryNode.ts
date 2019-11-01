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
  const nodes = topNode.queryNode((node: TnNode) => {
    return (node.isBlockNode() && node.codePos.line < lineNo);
  }).sort((n1, n2) => {
    return n2.codePos.line - n1.codePos.line;
  });

  return (nodes.length > 0) ? nodes[0] as BlockNode : undefined;
}

const topNode = getNodeFromFile('../tn-examples/example.tn');
const range = topNode.getRange();

for (let line = 1; line <= range.endLine; line++) {
  const node = getNodeFromLineNo(topNode, line);
  if (!node) {
    continue;
  }
  const range = node.getRange();
  if (!range.isInside(line - 1)) {
    continue;
  }
  const cntrNames = node.getConstraints(true).map(cntr => cntr.key);
  console.log(`line: ${line}, block: ${node.name}, range: ${range.startLine + 1} - ${range.endLine + 1}, cntrs: [${cntrNames}]`);
}

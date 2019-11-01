import { Compile, NearlyParser, NodeBuilder, TnNode, BlockNode, NodeWhiteSpaceCleaner, DefaultTnConfig } from '../dist';

const topNode = Compile.nodeFromFile('../tn-examples/example.tn', {
  typeNovelParser: new NearlyParser(),
  astMappers: [],
  astConverter: new NodeBuilder(DefaultTnConfig.markupMap || {}),
  nodeMappers: [new NodeWhiteSpaceCleaner()]
}) as BlockNode;

const nodes = topNode.queryNode((node: TnNode) => {
  return (node.isBlockNode() && node.codePos.line <= 38);
}).sort((n1, n2) => {
  return n2.codePos.line - n1.codePos.line;
});

const foundNode = nodes[0] as BlockNode;
const definedConstraints = foundNode.getConstraints(true);
console.log(definedConstraints);
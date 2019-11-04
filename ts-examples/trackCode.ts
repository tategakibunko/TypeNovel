import {
  Compile,
  NearlyParser,
  NodeBuilder,
  TnNode,
  BlockNode,
  DefaultTnConfig,
  ValidationError,
  DuplicateConstraintChecker,
  UndefinedConstraintChecker,
  UnAnnotatedConstraintChecker,
} from '../dist';

const validators = [
  new DuplicateConstraintChecker(),
  new UndefinedConstraintChecker(),
  new UnAnnotatedConstraintChecker(),
];

function getNodeFromFile(path: string): BlockNode {
  return Compile.nodeFromFile(path, {
    typeNovelParser: new NearlyParser(),
    astMappers: [],
    astConverter: new NodeBuilder(DefaultTnConfig.markupMap || {}),
    nodeMappers: [],
  }) as BlockNode;
}

function getErrorsFromNode(node: TnNode): ValidationError[] {
  return validators
    .reduce((acm, validator) => {
      return acm.concat(node.acceptNodeValidator(validator));
    }, [] as ValidationError[])
    .sort((e1, e2) => e1.codePos.startLine - e2.codePos.startLine);
}

function getNodeFromLineNo(topNode: BlockNode, line: number): BlockNode | undefined {
  const topPath = topNode.codePos.path;
  let nodes = topNode.queryNode((node: TnNode) => {
    return node.isBlockNode() && node.codePos.path === topPath && (<BlockNode>node).getRange().isInside(line);
  }).sort((n1, n2) => {
    return n2.codePos.startLine - n1.codePos.startLine;
  });
  const maxLine = nodes[0].codePos.startLine;
  nodes = nodes.filter(n => n.codePos.startLine === maxLine);

  // if same line, select deepest child.
  return (nodes.length > 0) ? nodes[nodes.length - 1] as BlockNode : undefined;
}

const file = '../tn-examples/example.tn';
const topNode = getNodeFromFile(file);
const topRange = topNode.getRange();
const errors = getErrorsFromNode(topNode);

console.log(errors);

for (let line = 0; line <= topRange.endLine; line++) {
  const node = getNodeFromLineNo(topNode, line);
  if (!node) {
    continue;
  }
  const nodeRange = node.getRange();
  const cntrNames = node.getConstraints(true).map(cntr => cntr.key);
  console.log(`line: ${line + 1}, block: ${node.name}, range: ${nodeRange.startLine + 1} - ${nodeRange.endLine + 1}, cntrs: [${cntrNames}]`);
}

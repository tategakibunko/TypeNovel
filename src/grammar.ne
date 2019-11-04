@preprocessor typescript

@{%
import {
  Ast,
  Utils,
  Constraint,
  ConstraintCollection,
} from './modules';

const mlexer = require("./lexer");
const lexer = mlexer.lexer;
%}

@lexer lexer

main -> (stmt):* {% id %}

stmt ->
  plain {% id %}
| annot {% id %}
| block {% id %}

# Note that nearley creates nested dim for each grouping like '(a | b | c)'!
# So if you write like following, you must get each item by 'd[0][0]'.
# stmt -> (plain | annot | block) {% (d) => d[0][0] %}

plain -> text {%
  (d) => {
    const line = d[0].line - 1;
    const startColumn = d[0].col - 1;
    const endColumn = startColumn + d[0].value.length;
    // console.log('text start:', d[0]);
    return new Ast({
      type: 'text',
      name: '(text)',
      args: [],
      value: d[0].value,
      children: [],
      codePos: {line, startColumn, endColumn},
    });
  }
%}

annot -> %annotStart %annotName args {%
  (d) => {
    const line = d[0].line - 1;
    const startColumn = d[0].col - 1;
    const endColumn = startColumn + d[1].value.length + 1;
    // console.log('annot start:', d[0]);
    return new Ast({
      type:'annot',
      name: d[1].value,
      args: d[2] || [],
      value: '',
      children: [],
      codePos: {line, startColumn, endColumn},
    });
  }
%}

block -> %blockStart %blockName args %blockTextStart (stmt):* %blockTextEnd {%
  (d) => {
    const line = d[0].line - 1;
    const startColumn = d[0].col - 1;
    const endColumn = startColumn + d[1].value.length + 1;
    // console.log('block start:', d[0]);
    return new Ast({
      type: 'block',
      name: d[1].value,
      args: d[2] || [],
      value: '',
      children: extractBlockChildren(d[4]),
      codePos: {line, startColumn, endColumn},
    });
  }
%}

text ->
  %text {% id %}
| %textBeforeComment {% id %}
| %escape {%
  (d) => {
    d[0].value = d[0].value.substring(1);
    return d[0];
  }
%}

args -> %argsStart (exprs):? %argsEnd {% (d) => d[1]? d[1][0] : [] %}

exprs -> expr (%comma expr):* {% extractExprs %}

expr ->
  literal {% id %}
| number {% id %}
| array {% id %}
| object {% id %}

literal ->
  %literalSq {% (d) => extractLiteral(d[0].value) %}
| %literalDq {% (d) => extractLiteral(d[0].value) %}

number ->
  %integer {% (d) => parseInt(d[0].value, 10) %}
| %float {% (d) => parseFloat(d[0].value) %}

array ->
  %arrayStart %arrayEnd {% (d) => [] %}
| %arrayStart exprs %arrayEnd {% (d) => d[1] %}

object ->
  %objStart %objEnd {% (d) => { return {}; } %}
| %objStart pairs %objEnd {% (d) => d[1] %}

pairs -> pair (%comma pair):* (%comma):? {% extractPairs %}

pair -> symbol %colon expr {% extractPair %}

symbol ->
  %ident {% extractSymbol %}
| %literalSq {% extractSymbol %}
| %literalSq {% extractSymbol %}

@{%
function extractBlockChildren(children: any []): any [] {
  return children.map((child: any) => {
    return child instanceof Array ? child[0] : child;
  });
}

function extractExprs(d: any) {
  let output: any = [d[0]];
  for (let i in d[1]) {
    output.push(d[1][i][1]);
  }
  return output;
}

function extractLiteral(value: string) {
  if(value.startsWith("'")){
    return JSON.parse(Utils.sq2Dq(value));
  }
  if(value.startsWith('"')){
    return JSON.parse(value);
  }
  return value;
}

function extractSymbol(d: any) {
  const value = extractLiteral(d[0].value);
  const line = d[0].line - 1;
  const startColumn = d[0].col - 1;
  const endColumn = startColumn + d[0].value.length;
  return {value, line, startColumn, endColumn};
}

function extractPair(d: any) {
  const symbol = d[0];
  const key = symbol.value;
  const value = d[2];
  const line = symbol.line;
  const startColumn = symbol.startColumn;
  const endColumn = symbol.endColumn;
  const pos = {line, startColumn, endColumn};
  return new Constraint(key, value, pos);
}

function extractPairs(d: any) {
  let output: Constraint [] = [];
  output.push(d[0]);
  for (let i in d[1]) {
    output.push(d[1][i][1]);
  }
  return new ConstraintCollection(output);
}
%}

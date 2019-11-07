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
    const value = d[0].value;
    const codePos = {
      startLine: d[0].line - 1,
      endLine: d[0].line - 1 + value.split('\n').length - 1,
      startColumn: d[0].col - 1,
      endColumn: d[0].col - 1 + value.length
    };
    // console.log('text:%o, at %o', d[0], codePos);
    return new Ast({
      type: 'text',
      name: '(text)',
      args: [],
      value,
      children: [],
      codePos,
    });
  }
%}

annot -> %annotStart %annotName args {%
  (d) => {
    const codePos = {
      startLine: d[0].line - 1,
      endLine: d[0].line - 1,
      startColumn: d[0].col - 1,
      endColumn: d[0].col + d[1].value.length, // d[0].col - 1 + d[1].value.length + 1
    };
    // console.log('annot:%o, at %o', d[0], codePos);
    return new Ast({
      type:'annot',
      name: d[1].value,
      args: d[2] || [],
      value: '',
      children: [],
      codePos,
    });
  }
%}

block -> %blockStart %blockName args (%ws):* %blockTextStart (stmt):* %blockTextEnd {%
  (d) => {
    const codePos = {
      startLine: d[0].line - 1,
      endLine: d[6].line - 1,
      startColumn: d[0].col - 1,
      endColumn: d[6].col - 1,
    };
    // console.log('block start:%o, at %o', d[0], codePos);
    return new Ast({
      type: 'block',
      name: d[1].value,
      args: d[2] || [],
      value: '',
      children: extractBlockChildren(d[5]),
      codePos,
    });
  }
%}

text ->
  %text {% id %}
| %textBeforeComment {% id %}
| %ws {% id %}
| %escape {%
  (d) => {
    d[0].value = d[0].value.substring(1);
    return d[0];
  }
%}

# args = lparen ws expr ws (comma ws expr ws)* rparen
args -> %argsStart (%ws):* (exprs):? (%ws):* %argsEnd {% (d) => d[2]? d[2][0] : [] %}

exprs -> expr ((%ws):* %comma (%ws):* expr):* {% extractExprs %}

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
  %arrayStart (%ws):* %arrayEnd {% (d) => [] %}
| %arrayStart (%ws):* exprs (%ws):* %arrayEnd {% (d) => d[2] %}

object ->
  %objStart (%ws):* %objEnd {% (d) => { return {}; } %}
| %objStart (%ws):* pairs %objEnd {% (d) => d[1] %}

pairs -> pair ((%ws):* %comma (%ws):* pair):* (%comma):? (%ws):* {% extractPairs %}

pair -> symbol (%ws):* %colon (%ws):* expr {% extractPair %}

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
    output.push(d[1][i][3]);
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
  const codePos = {
    startLine: d[0].line - 1,
    endLine: d[0].line - 1,
    startColumn: d[0].col - 1,
    endColumn: d[0].col - 1 + d[0].value.length,
  };
  return {value, codePos};
}

function extractPair(d: any) {
  const symbol = d[0];
  const key = symbol.value;
  const value = d[4];
  return new Constraint(key, value, symbol.codePos);
}

function extractPairs(d: any) {
  let output: Constraint [] = [];
  output.push(d[0]);
  for (let i in d[1]) {
    output.push(d[1][i][3]);
  }
  return new ConstraintCollection(output);
}
%}

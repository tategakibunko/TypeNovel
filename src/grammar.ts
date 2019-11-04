// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var annotStart: any;
declare var annotName: any;
declare var blockStart: any;
declare var blockName: any;
declare var blockTextStart: any;
declare var blockTextEnd: any;
declare var text: any;
declare var textBeforeComment: any;
declare var escape: any;
declare var argsStart: any;
declare var argsEnd: any;
declare var comma: any;
declare var literalSq: any;
declare var literalDq: any;
declare var integer: any;
declare var float: any;
declare var arrayStart: any;
declare var arrayEnd: any;
declare var objStart: any;
declare var objEnd: any;
declare var colon: any;
declare var ident: any;

import {
  Ast,
  Utils,
  Constraint,
  ConstraintCollection,
} from './modules';

const mlexer = require("./lexer");
const lexer = mlexer.lexer;


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

interface NearleyToken {  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: NearleyToken) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["stmt"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": id},
    {"name": "stmt", "symbols": ["plain"], "postprocess": id},
    {"name": "stmt", "symbols": ["annot"], "postprocess": id},
    {"name": "stmt", "symbols": ["block"], "postprocess": id},
    {"name": "plain", "symbols": ["text"], "postprocess": 
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
        },
    {"name": "annot", "symbols": [(lexer.has("annotStart") ? {type: "annotStart"} : annotStart), (lexer.has("annotName") ? {type: "annotName"} : annotName), "args"], "postprocess": 
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
        },
    {"name": "block$ebnf$1", "symbols": []},
    {"name": "block$ebnf$1$subexpression$1", "symbols": ["stmt"]},
    {"name": "block$ebnf$1", "symbols": ["block$ebnf$1", "block$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "block", "symbols": [(lexer.has("blockStart") ? {type: "blockStart"} : blockStart), (lexer.has("blockName") ? {type: "blockName"} : blockName), "args", (lexer.has("blockTextStart") ? {type: "blockTextStart"} : blockTextStart), "block$ebnf$1", (lexer.has("blockTextEnd") ? {type: "blockTextEnd"} : blockTextEnd)], "postprocess": 
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
        },
    {"name": "text", "symbols": [(lexer.has("text") ? {type: "text"} : text)], "postprocess": id},
    {"name": "text", "symbols": [(lexer.has("textBeforeComment") ? {type: "textBeforeComment"} : textBeforeComment)], "postprocess": id},
    {"name": "text", "symbols": [(lexer.has("escape") ? {type: "escape"} : escape)], "postprocess": 
        (d) => {
          d[0].value = d[0].value.substring(1);
          return d[0];
        }
        },
    {"name": "args$ebnf$1$subexpression$1", "symbols": ["exprs"]},
    {"name": "args$ebnf$1", "symbols": ["args$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "args$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "args", "symbols": [(lexer.has("argsStart") ? {type: "argsStart"} : argsStart), "args$ebnf$1", (lexer.has("argsEnd") ? {type: "argsEnd"} : argsEnd)], "postprocess": (d) => d[1]? d[1][0] : []},
    {"name": "exprs$ebnf$1", "symbols": []},
    {"name": "exprs$ebnf$1$subexpression$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "expr"]},
    {"name": "exprs$ebnf$1", "symbols": ["exprs$ebnf$1", "exprs$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "exprs", "symbols": ["expr", "exprs$ebnf$1"], "postprocess": extractExprs},
    {"name": "expr", "symbols": ["literal"], "postprocess": id},
    {"name": "expr", "symbols": ["number"], "postprocess": id},
    {"name": "expr", "symbols": ["array"], "postprocess": id},
    {"name": "expr", "symbols": ["object"], "postprocess": id},
    {"name": "literal", "symbols": [(lexer.has("literalSq") ? {type: "literalSq"} : literalSq)], "postprocess": (d) => extractLiteral(d[0].value)},
    {"name": "literal", "symbols": [(lexer.has("literalDq") ? {type: "literalDq"} : literalDq)], "postprocess": (d) => extractLiteral(d[0].value)},
    {"name": "number", "symbols": [(lexer.has("integer") ? {type: "integer"} : integer)], "postprocess": (d) => parseInt(d[0].value, 10)},
    {"name": "number", "symbols": [(lexer.has("float") ? {type: "float"} : float)], "postprocess": (d) => parseFloat(d[0].value)},
    {"name": "array", "symbols": [(lexer.has("arrayStart") ? {type: "arrayStart"} : arrayStart), (lexer.has("arrayEnd") ? {type: "arrayEnd"} : arrayEnd)], "postprocess": (d) => []},
    {"name": "array", "symbols": [(lexer.has("arrayStart") ? {type: "arrayStart"} : arrayStart), "exprs", (lexer.has("arrayEnd") ? {type: "arrayEnd"} : arrayEnd)], "postprocess": (d) => d[1]},
    {"name": "object", "symbols": [(lexer.has("objStart") ? {type: "objStart"} : objStart), (lexer.has("objEnd") ? {type: "objEnd"} : objEnd)], "postprocess": (d) => { return {}; }},
    {"name": "object", "symbols": [(lexer.has("objStart") ? {type: "objStart"} : objStart), "pairs", (lexer.has("objEnd") ? {type: "objEnd"} : objEnd)], "postprocess": (d) => d[1]},
    {"name": "pairs$ebnf$1", "symbols": []},
    {"name": "pairs$ebnf$1$subexpression$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "pair"]},
    {"name": "pairs$ebnf$1", "symbols": ["pairs$ebnf$1", "pairs$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "pairs$ebnf$2$subexpression$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma)]},
    {"name": "pairs$ebnf$2", "symbols": ["pairs$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "pairs$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "pairs", "symbols": ["pair", "pairs$ebnf$1", "pairs$ebnf$2"], "postprocess": extractPairs},
    {"name": "pair", "symbols": ["symbol", (lexer.has("colon") ? {type: "colon"} : colon), "expr"], "postprocess": extractPair},
    {"name": "symbol", "symbols": [(lexer.has("ident") ? {type: "ident"} : ident)], "postprocess": extractSymbol},
    {"name": "symbol", "symbols": [(lexer.has("literalSq") ? {type: "literalSq"} : literalSq)], "postprocess": extractSymbol},
    {"name": "symbol", "symbols": [(lexer.has("literalSq") ? {type: "literalSq"} : literalSq)], "postprocess": extractSymbol}
  ],
  ParserStart: "main",
};

export default grammar;

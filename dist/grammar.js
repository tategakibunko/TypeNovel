"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d) { return d[0]; }
var modules_1 = require("./modules");
var mlexer = require("./lexer");
var lexer = mlexer.lexer;
mlexer.debug = true;
function extractBlockChildren(children) {
    return children.map(function (child) {
        return child instanceof Array ? child[0] : child;
    });
}
function extractExprs(d) {
    var output = [d[0]];
    for (var i in d[1]) {
        output.push(d[1][i][1]);
    }
    return output;
}
function extractPair(kv, output) {
    if (kv[0]) {
        output[kv[0]] = kv[1];
    }
}
function extractPairs(d) {
    var output = {};
    extractPair(d[0], output);
    for (var i in d[1]) {
        extractPair(d[1][i][1], output);
    }
    return output;
}
;
;
;
;
var grammar = {
    Lexer: lexer,
    ParserRules: [
        { "name": "main$ebnf$1", "symbols": [] },
        { "name": "main$ebnf$1$subexpression$1", "symbols": ["stmt"] },
        { "name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "main", "symbols": ["main$ebnf$1"], "postprocess": id },
        { "name": "stmt", "symbols": ["plain"], "postprocess": id },
        { "name": "stmt", "symbols": ["annot"], "postprocess": id },
        { "name": "stmt", "symbols": ["block"], "postprocess": id },
        { "name": "plain", "symbols": ["text"], "postprocess": function (d) {
                // console.log('text start:', d[0]);
                return new modules_1.Ast({
                    type: 'text',
                    name: '(text)',
                    args: [],
                    value: d[0].value,
                    children: [],
                    codePos: { line: d[0].line, col: d[0].col }
                });
            }
        },
        { "name": "annot", "symbols": [(lexer.has("annotStart") ? { type: "annotStart" } : annotStart), (lexer.has("annotName") ? { type: "annotName" } : annotName), "args"], "postprocess": function (d) {
                // console.log('annot start:', d[0]);
                return new modules_1.Ast({
                    type: 'annot',
                    name: d[1].value,
                    args: d[2] || [],
                    value: '',
                    children: [],
                    codePos: { line: d[0].line, col: d[0].col }
                });
            }
        },
        { "name": "block$ebnf$1", "symbols": [] },
        { "name": "block$ebnf$1$subexpression$1", "symbols": ["stmt"] },
        { "name": "block$ebnf$1", "symbols": ["block$ebnf$1", "block$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "block", "symbols": [(lexer.has("blockStart") ? { type: "blockStart" } : blockStart), (lexer.has("blockName") ? { type: "blockName" } : blockName), "args", (lexer.has("blockTextStart") ? { type: "blockTextStart" } : blockTextStart), "block$ebnf$1", (lexer.has("blockTextEnd") ? { type: "blockTextEnd" } : blockTextEnd)], "postprocess": function (d) {
                // console.log('block start:', d[0]);
                return new modules_1.Ast({
                    type: 'block',
                    name: d[1].value,
                    args: d[2] || [],
                    value: '',
                    children: extractBlockChildren(d[4]),
                    codePos: { line: d[0].line, col: d[0].col }
                });
            }
        },
        { "name": "text", "symbols": [(lexer.has("text") ? { type: "text" } : text)], "postprocess": id },
        { "name": "text", "symbols": [(lexer.has("textBeforeComment") ? { type: "textBeforeComment" } : textBeforeComment)], "postprocess": id },
        { "name": "text", "symbols": [(lexer.has("escape") ? { type: "escape" } : escape)], "postprocess": function (d) {
                d[0].value = d[0].value.substring(1);
                return d[0];
            }
        },
        { "name": "args$ebnf$1$subexpression$1", "symbols": ["exprs"] },
        { "name": "args$ebnf$1", "symbols": ["args$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "args$ebnf$1", "symbols": [], "postprocess": function () { return null; } },
        { "name": "args", "symbols": [(lexer.has("argsStart") ? { type: "argsStart" } : argsStart), "args$ebnf$1", (lexer.has("argsEnd") ? { type: "argsEnd" } : argsEnd)], "postprocess": function (d) { return d[1] ? d[1][0] : []; } },
        { "name": "exprs$ebnf$1", "symbols": [] },
        { "name": "exprs$ebnf$1$subexpression$1", "symbols": [(lexer.has("comma") ? { type: "comma" } : comma), "expr"] },
        { "name": "exprs$ebnf$1", "symbols": ["exprs$ebnf$1", "exprs$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "exprs", "symbols": ["expr", "exprs$ebnf$1"], "postprocess": extractExprs },
        { "name": "expr", "symbols": ["literal"], "postprocess": id },
        { "name": "expr", "symbols": ["number"], "postprocess": id },
        { "name": "expr", "symbols": ["array"], "postprocess": id },
        { "name": "expr", "symbols": ["object"], "postprocess": id },
        { "name": "literal", "symbols": [(lexer.has("literalSq") ? { type: "literalSq" } : literalSq)], "postprocess": function (d) { return JSON.parse(modules_1.Utils.sq2Dq(d[0].value)); } },
        { "name": "literal", "symbols": [(lexer.has("literalDq") ? { type: "literalDq" } : literalDq)], "postprocess": function (d) { return JSON.parse(d[0].value); } },
        { "name": "number", "symbols": [(lexer.has("number") ? { type: "number" } : number)], "postprocess": function (d) { return parseInt(d[0].value, 10); } },
        { "name": "array", "symbols": [(lexer.has("arrayStart") ? { type: "arrayStart" } : arrayStart), (lexer.has("arrayEnd") ? { type: "arrayEnd" } : arrayEnd)], "postprocess": function (d) { return []; } },
        { "name": "array", "symbols": [(lexer.has("arrayStart") ? { type: "arrayStart" } : arrayStart), "exprs", (lexer.has("arrayEnd") ? { type: "arrayEnd" } : arrayEnd)], "postprocess": function (d) { return d[1]; } },
        { "name": "object", "symbols": [(lexer.has("objStart") ? { type: "objStart" } : objStart), (lexer.has("objEnd") ? { type: "objEnd" } : objEnd)], "postprocess": function (d) { return {}; } },
        { "name": "object", "symbols": [(lexer.has("objStart") ? { type: "objStart" } : objStart), "pairs", (lexer.has("objEnd") ? { type: "objEnd" } : objEnd)], "postprocess": function (d) { return d[1]; } },
        { "name": "pairs$ebnf$1", "symbols": [] },
        { "name": "pairs$ebnf$1$subexpression$1", "symbols": [(lexer.has("comma") ? { type: "comma" } : comma), "pair"] },
        { "name": "pairs$ebnf$1", "symbols": ["pairs$ebnf$1", "pairs$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "pairs$ebnf$2$subexpression$1", "symbols": [(lexer.has("comma") ? { type: "comma" } : comma)] },
        { "name": "pairs$ebnf$2", "symbols": ["pairs$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "pairs$ebnf$2", "symbols": [], "postprocess": function () { return null; } },
        { "name": "pairs", "symbols": ["pair", "pairs$ebnf$1", "pairs$ebnf$2"], "postprocess": extractPairs },
        { "name": "pair", "symbols": ["pkey", (lexer.has("colon") ? { type: "colon" } : colon), "expr"], "postprocess": function (d) { return [d[0], d[2]]; } },
        { "name": "pkey", "symbols": [(lexer.has("ident") ? { type: "ident" } : ident)], "postprocess": function (d) { return d[0].value; } },
        { "name": "pkey", "symbols": ["literal"], "postprocess": id }
    ],
    ParserStart: "main",
};
exports.default = grammar;
//# sourceMappingURL=grammar.js.map
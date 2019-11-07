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
function extractBlockChildren(children) {
    return children.map(function (child) {
        return child instanceof Array ? child[0] : child;
    });
}
function extractExprs(d) {
    var output = [d[0]];
    for (var i in d[1]) {
        output.push(d[1][i][3]);
    }
    return output;
}
function extractLiteral(value) {
    if (value.startsWith("'")) {
        return JSON.parse(modules_1.Utils.sq2Dq(value));
    }
    if (value.startsWith('"')) {
        return JSON.parse(value);
    }
    return value;
}
function extractSymbol(d) {
    var value = extractLiteral(d[0].value);
    var codePos = {
        startLine: d[0].line - 1,
        endLine: d[0].line - 1,
        startColumn: d[0].col - 1,
        endColumn: d[0].col - 1 + d[0].value.length,
    };
    return { value: value, codePos: codePos };
}
function extractPair(d) {
    var symbol = d[0];
    var key = symbol.value;
    var value = d[4];
    return new modules_1.Constraint(key, value, symbol.codePos);
}
function extractPairs(d) {
    var output = [];
    output.push(d[0]);
    for (var i in d[1]) {
        output.push(d[1][i][3]);
    }
    return new modules_1.ConstraintCollection(output);
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
                var value = d[0].value;
                var codePos = {
                    startLine: d[0].line - 1,
                    endLine: d[0].line - 1 + value.split('\n').length - 1,
                    startColumn: d[0].col - 1,
                    endColumn: d[0].col - 1 + value.length
                };
                // console.log('text:%o, at %o', d[0], codePos);
                return new modules_1.Ast({
                    type: 'text',
                    name: '(text)',
                    args: [],
                    value: value,
                    children: [],
                    codePos: codePos,
                });
            }
        },
        { "name": "annot", "symbols": [(lexer.has("annotStart") ? { type: "annotStart" } : annotStart), (lexer.has("annotName") ? { type: "annotName" } : annotName), "args"], "postprocess": function (d) {
                var codePos = {
                    startLine: d[0].line - 1,
                    endLine: d[0].line - 1,
                    startColumn: d[0].col - 1,
                    endColumn: d[0].col + d[1].value.length,
                };
                // console.log('annot:%o, at %o', d[0], codePos);
                return new modules_1.Ast({
                    type: 'annot',
                    name: d[1].value,
                    args: d[2] || [],
                    value: '',
                    children: [],
                    codePos: codePos,
                });
            }
        },
        { "name": "block$ebnf$1", "symbols": [] },
        { "name": "block$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "block$ebnf$1", "symbols": ["block$ebnf$1", "block$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "block$ebnf$2", "symbols": [] },
        { "name": "block$ebnf$2$subexpression$1", "symbols": ["stmt"] },
        { "name": "block$ebnf$2", "symbols": ["block$ebnf$2", "block$ebnf$2$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "block", "symbols": [(lexer.has("blockStart") ? { type: "blockStart" } : blockStart), (lexer.has("blockName") ? { type: "blockName" } : blockName), "args", "block$ebnf$1", (lexer.has("blockTextStart") ? { type: "blockTextStart" } : blockTextStart), "block$ebnf$2", (lexer.has("blockTextEnd") ? { type: "blockTextEnd" } : blockTextEnd)], "postprocess": function (d) {
                var codePos = {
                    startLine: d[0].line - 1,
                    endLine: d[6].line - 1,
                    startColumn: d[0].col - 1,
                    endColumn: d[6].col - 1,
                };
                // console.log('block start:%o, at %o', d[0], codePos);
                return new modules_1.Ast({
                    type: 'block',
                    name: d[1].value,
                    args: d[2] || [],
                    value: '',
                    children: extractBlockChildren(d[5]),
                    codePos: codePos,
                });
            }
        },
        { "name": "text", "symbols": [(lexer.has("text") ? { type: "text" } : text)], "postprocess": id },
        { "name": "text", "symbols": [(lexer.has("textBeforeComment") ? { type: "textBeforeComment" } : textBeforeComment)], "postprocess": id },
        { "name": "text", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": id },
        { "name": "text", "symbols": [(lexer.has("escape") ? { type: "escape" } : escape)], "postprocess": function (d) {
                d[0].value = d[0].value.substring(1);
                return d[0];
            }
        },
        { "name": "args$ebnf$1", "symbols": [] },
        { "name": "args$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "args$ebnf$1", "symbols": ["args$ebnf$1", "args$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "args$ebnf$2$subexpression$1", "symbols": ["exprs"] },
        { "name": "args$ebnf$2", "symbols": ["args$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "args$ebnf$2", "symbols": [], "postprocess": function () { return null; } },
        { "name": "args$ebnf$3", "symbols": [] },
        { "name": "args$ebnf$3$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "args$ebnf$3", "symbols": ["args$ebnf$3", "args$ebnf$3$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "args", "symbols": [(lexer.has("argsStart") ? { type: "argsStart" } : argsStart), "args$ebnf$1", "args$ebnf$2", "args$ebnf$3", (lexer.has("argsEnd") ? { type: "argsEnd" } : argsEnd)], "postprocess": function (d) { return d[2] ? d[2][0] : []; } },
        { "name": "exprs$ebnf$1", "symbols": [] },
        { "name": "exprs$ebnf$1$subexpression$1$ebnf$1", "symbols": [] },
        { "name": "exprs$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "exprs$ebnf$1$subexpression$1$ebnf$1", "symbols": ["exprs$ebnf$1$subexpression$1$ebnf$1", "exprs$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "exprs$ebnf$1$subexpression$1$ebnf$2", "symbols": [] },
        { "name": "exprs$ebnf$1$subexpression$1$ebnf$2$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "exprs$ebnf$1$subexpression$1$ebnf$2", "symbols": ["exprs$ebnf$1$subexpression$1$ebnf$2", "exprs$ebnf$1$subexpression$1$ebnf$2$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "exprs$ebnf$1$subexpression$1", "symbols": ["exprs$ebnf$1$subexpression$1$ebnf$1", (lexer.has("comma") ? { type: "comma" } : comma), "exprs$ebnf$1$subexpression$1$ebnf$2", "expr"] },
        { "name": "exprs$ebnf$1", "symbols": ["exprs$ebnf$1", "exprs$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "exprs", "symbols": ["expr", "exprs$ebnf$1"], "postprocess": extractExprs },
        { "name": "expr", "symbols": ["literal"], "postprocess": id },
        { "name": "expr", "symbols": ["number"], "postprocess": id },
        { "name": "expr", "symbols": ["array"], "postprocess": id },
        { "name": "expr", "symbols": ["object"], "postprocess": id },
        { "name": "literal", "symbols": [(lexer.has("literalSq") ? { type: "literalSq" } : literalSq)], "postprocess": function (d) { return extractLiteral(d[0].value); } },
        { "name": "literal", "symbols": [(lexer.has("literalDq") ? { type: "literalDq" } : literalDq)], "postprocess": function (d) { return extractLiteral(d[0].value); } },
        { "name": "number", "symbols": [(lexer.has("integer") ? { type: "integer" } : integer)], "postprocess": function (d) { return parseInt(d[0].value, 10); } },
        { "name": "number", "symbols": [(lexer.has("float") ? { type: "float" } : float)], "postprocess": function (d) { return parseFloat(d[0].value); } },
        { "name": "array$ebnf$1", "symbols": [] },
        { "name": "array$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "array$ebnf$1", "symbols": ["array$ebnf$1", "array$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "array", "symbols": [(lexer.has("arrayStart") ? { type: "arrayStart" } : arrayStart), "array$ebnf$1", (lexer.has("arrayEnd") ? { type: "arrayEnd" } : arrayEnd)], "postprocess": function (d) { return []; } },
        { "name": "array$ebnf$2", "symbols": [] },
        { "name": "array$ebnf$2$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "array$ebnf$2", "symbols": ["array$ebnf$2", "array$ebnf$2$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "array$ebnf$3", "symbols": [] },
        { "name": "array$ebnf$3$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "array$ebnf$3", "symbols": ["array$ebnf$3", "array$ebnf$3$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "array", "symbols": [(lexer.has("arrayStart") ? { type: "arrayStart" } : arrayStart), "array$ebnf$2", "exprs", "array$ebnf$3", (lexer.has("arrayEnd") ? { type: "arrayEnd" } : arrayEnd)], "postprocess": function (d) { return d[2]; } },
        { "name": "object$ebnf$1", "symbols": [] },
        { "name": "object$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "object$ebnf$1", "symbols": ["object$ebnf$1", "object$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "object", "symbols": [(lexer.has("objStart") ? { type: "objStart" } : objStart), "object$ebnf$1", (lexer.has("objEnd") ? { type: "objEnd" } : objEnd)], "postprocess": function (d) { return {}; } },
        { "name": "object$ebnf$2", "symbols": [] },
        { "name": "object$ebnf$2$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "object$ebnf$2", "symbols": ["object$ebnf$2", "object$ebnf$2$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "object", "symbols": [(lexer.has("objStart") ? { type: "objStart" } : objStart), "object$ebnf$2", "pairs", (lexer.has("objEnd") ? { type: "objEnd" } : objEnd)], "postprocess": function (d) { return d[1]; } },
        { "name": "pairs$ebnf$1", "symbols": [] },
        { "name": "pairs$ebnf$1$subexpression$1$ebnf$1", "symbols": [] },
        { "name": "pairs$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "pairs$ebnf$1$subexpression$1$ebnf$1", "symbols": ["pairs$ebnf$1$subexpression$1$ebnf$1", "pairs$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "pairs$ebnf$1$subexpression$1$ebnf$2", "symbols": [] },
        { "name": "pairs$ebnf$1$subexpression$1$ebnf$2$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "pairs$ebnf$1$subexpression$1$ebnf$2", "symbols": ["pairs$ebnf$1$subexpression$1$ebnf$2", "pairs$ebnf$1$subexpression$1$ebnf$2$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "pairs$ebnf$1$subexpression$1", "symbols": ["pairs$ebnf$1$subexpression$1$ebnf$1", (lexer.has("comma") ? { type: "comma" } : comma), "pairs$ebnf$1$subexpression$1$ebnf$2", "pair"] },
        { "name": "pairs$ebnf$1", "symbols": ["pairs$ebnf$1", "pairs$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "pairs$ebnf$2$subexpression$1", "symbols": [(lexer.has("comma") ? { type: "comma" } : comma)] },
        { "name": "pairs$ebnf$2", "symbols": ["pairs$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "pairs$ebnf$2", "symbols": [], "postprocess": function () { return null; } },
        { "name": "pairs$ebnf$3", "symbols": [] },
        { "name": "pairs$ebnf$3$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "pairs$ebnf$3", "symbols": ["pairs$ebnf$3", "pairs$ebnf$3$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "pairs", "symbols": ["pair", "pairs$ebnf$1", "pairs$ebnf$2", "pairs$ebnf$3"], "postprocess": extractPairs },
        { "name": "pair$ebnf$1", "symbols": [] },
        { "name": "pair$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "pair$ebnf$1", "symbols": ["pair$ebnf$1", "pair$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "pair$ebnf$2", "symbols": [] },
        { "name": "pair$ebnf$2$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
        { "name": "pair$ebnf$2", "symbols": ["pair$ebnf$2", "pair$ebnf$2$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "pair", "symbols": ["symbol", "pair$ebnf$1", (lexer.has("colon") ? { type: "colon" } : colon), "pair$ebnf$2", "expr"], "postprocess": extractPair },
        { "name": "symbol", "symbols": [(lexer.has("ident") ? { type: "ident" } : ident)], "postprocess": extractSymbol },
        { "name": "symbol", "symbols": [(lexer.has("literalSq") ? { type: "literalSq" } : literalSq)], "postprocess": extractSymbol },
        { "name": "symbol", "symbols": [(lexer.has("literalSq") ? { type: "literalSq" } : literalSq)], "postprocess": extractSymbol }
    ],
    ParserStart: "main",
};
exports.default = grammar;
//# sourceMappingURL=grammar.js.map
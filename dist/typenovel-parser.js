"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nearley = require('nearley');
var fs = __importStar(require("fs"));
var grammar_1 = __importDefault(require("./grammar"));
var modules_1 = require("./modules");
var NearlyParser = /** @class */ (function () {
    function NearlyParser() {
    }
    NearlyParser.prototype.createRootAst = function (children, opt) {
        var ast = new modules_1.Ast({
            type: 'block',
            name: opt.rootBlockName || modules_1.DefaultRootBlockName,
            codePos: { path: opt.path, startLine: 0, endLine: 0, startColumn: 0, endColumn: 0 },
            args: [],
            value: '',
            children: children,
        });
        return ast;
    };
    NearlyParser.prototype.astListFromFile = function (path) {
        var source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.astListFromString(source);
    };
    NearlyParser.prototype.astListFromString = function (source) {
        var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar_1.default));
        var results = parser.feed(source).results;
        if (results.length === 0) {
            console.error('Parsing failed!');
            return [];
        }
        if (results.length > 1) {
            console.error('Ambigous grammar!');
        }
        var astList = results[0].map(function (ret) { return ret[0]; });
        return astList;
    };
    NearlyParser.prototype.astFromFile = function (path, opt) {
        var source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.astFromString(source, __assign({ path: path }, opt));
    };
    NearlyParser.prototype.astFromString = function (source, opt) {
        var astList = this.astListFromString(source);
        // Ast[] -> Ast (wrap single top-level body)
        var ast = this.createRootAst(astList, opt);
        // expand $include(path)
        var astExpander = new modules_1.AstExpander(this);
        return ast.acceptAstMapper(astExpander, { path: opt.path });
    };
    return NearlyParser;
}());
exports.NearlyParser = NearlyParser;
//# sourceMappingURL=typenovel-parser.js.map
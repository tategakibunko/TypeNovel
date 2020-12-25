"use strict";
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
const nearley = require('nearley');
const fs = __importStar(require("fs"));
const grammar_1 = __importDefault(require("./grammar"));
const modules_1 = require("./modules");
class NearlyParser {
    createRootAst(children, opt) {
        let ast = new modules_1.Ast({
            type: 'block',
            name: opt.rootBlockName || modules_1.DefaultRootBlockName,
            codePos: { path: opt.path, startLine: 0, endLine: 0, startColumn: 0, endColumn: 0 },
            args: [],
            value: '',
            children,
        });
        return ast;
    }
    astListFromFile(path) {
        const source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.astListFromString(source);
    }
    astListFromString(source) {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar_1.default));
        const results = parser.feed(source).results;
        if (results.length === 0) {
            console.error('Parsing failed!');
            return [];
        }
        if (results.length > 1) {
            console.error('Ambigous grammar!');
        }
        const astList = results[0].map(ret => ret[0]);
        return astList;
    }
    astFromFile(path, opt) {
        const source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.astFromString(source, Object.assign({ path }, opt));
    }
    astFromString(source, opt) {
        const astList = this.astListFromString(source);
        // Ast[] -> Ast (wrap single top-level body)
        const ast = this.createRootAst(astList, opt);
        // expand $include(path)
        const astExpander = new modules_1.AstExpander(this);
        return ast.acceptAstMapper(astExpander, { path: opt.path });
    }
}
exports.NearlyParser = NearlyParser;
//# sourceMappingURL=typenovel-parser.js.map
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
var nearley = require('nearley');
var fs = __importStar(require("fs"));
var grammar_1 = __importDefault(require("./grammar"));
var modules_1 = require("./modules");
var NearlyParser = /** @class */ (function () {
    function NearlyParser() {
    }
    NearlyParser.prototype.astFromFile = function (path) {
        var source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.astFromString(source, path);
    };
    NearlyParser.prototype.astFromString = function (source, path) {
        var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar_1.default));
        var results = parser.feed(source).results;
        if (results.length === 0) {
            console.error('Parsing failed!');
            return [];
        }
        if (results.length > 1) {
            console.error('Ambigous grammar!');
        }
        var astExpander = new modules_1.AstExpander(this);
        return results[0].map(function (ret) { return ret[0]; }).map(function (ast) {
            return ast.acceptAstMapper(astExpander, { path: path });
        });
    };
    return NearlyParser;
}());
exports.NearlyParser = NearlyParser;
//# sourceMappingURL=typenovel-parser.js.map
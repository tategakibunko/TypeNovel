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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var modules_1 = require("./modules");
/*
export interface CompileArgs {
  path?: string; // source file path(optional)
  rootBlockName?: string;
  typeNovelParser: TypeNovelParser; // string -> Ast[]
  astMappers: AstMapper[]; // Ast -> Ast'
  astConverter: AstConverter; // Ast -> TnNode
  nodeMappers: NodeMapper[]; // TnNode -> TnNode'
  nodeValidators: NodeValidator[]; // TnNode -> ValidationError[]
  nodeFormatter: NodeFormatter; // TnNode -> string
}
*/
var Compile = /** @class */ (function () {
    function Compile() {
    }
    Compile.astFromFile = function (path, opt) {
        var source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.astFromString(source, __assign(__assign({}, opt), { path: path }));
    };
    Compile.astFromString = function (source, opt) {
        // String -> Ast []
        var astList = opt.typeNovelParser.astFromString(source, opt.path);
        // Ast[] -> Ast (wrap single top-level body)
        var ast = (astList.length === 1) ? astList[0] : new modules_1.Ast({
            type: 'block',
            name: opt.rootBlockName || modules_1.DefaultRootBlockName,
            codePos: { line: 0, startColumn: 0, endColumn: 0 },
            args: [],
            value: '',
            children: astList
        });
        // Ast -> Ast'
        ast = opt.astMappers.reduce(function (acm, mapper) {
            return acm.acceptAstMapper(mapper, { path: opt.path });
        }, ast);
        return ast;
    };
    Compile.nodeFromFile = function (path, opt) {
        var source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.nodeFromString(source, __assign(__assign({}, opt), { path: path }));
    };
    Compile.nodeFromString = function (source, opt) {
        var ast = this.astFromString(source, opt);
        // Ast -> TnNode
        var node = ast.acceptAstConverter(opt.astConverter);
        // TnNode -> TnNode'
        node = opt.nodeMappers.reduce(function (acm, mapper) {
            return acm.acceptNodeMapper(mapper);
        }, node);
        return node;
    };
    Compile.fromString = function (source, opt) {
        var node = this.nodeFromString(source, opt);
        // TnNode -> ValidationError[]
        var errors = opt.nodeValidators
            .reduce(function (acm, validator) {
            return acm.concat(node.acceptNodeValidator(validator));
        }, [])
            .sort(function (e1, e2) { return e1.codePos.line - e2.codePos.line; });
        // TnNode -> string
        var output = node.acceptNodeFormatter(opt.nodeFormatter, 0);
        return { output: output, errors: errors };
    };
    Compile.fromFile = function (path, opt) {
        var source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.fromString(source, __assign(__assign({}, opt), { path: path }));
    };
    return Compile;
}());
exports.Compile = Compile;
//# sourceMappingURL=compile.js.map
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
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
class Compile {
    static astFromFile(path, opt) {
        const source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.astFromString(source, Object.assign(Object.assign({}, opt), { path }));
    }
    static astFromString(source, opt) {
        // String -> Ast
        let ast = opt.typeNovelParser.astFromString(source, opt);
        // Ast -> Ast'
        ast = opt.astMappers.reduce((acm, mapper) => {
            return acm.acceptAstMapper(mapper, { path: opt.path });
        }, ast);
        return ast;
    }
    static nodeFromFile(path, opt) {
        const source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.nodeFromString(source, Object.assign(Object.assign({}, opt), { path }));
    }
    static nodeFromString(source, opt) {
        const ast = this.astFromString(source, opt);
        // Ast -> TnNode
        let node = ast.acceptAstConverter(opt.astConverter);
        // TnNode -> TnNode'
        node = opt.nodeMappers.reduce((acm, mapper) => {
            return acm.acceptNodeMapper(mapper);
        }, node);
        return node;
    }
    static fromString(source, opt) {
        const node = this.nodeFromString(source, opt);
        // TnNode -> ValidationError[]
        const errors = opt.nodeValidators
            .reduce((acm, validator) => {
            return acm.concat(node.acceptNodeValidator(validator));
        }, [])
            .sort((e1, e2) => e1.codePos.startLine - e2.codePos.startLine);
        // TnNode -> string
        const output = node.acceptNodeFormatter(opt.nodeFormatter, 0);
        return { output, errors };
    }
    static fromFile(path, opt) {
        const source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.fromString(source, Object.assign(Object.assign({}, opt), { path }));
    }
}
exports.Compile = Compile;
//# sourceMappingURL=compile.js.map
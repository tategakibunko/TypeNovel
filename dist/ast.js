"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules");
const fs = __importStar(require("fs"));
class Ast {
    constructor(args) {
        this.type = args.type;
        this.name = args.name;
        this.codePos = args.codePos;
        this.args = args.args;
        this.value = args.value;
        this.children = args.children;
    }
    isWhiteSpace() {
        return this.type === 'text' && this.value.replace(/\s+/g, '') === '';
    }
    filterChildren(fn) {
        this.children = this.children.filter(child => fn(child));
        return this;
    }
    mapChildren(fn) {
        this.children = this.children.map(child => fn(child));
        return this;
    }
    expandInclude(parser, path) {
        if (this.type === 'annot' && this.name === 'include') {
            const filepath = modules_1.Utils.getPath(this.args[0], path);
            // If file not exists, $include("foo.tn") will be compiled to <include>foo.tn</include>.
            return fs.existsSync(filepath) ? parser.astListFromFile(filepath) : [this];
        }
        return [this];
    }
    expandIncludedChildren(parser, path) {
        this.children = this.children.reduce((acm, child) => {
            return acm.concat(child.expandInclude(parser, path));
        }, []);
        return this;
    }
    acceptAstMapper(visitor, opt) {
        if (!this.codePos.path) {
            this.codePos.path = opt.path;
        }
        switch (this.type) {
            case 'text': return visitor.visitTextAst(this, opt);
            case 'annot': return visitor.visitAnnotAst(this, opt);
            case 'block': return visitor.visitBlockAst(this, opt);
            default: throw new Error(`undefined ast type(${this.type})`);
        }
    }
    acceptAstConverter(visitor, parent) {
        switch (this.type) {
            case 'text': return visitor.visitTextAst({
                name: this.name,
                value: this.value,
                codePos: this.codePos,
                parent,
            });
            case 'annot': return visitor.visitAnnotAst({
                name: this.name,
                key: '$' + this.name,
                args: this.args,
                codePos: this.codePos,
                parent,
            });
            case 'block': return visitor.visitBlockAst({
                name: this.name,
                args: this.args,
                key: '@' + this.name,
                codePos: this.codePos,
                children: this.children,
                parent,
            });
            default: throw new Error(`undefined ast type(${this.type})`);
        }
    }
}
exports.Ast = Ast;
//# sourceMappingURL=ast.js.map
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var modules_1 = require("./modules");
var fs = __importStar(require("fs"));
var Ast = /** @class */ (function () {
    function Ast(args) {
        this.type = args.type;
        this.name = args.name;
        this.codePos = args.codePos;
        this.args = args.args;
        this.value = args.value;
        this.children = args.children;
    }
    Ast.prototype.isWhiteSpace = function () {
        return this.type === 'text' && this.value.replace(/\s+/g, '') === '';
    };
    Ast.prototype.filterChildren = function (fn) {
        this.children = this.children.filter(function (child) { return fn(child); });
        return this;
    };
    Ast.prototype.mapChildren = function (fn) {
        this.children = this.children.map(function (child) { return fn(child); });
        return this;
    };
    Ast.prototype.expandInclude = function (parser, path) {
        if (this.type === 'annot' && this.name === 'include') {
            var filepath = modules_1.Utils.getPath(this.args[0], path);
            // If file not exists, $include("foo.tn") will be compiled to <include>foo.tn</include>.
            return fs.existsSync(filepath) ? parser.astListFromFile(filepath) : [this];
        }
        return [this];
    };
    Ast.prototype.expandIncludedChildren = function (parser, path) {
        this.children = this.children.reduce(function (acm, child) {
            return acm.concat(child.expandInclude(parser, path));
        }, []);
        return this;
    };
    Ast.prototype.acceptAstMapper = function (visitor, opt) {
        if (!this.codePos.path) {
            this.codePos.path = opt.path;
        }
        switch (this.type) {
            case 'text': return visitor.visitTextAst(this, opt);
            case 'annot': return visitor.visitAnnotAst(this, opt);
            case 'block': return visitor.visitBlockAst(this, opt);
            default: throw new Error("undefined ast type(" + this.type + ")");
        }
    };
    Ast.prototype.acceptAstConverter = function (visitor, parent) {
        switch (this.type) {
            case 'text': return visitor.visitTextAst({
                name: this.name,
                value: this.value,
                codePos: this.codePos,
                parent: parent,
            });
            case 'annot': return visitor.visitAnnotAst({
                name: this.name,
                key: '$' + this.name,
                args: this.args,
                codePos: this.codePos,
                parent: parent,
            });
            case 'block': return visitor.visitBlockAst({
                name: this.name,
                args: this.args,
                key: '@' + this.name,
                codePos: this.codePos,
                children: this.children,
                parent: parent,
            });
            default: throw new Error("undefined ast type(" + this.type + ")");
        }
    };
    return Ast;
}());
exports.Ast = Ast;
//# sourceMappingURL=ast.js.map
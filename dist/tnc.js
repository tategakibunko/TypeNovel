"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var modules_1 = require("./modules");
var Tnc = /** @class */ (function () {
    function Tnc() {
    }
    Tnc.init = function () {
        modules_1.Config.initTnConfig();
        console.log("'tnconfig.json' is generated.");
    };
    Tnc.exec = function (args) {
        // console.log(args);
        var path = modules_1.Utils.getPath(args.inputFile);
        var config = modules_1.Config.loadTnConfig(args.config || 'tnconfig.json');
        var rootBlockName = config.compilerOptions.rootBlockName || 'body';
        // String -> Ast[]
        var typeNovelParser = new modules_1.NearlyParser();
        // Ast[] -> Ast'[]
        var astMappers = [];
        // Ast[] -> TnNode[]
        var astConverter = new modules_1.NodeBuilder(config.markupMap || {});
        // TnNode[] -> TnNode[]
        var nodeMappers = [
            new modules_1.NodeWhiteSpaceCleaner(),
        ];
        // TnNode[] -> ValidationError[]
        var nodeValidators = [];
        if (config.compilerOptions.warnDuplicateConstraint) {
            nodeValidators.push(new modules_1.DuplicateConstraintChecker());
        }
        if (config.compilerOptions.warnUnannotatedConstraint) {
            nodeValidators.push(new modules_1.UnAnnotatedConstraintChecker());
        }
        if (config.compilerOptions.warnUndefinedConstraint) {
            nodeValidators.push(new modules_1.UndefinedConstraintChecker());
        }
        // TnNode[] -> string[]
        var format = args.format || 'html';
        var nodeFormatter = format === 'text' ? new modules_1.PlainTextFormatter() :
            (args.minify ? new modules_1.MinifiedHtmlFormatter() : new modules_1.StdHtmlFormatter());
        var compileArgs = {
            path: path,
            rootBlockName: rootBlockName,
            typeNovelParser: typeNovelParser,
            astMappers: astMappers,
            astConverter: astConverter,
            nodeMappers: nodeMappers,
            nodeValidators: nodeValidators,
            nodeFormatter: nodeFormatter,
        };
        return modules_1.Compile.fromFile(path, compileArgs);
    };
    return Tnc;
}());
exports.Tnc = Tnc;
//# sourceMappingURL=tnc.js.map
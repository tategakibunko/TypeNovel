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
var Tnc = /** @class */ (function () {
    function Tnc() {
    }
    Tnc.init = function () {
        modules_1.Config.initTnConfig();
        console.log("'tnconfig.json' is generated.");
    };
    Tnc.fromFile = function (inputFile, args) {
        var path = modules_1.Utils.getPath(inputFile);
        var source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.fromString(source, args, path);
    };
    Tnc.fromString = function (source, args, path) {
        // console.log(args);
        var config = modules_1.Config.loadTnConfig(args.config || 'tnconfig.json');
        var rootBlockName = config.compilerOptions.rootBlockName || 'body';
        // String -> Ast[]
        var typeNovelParser = new modules_1.NearlyParser();
        // Ast -> Ast'
        var astMappers = [];
        // Ast -> TnNode
        var astConverter = new modules_1.NodeBuilder(config.markupMap || {});
        // TnNode -> TnNode'
        var nodeMappers = [
            new modules_1.NodeWhiteSpaceCleaner(),
        ];
        // TnNode -> ValidationError[]
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
        // TnNode -> string[]
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
        return modules_1.Compile.fromString(source, compileArgs);
    };
    return Tnc;
}());
exports.Tnc = Tnc;
//# sourceMappingURL=tnc.js.map
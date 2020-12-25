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
class Tnc {
    static init() {
        modules_1.Config.initTnConfig();
        console.log("'tnconfig.json' is generated.");
    }
    static fromFile(inputFile, args) {
        const path = modules_1.Utils.getPath(inputFile);
        const source = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.fromString(source, args, path);
    }
    static fromString(source, args, path) {
        // console.log(args);
        const config = modules_1.Config.loadTnConfig(args.config || 'tnconfig.json');
        const rootBlockName = config.compilerOptions.rootBlockName || 'body';
        // String -> Ast[]
        let typeNovelParser = new modules_1.NearlyParser();
        // Ast -> Ast'
        let astMappers = [];
        // Ast -> TnNode
        let astConverter = new modules_1.NodeBuilder(config.markupMap || {});
        // TnNode -> TnNode'
        let nodeMappers = [
            new modules_1.NodeWhiteSpaceCleaner(),
        ];
        // TnNode -> ValidationError[]
        let nodeValidators = [];
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
        const format = args.format || 'html';
        const nodeFormatter = format === 'text' ? new modules_1.PlainTextFormatter() :
            (args.minify ? new modules_1.MinifiedHtmlFormatter() : new modules_1.StdHtmlFormatter());
        const compileArgs = {
            path,
            rootBlockName,
            typeNovelParser,
            astMappers,
            astConverter,
            nodeMappers,
            nodeValidators,
            nodeFormatter,
        };
        return modules_1.Compile.fromString(source, compileArgs);
    }
}
exports.Tnc = Tnc;
//# sourceMappingURL=tnc.js.map
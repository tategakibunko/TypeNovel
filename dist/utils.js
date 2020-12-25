"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
class Utils {
    static getPath(filename, fromFile) {
        // console.log('getPath: filename = %s, fromFile = %o', filename, fromFile);
        if (path.isAbsolute(filename)) {
            // console.log('finalpath:%s', filename);
            return filename;
        }
        const isRel = filename.indexOf(path.sep) >= 0;
        const dirname = fromFile ? path.dirname(fromFile) : isRel ? path.dirname(filename) : process.cwd();
        // console.log('dirname: %s', dirname);
        const basename = path.basename(filename);
        // console.log('basename: %s', basename);
        const finalpath = path.join(dirname, basename);
        // console.log('finalpath:%s', finalpath);
        return finalpath;
    }
    static escapeAttr(str) {
        return str
            .replace(/&/g, "&#38;")
            .replace(/</g, "&#60;")
            .replace(/>/g, "&#62;")
            .replace(/"/g, "&#34;")
            .replace(/'/g, "&#39;");
    }
    static escapeText(str) {
        return str
            .replace(/&/g, "&#38;")
            .replace(/</g, "&#60;")
            .replace(/>/g, "&#62;");
    }
    static camelToChain(str) {
        return str.replace(/([A-Z])/g, (m, p1) => `-${p1.toLowerCase()}`);
    }
    static sq2Dq(str) {
        return '"' + str.slice(1, -1) + '"';
    }
    // trim head space except \u3000(IDEOGRAPHIC SPACE)
    static trimHeadSpaces(str) {
        return str.replace(this.rexHeadSpaces, '');
    }
    static trimTailSpaces(str) {
        return str.replace(this.rexTailSpaces, '');
    }
    static trimSpaces(str) {
        let ret = this.trimHeadSpaces(str);
        ret = this.trimTailSpaces(ret);
        return ret;
    }
    static attributes(attrs) {
        return Object.keys(attrs).map(key => {
            const value = String(attrs[key]);
            return `${key}="${Utils.escapeAttr(value)}"`;
        }).join(' ');
    }
}
exports.Utils = Utils;
Utils.rexHeadSpaces = /^[\n\u0009-\u000D\u0020\u00A0\u2000-\u200B\uFEFF]+/g;
Utils.rexTailSpaces = /[\n\u0009-\u000D\u0020\u00A0\u2000-\u200B\uFEFF]+$/g;
;
//# sourceMappingURL=utils.js.map
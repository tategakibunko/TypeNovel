"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getPath = function (filename, fromFile) {
        // console.log('getPath: filename = %s, fromFile = %o', filename, fromFile);
        if (path.isAbsolute(filename)) {
            // console.log('finalpath:%s', filename);
            return filename;
        }
        var isRel = filename.indexOf(path.sep) >= 0;
        var dirname = fromFile ? path.dirname(fromFile) : isRel ? path.dirname(filename) : process.cwd();
        // console.log('dirname: %s', dirname);
        var basename = path.basename(filename);
        // console.log('basename: %s', basename);
        var finalpath = path.join(dirname, basename);
        // console.log('finalpath:%s', finalpath);
        return finalpath;
    };
    Utils.escapeAttr = function (str) {
        return str
            .replace(/&/g, "&#38;")
            .replace(/</g, "&#60;")
            .replace(/>/g, "&#62;")
            .replace(/"/g, "&#34;")
            .replace(/'/g, "&#39;");
    };
    Utils.escapeText = function (str) {
        return str
            .replace(/&/g, "&#38;")
            .replace(/</g, "&#60;")
            .replace(/>/g, "&#62;");
    };
    Utils.camelToChain = function (str) {
        return str.replace(/([A-Z])/g, function (m, p1) { return "-" + p1.toLowerCase(); });
    };
    Utils.sq2Dq = function (str) {
        return '"' + str.slice(1, -1) + '"';
    };
    // trim head space except \u3000(IDEOGRAPHIC SPACE)
    Utils.trimHeadSpaces = function (str) {
        return str.replace(this.rexHeadSpaces, '');
    };
    Utils.trimTailSpaces = function (str) {
        return str.replace(this.rexTailSpaces, '');
    };
    Utils.trimSpaces = function (str) {
        var ret = this.trimHeadSpaces(str);
        ret = this.trimTailSpaces(ret);
        return ret;
    };
    Utils.attributes = function (attrs) {
        return Object.keys(attrs).map(function (key) {
            var value = String(attrs[key]);
            return key + "=\"" + Utils.escapeAttr(value) + "\"";
        }).join(' ');
    };
    Utils.rexHeadSpaces = /^[\n\u0009-\u000D\u0020\u00A0\u2000-\u200B\uFEFF]+/g;
    Utils.rexTailSpaces = /[\n\u0009-\u000D\u0020\u00A0\u2000-\u200B\uFEFF]+$/g;
    return Utils;
}());
exports.Utils = Utils;
;
//# sourceMappingURL=utils.js.map
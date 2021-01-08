import * as path from 'path';

export class Utils {
  static rexHeadSpaces = /^[\n\u0009-\u000D\u0020\u00A0\u2000-\u200B\uFEFF]+/g;
  static rexTailSpaces = /[\n\u0009-\u000D\u0020\u00A0\u2000-\u200B\uFEFF]+$/g;

  static getPath(filename: string, fromFile?: string): string {
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

  static escapeAttr(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  static escapeText(str: string): string {
    // 2021/01/08 updated.
    // Make it enable to write html tag in annotation body.
    // [example]
    // $season("<ruby>師走<rt>しわす</rt></ruby>")
    return str;
    /*
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      */
  }

  static camelToChain(str: string): string {
    return str.replace(/([A-Z])/g, (m, p1) => `-${p1.toLowerCase()}`);
  }

  static sq2Dq(str: string): string {
    return '"' + str.slice(1, -1) + '"';
  }

  // trim head space except \u3000(IDEOGRAPHIC SPACE)
  static trimHeadSpaces(str: string): string {
    return str.replace(this.rexHeadSpaces, '');
  }

  static trimTailSpaces(str: string): string {
    return str.replace(this.rexTailSpaces, '');
  }

  static trimSpaces(str: string): string {
    let ret = this.trimHeadSpaces(str);
    ret = this.trimTailSpaces(ret);
    return ret;
  }

  static attributes(attrs: any): string {
    return Object.keys(attrs).map(key => {
      const value = String(attrs[key]);
      return `${key}="${Utils.escapeAttr(value)}"`;
    }).join(' ');
  }
};



export declare class Utils {
    static rexHeadSpaces: RegExp;
    static rexTailSpaces: RegExp;
    static getPath(filename: string, fromFile?: string): string;
    static escapeAttr(str: string): string;
    static escapeText(str: string): string;
    static camelToChain(str: string): string;
    static sq2Dq(str: string): string;
    static trimHeadSpaces(str: string): string;
    static trimTailSpaces(str: string): string;
    static trimSpaces(str: string): string;
    static attributes(attrs: any): string;
}

import { CompileResult } from './modules';
export declare type OutputFormat = 'text' | 'html';
export interface TncArgs {
    config?: string;
    minify?: boolean;
    format?: OutputFormat;
}
export declare class Tnc {
    static init(): void;
    static fromFile(inputFile: string, args: TncArgs): CompileResult;
    static fromString(source: string, args: TncArgs, path?: string): CompileResult;
}

import { CompileResult } from './modules';
export declare type OutputFormat = 'text' | 'html';
export interface TncArgs {
    config?: string;
    minify?: boolean;
    format?: OutputFormat;
    inputFile: string;
}
export declare class Tnc {
    static init(): void;
    static exec(args: TncArgs): CompileResult;
}

export declare type WhiteSpace = 'pre' | 'normal';
export interface CompilerOptions {
    rootBlockName?: string;
    blockIndentSize?: number;
    warnDuplicateConstraint?: boolean;
    warnUndefinedConstraint?: boolean;
    warnUnannotatedConstraint?: boolean;
}
export interface MarkupMapItem {
    tagName?: string;
    id?: string;
    className?: string;
    validate?: boolean;
    selfClosing?: boolean;
    whiteSpace?: WhiteSpace;
    content?: string;
    attributes?: {
        [attrKey: string]: string;
    };
}
export interface MarkupMap {
    [key: string]: MarkupMapItem;
}
export interface TnConfig {
    compilerOptions: CompilerOptions;
    markupMap?: MarkupMap;
}
export declare class Config {
    static initTnConfig(): void;
    static loadTnConfig(filename: string): TnConfig;
}

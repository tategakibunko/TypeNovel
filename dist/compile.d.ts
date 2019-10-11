import { TypeNovelParser, ValidationError, AstMapper, AstConverter, NodeMapper, NodeFormatter, NodeValidator } from './modules';
export interface CompileResult {
    output: string;
    errors: ValidationError[];
}
export interface CompileArgs {
    path?: string;
    rootBlockName?: string;
    typeNovelParser: TypeNovelParser;
    astMappers: AstMapper[];
    astConverter: AstConverter;
    nodeMappers: NodeMapper[];
    nodeValidators: NodeValidator[];
    nodeFormatter: NodeFormatter;
}
export declare class Compile {
    static fromString(source: string, opt: CompileArgs): CompileResult;
    static fromFile(path: string, opt: CompileArgs): CompileResult;
}

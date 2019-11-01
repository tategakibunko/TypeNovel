import { Ast, TnNode, TypeNovelParser, ValidationError, AstMapper, AstConverter, NodeMapper, NodeFormatter, NodeValidator } from './modules';
export interface CompileResult {
    output: string;
    errors: ValidationError[];
}
export interface CompileAstArgs {
    path?: string;
    rootBlockName?: string;
    typeNovelParser: TypeNovelParser;
    astMappers: AstMapper[];
}
export interface CompileNodeArgs extends CompileAstArgs {
    astConverter: AstConverter;
    nodeMappers: NodeMapper[];
}
export interface CompileArgs extends CompileNodeArgs {
    nodeValidators: NodeValidator[];
    nodeFormatter: NodeFormatter;
}
export declare class Compile {
    static astFromFile(path: string, opt: CompileAstArgs): Ast;
    static astFromString(source: string, opt: CompileAstArgs): Ast;
    static nodeFromFile(path: string, opt: CompileNodeArgs): TnNode;
    static nodeFromString(source: string, opt: CompileNodeArgs): TnNode;
    static fromString(source: string, opt: CompileArgs): CompileResult;
    static fromFile(path: string, opt: CompileArgs): CompileResult;
}

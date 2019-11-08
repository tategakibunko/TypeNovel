import { Ast, CompileAstArgs } from './modules';
export interface TypeNovelParser {
    astListFromFile: (path: string) => Ast[];
    astListFromString: (source: string) => Ast[];
    astFromFile: (path: string, opt: CompileAstArgs) => Ast;
    astFromString: (source: string, opt: CompileAstArgs) => Ast;
}
export declare class NearlyParser implements TypeNovelParser {
    private createRootAst;
    astListFromFile(path: string): Ast[];
    astListFromString(source: string): Ast[];
    astFromFile(path: string, opt: CompileAstArgs): Ast;
    astFromString(source: string, opt: CompileAstArgs): Ast;
}

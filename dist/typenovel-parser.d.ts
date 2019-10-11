import { Ast } from './modules';
export interface TypeNovelParser {
    astFromFile: (path: string) => Ast[];
    astFromString: (source: string, path?: string) => Ast[];
}
export declare class NearlyParser implements TypeNovelParser {
    astFromFile(path: string): Ast[];
    astFromString(source: string, path?: string): Ast[];
}

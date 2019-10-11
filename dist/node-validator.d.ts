import { NodeValidator, BlockNode, AnnotNode, TextNode, CodePos, ValidationError } from './modules';
export interface ValidationError {
    message: string;
    codePos: CodePos;
}
export interface NodeValidator {
    visitTextNode: (node: TextNode, codePos: CodePos) => ValidationError[];
    visitAnnotNode: (node: AnnotNode, codePos: CodePos) => ValidationError[];
    visitBlockNode: (node: BlockNode, codePos: CodePos) => ValidationError[];
}
export declare class NoCheckValidator implements NodeValidator {
    visitTextNode(node: TextNode, codePos: CodePos): ValidationError[];
    visitAnnotNode(node: AnnotNode, codePos: CodePos): ValidationError[];
    visitBlockNode(node: BlockNode, codePos: CodePos): ValidationError[];
}
export declare class UndefinedConstraintChecker extends NoCheckValidator {
    visitAnnotNode(node: AnnotNode, codePos: CodePos): ValidationError[];
}
export declare class DuplicateConstraintChecker extends NoCheckValidator {
    visitBlockNode(node: BlockNode, codePos: CodePos): ValidationError[];
}
export declare class UnAnnotatedConstraintChecker extends NoCheckValidator {
    visitBlockNode(node: BlockNode, codePos: CodePos): ValidationError[];
}

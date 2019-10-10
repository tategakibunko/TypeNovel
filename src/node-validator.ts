import {
  NodeValidator,
  BlockNode,
  AnnotNode,
  TextNode,
  CodePos,
  ValidationError,
} from './modules';

export interface ValidationError {
  message: string;
  codePos: CodePos;
}

// TnNode -> ValidationError[]
export interface NodeValidator {
  visitTextNode: (node: TextNode, codePos: CodePos) => ValidationError[];
  visitAnnotNode: (node: AnnotNode, codePos: CodePos) => ValidationError[];
  visitBlockNode: (node: BlockNode, codePos: CodePos) => ValidationError[];
}

// do nothing, just for impl stub
export class NoCheckValidator implements NodeValidator {
  visitTextNode(node: TextNode, codePos: CodePos): ValidationError[] {
    return [];
  }

  visitAnnotNode(node: AnnotNode, codePos: CodePos): ValidationError[] {
    return [];
  }

  visitBlockNode(node: BlockNode, codePos: CodePos): ValidationError[] {
    return [];
  }
}

/*
  [example]

  constraint 'time' is not defined in constraint field,
  but annotated by $time('8:00').

  @scene({
    season: 'winter'
  }){
    It's $season('first snow')!
    It's already $time('8:00').
  }
*/
export class UndefinedConstraintChecker extends NoCheckValidator {
  visitAnnotNode(node: AnnotNode, codePos: CodePos): ValidationError[] {
    if (!node.isValidateTarget() || !node.isUndefinedAnnot()) {
      return [];
    }
    const message = `Undefined constraint '${node.name}' is annoted by '$${node.name}'.`;
    return [{ codePos, message }];
  }
}

/*
  [example]

  constraint 'season' is defined twice.

  @scene({
    season: 'winter'
  }){
    @scene({
      season: 'summer'
    }){
      $season('Xmas') has come!
    }
  }
*/
export class DuplicateConstraintChecker extends NoCheckValidator {
  visitBlockNode(node: BlockNode, codePos: CodePos): ValidationError[] {
    const dupCntrs: { codePos: CodePos, name: string }[] = node.getDuplicateConstraints();
    return dupCntrs.map(dupCntr => {
      const message = `'${dupCntr.name}' constraint is duplicate(already defined at line:${dupCntr.codePos.line}).`;
      return { codePos, message };
    });
  }
}

/*
  [example]

  constraint 'season' is defined,
  but not annotated in @scene body.

  @scene({
    season: 'winter'
  }){
    Hi there!
  }
*/
export class UnAnnotatedConstraintChecker extends NoCheckValidator {
  visitBlockNode(node: BlockNode, codePos: CodePos): ValidationError[] {
    const unAnnotatedCntrs: string[] = node.getUnAnnotatedConstraintNames();
    return unAnnotatedCntrs.map(cntrName => {
      const value = node.getConstraintValue(cntrName);
      const message = `constraint '${cntrName}(${value})' is not anntated in this '@${node.name}' block.`;
      return { codePos, message };
    });
  }
}

import {
  NodeValidator,
  Constraint,
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
    const message = `Undefined constraint '${node.name}' is annotated.`;
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
    const results = node.getDuplicateConstraints();
    return results.map(result => {
      const message = `constraint '${result.dupCntr.key}' is duplicated(already defined at line:${result.prevCntr.codePos.line + 1}).`;
      return { codePos: result.dupCntr.codePos, message };
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
    const unAnnotatedCntrs: Constraint[] = node.getUnAnnotatedConstraints();
    return unAnnotatedCntrs.map(cntr => {
      const value = node.getConstraintValue(cntr.key);
      const message = `constraint '${cntr.key}(${value})' is not anntated in '@${node.name}'(line:${codePos.line + 1}).`;
      return { codePos: cntr.codePos, message };
    });
  }
}

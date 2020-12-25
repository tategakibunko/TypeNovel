"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// do nothing, just for impl stub
class NoCheckValidator {
    visitTextNode(node, codePos) {
        return [];
    }
    visitAnnotNode(node, codePos) {
        return [];
    }
    visitBlockNode(node, codePos) {
        return [];
    }
}
exports.NoCheckValidator = NoCheckValidator;
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
class UndefinedConstraintChecker extends NoCheckValidator {
    visitAnnotNode(node, codePos) {
        if (!node.isValidateTarget() || !node.isUndefinedAnnot()) {
            return [];
        }
        const message = `Undefined constraint '${node.name}' is annotated.`;
        return [{ codePos, message }];
    }
}
exports.UndefinedConstraintChecker = UndefinedConstraintChecker;
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
class DuplicateConstraintChecker extends NoCheckValidator {
    visitBlockNode(node, codePos) {
        const results = node.getDuplicateConstraints();
        return results.map(result => {
            const message = `constraint '${result.dupCntr.key}' is duplicated(already defined at line:${result.prevCntr.codePos.startLine + 1}).`;
            return { codePos: result.dupCntr.codePos, message };
        });
    }
}
exports.DuplicateConstraintChecker = DuplicateConstraintChecker;
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
class UnAnnotatedConstraintChecker extends NoCheckValidator {
    visitBlockNode(node, codePos) {
        const unAnnotatedCntrs = node.getUnAnnotatedConstraints();
        return unAnnotatedCntrs.map(cntr => {
            const value = node.getConstraintValue(cntr.key);
            const message = `constraint '${cntr.key}(${value})' is not anntated in '@${node.name}'(line:${codePos.startLine + 1}).`;
            return { codePos: cntr.codePos, message };
        });
    }
}
exports.UnAnnotatedConstraintChecker = UnAnnotatedConstraintChecker;
//# sourceMappingURL=node-validator.js.map
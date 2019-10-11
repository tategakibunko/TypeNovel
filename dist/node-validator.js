"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// do nothing, just for impl stub
var NoCheckValidator = /** @class */ (function () {
    function NoCheckValidator() {
    }
    NoCheckValidator.prototype.visitTextNode = function (node, codePos) {
        return [];
    };
    NoCheckValidator.prototype.visitAnnotNode = function (node, codePos) {
        return [];
    };
    NoCheckValidator.prototype.visitBlockNode = function (node, codePos) {
        return [];
    };
    return NoCheckValidator;
}());
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
var UndefinedConstraintChecker = /** @class */ (function (_super) {
    __extends(UndefinedConstraintChecker, _super);
    function UndefinedConstraintChecker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UndefinedConstraintChecker.prototype.visitAnnotNode = function (node, codePos) {
        if (!node.isValidateTarget() || !node.isUndefinedAnnot()) {
            return [];
        }
        var message = "Undefined constraint '" + node.name + "' is annoted by '$" + node.name + "'.";
        return [{ codePos: codePos, message: message }];
    };
    return UndefinedConstraintChecker;
}(NoCheckValidator));
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
var DuplicateConstraintChecker = /** @class */ (function (_super) {
    __extends(DuplicateConstraintChecker, _super);
    function DuplicateConstraintChecker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DuplicateConstraintChecker.prototype.visitBlockNode = function (node, codePos) {
        var dupCntrs = node.getDuplicateConstraints();
        return dupCntrs.map(function (dupCntr) {
            var message = "'" + dupCntr.name + "' constraint is duplicate(already defined at line:" + dupCntr.codePos.line + ").";
            return { codePos: codePos, message: message };
        });
    };
    return DuplicateConstraintChecker;
}(NoCheckValidator));
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
var UnAnnotatedConstraintChecker = /** @class */ (function (_super) {
    __extends(UnAnnotatedConstraintChecker, _super);
    function UnAnnotatedConstraintChecker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnAnnotatedConstraintChecker.prototype.visitBlockNode = function (node, codePos) {
        var unAnnotatedCntrs = node.getUnAnnotatedConstraintNames();
        return unAnnotatedCntrs.map(function (cntrName) {
            var value = node.getConstraintValue(cntrName);
            var message = "constraint '" + cntrName + "(" + value + ")' is not anntated in this '@" + node.name + "' block.";
            return { codePos: codePos, message: message };
        });
    };
    return UnAnnotatedConstraintChecker;
}(NoCheckValidator));
exports.UnAnnotatedConstraintChecker = UnAnnotatedConstraintChecker;
//# sourceMappingURL=node-validator.js.map
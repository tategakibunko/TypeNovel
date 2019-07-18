namespace TypeNovel.Lib

module Types = begin
  open TypeNovel.Lib.Meta

  type Ast = Node list
  and Node = 
  | BlockNode of BlockName * BlockArgs * BlockBody * SrcRange * NodePos
  | AnnotNode of AnnotKey * InlineArgs * SrcRange * NodePos
  | TextNode of string * SrcRange
  and BlockName = string
  and BlockArgs = Expr list
  and BlockBody = Ast
  and InlineArgs = Expr list
  and AnnotKey = string
  and AnnotValue = Expr
  and Expr =
  | StrExpr of string
  | IntExpr of int
  | FloatExpr of float
  | ObjExpr of (ObjKey * ObjValue) list
  | ListExpr of Expr list
  | NegOpExpr of Expr
  and ObjKey = string
  and ObjValue = Expr
  and SrcRange = SrcPos * SrcPos
  and SrcPos = {
    pos_fname: string;
    pos_lnum: int;
    pos_bol: int;
    pos_cnum: int;
  }
  and NodePos = {
    uniqueId: int;
    mutable nth: int;
    mutable nthOfType: int;
    mutable index: int;
    mutable indexOfType: int;
  }

  type QuoteString = SingleQuote | DoubleQuote

  type TmplString = TmplString of string

  type Frame = (string * Expr) list

  type MarkupConfig = (OriginalMarkupName * MarkupMap) list
  and OriginalMarkupName = string
  and MarkupMap = {
    tagName: TmplString option;
    id: TmplString option;
    className: TmplString option;
    before: TmplString option;
    after: TmplString option;
    content: TmplString option;
    whiteSpace: string option;
    attributes: MarkupAttr array;
    validate: bool;
    selfClosing: bool;
  }
  and MarkupAttr = AttrName * AttrValue
  and AttrName = TmplString
  and AttrValue = TmplString

  type Config = {
    warnUnannotatedConstraint: bool;
    warnDuplicateConstraint: bool;
    warnUndefinedConstraint: bool;
    markupConfig: MarkupConfig;
  }

  let InitialConfig: Config = {
    warnUnannotatedConstraint = true;
    warnDuplicateConstraint = true;
    warnUndefinedConstraint = true;
    markupConfig = [];
  }

  type Environment = {
    version: string;
    mutable inputFile: string;
    mutable outputFile: string;
    mutable configFile: string;
    mutable initConfig: bool;
    mutable printVersion: bool;
    mutable printAst: bool;
    mutable printEnv: bool;
    mutable printUsage: bool;
    mutable release: bool;
    mutable config: Config;
  }

  let InitialEnv = {
    initConfig = false;
    version = Meta.Version;
    inputFile = "";
    outputFile = "";
    configFile = Meta.DefaultConfigFile;
    printVersion = false;
    printUsage = false;
    printAst = false;
    printEnv = false;
    release = false;
    config = InitialConfig;
  }

  type EvalContext = {
    output: string;
    env: Environment;
    constraints: Frame list;
    errors: (string * SrcRange) list;
  }
end

namespace TypeNovel.Lib

module Validate = begin
  open TypeNovel.Lib.Types

  let rec validate (env: Environment) (ast: Ast) =
    let ctx = validateAst (Context.create env) ast
    List.rev ctx.errors

  and validateAst (ctx: EvalContext) = function
  | [] -> ctx
  | node :: rest -> 
    let ctx' = validateNode {ctx with errors = []} node
    validateAst {ctx with errors = ctx'.errors @ ctx.errors}  rest

  and validateNode (ctx: EvalContext) = function
  | BlockNode(name, ObjExpr(kvs) :: rest, children, spos, npos) as node ->
    validateAst (validateBlockNode (Frame.push ctx kvs) node) children
  | BlockNode(_, _, children, _, _) as node -> validateAst (validateBlockNode ctx node) children
  | AnnotNode(_) as node -> validateAnnotNode ctx node
  | TextNode(_) -> ctx

  and validateBlockNode (ctx: EvalContext) = function
  | BlockNode(name, ObjExpr(kvs) :: rest, children, spos, npos) as node ->
    let mmapKey = Config.getMarkupMapKey node
    match Config.lookupMarkupMap ctx.env.config.markupConfig mmapKey with
    | Some(mmap) when not mmap.validate -> ctx
    | _ ->
      List.fold (fun ctx (key, value) ->
        let ctx' = validateConstraintIsUsed ctx key value spos children
        let ctx' = validateDuplicateAnnotKey ctx' key spos
        ctx'
      ) ctx kvs
  | BlockNode(_) -> ctx
  | _ -> failwith "validateBlock: Invalid argument(not a block node)."

  and validateAnnotNode (ctx: EvalContext) = function
  | AnnotNode(name, _, spos, npos) as node ->
    let mmapKey = Config.getMarkupMapKey node
    match Config.lookupMarkupMap ctx.env.config.markupConfig mmapKey with
    | Some(mmap) when not mmap.validate -> ctx
    | _ -> validateUndefinedAnnotKey ctx name spos
  | _ -> failwith "validateAnnotNode: Invalid argument(not a annot node)."

  and validateConstraintIsUsed (ctx: EvalContext) (key: string) (value: Expr) (pos: SrcRange) (nodes: Node list) = 
    match Ast.findAnnot key nodes, value with
    // [Update since v0.9.1]
    // If constraint value is "?", annotation check is ignored.
    //
    // [example] @scene({time:"?"}){} => <scene data-time='?'></scene>
    //
    // This is useful when you want to add attribute like 'data-time' to html,
    // but don't want to check whether annotation is declared or not.
    | _, StrExpr("?") -> ctx
    | None, _ -> 
      let error = sprintf "'%s' is not annotated in this block!" key
      {ctx with errors = (error, pos) :: ctx.errors}
    | _ -> ctx

  and validateUndefinedAnnotKey (ctx: EvalContext) (key: string) (pos: SrcRange) =
    match Frame.listup ctx key with
    | [] -> 
      let error = sprintf "undefined annotation '%s' is found!" key
      {ctx with errors = (error, pos) :: ctx.errors}
    | _ -> ctx

  and validateDuplicateAnnotKey (ctx: EvalContext) (key: string) (pos: SrcRange) =
    match Frame.listup ctx key with
    | [] -> ctx
    | [value] -> ctx
    | value :: rest ->
      let error = sprintf "duplicate annotation '%s' is found!" key
      {ctx with errors = (error, pos) :: ctx.errors}

end
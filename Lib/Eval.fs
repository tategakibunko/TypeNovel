namespace TypeNovel.Lib

module Eval = begin
  open TypeNovel.Lib.Types
  open System.Text.RegularExpressions

  let rec eval (env: Environment) (ast: Ast) =
    let output = evalAst (Context.create env) ast
    let output = Regex.Replace(output, "[\s]+$", "")
    output

  and evalAst (ctx: EvalContext) = function
  | [] -> ""
  | node :: rest -> (evalNode ctx node) + (evalAst ctx rest)

  and evalNode (ctx: EvalContext) = function
  | BlockNode(name, ObjExpr(kvs) :: args, body, spos, npos) as node -> evalBlockNode (Frame.push ctx kvs) node
  | BlockNode(name, _, body, spos, npos) as node -> evalBlockNode (Frame.push ctx []) node
  | AnnotNode(key, args, spos, npos) as node -> evalAnnotNode ctx node
  | TextNode(text, pos) -> text

  and evalBlockNode (ctx: EvalContext) = function
  | BlockNode(name, args, children, spos, npos) as node ->
    let mmapKey = Config.getMarkupMapKey node
    let mmapOpt = Config.lookupMarkupMap ctx.env.config.markupConfig mmapKey
    let tagName = evalOpenTagName name args npos mmapOpt
    let id = evalId name args npos mmapOpt |> StrUtils.spaceBeforeIfStr
    let className = evalClassName name args npos mmapOpt |> StrUtils.spaceBeforeIfStr
    let attrs = evalAttributes name args npos mmapOpt |> StrUtils.spaceBeforeIfStr
    let dataAttrs =  evalDatasetAttr args |> StrUtils.spaceBeforeIfStr
    let otag = "<" + tagName + id + className + attrs + dataAttrs + ">"
    let ctag = evalCloseTag ctx tagName
    let content = evalAst ctx children |> (evalTagContent ctx name args npos mmapOpt)
    otag + content + ctag
  | _ -> failwith "evalBlockNode: Invalid argument(not a block node)"

  and evalTagContent (ctx: EvalContext) (name: string) (args: Expr list) (npos: NodePos) (mmapOpt: MarkupMap option) (content: string) =
    let content = content |> evalTagContentPseudo name args npos mmapOpt
    match ctx.env.release with
    | true -> evalTagContentWhiteSpace mmapOpt content
    | false -> content

  and evalTagContentPseudo (name: string) (args: Expr list) (npos: NodePos) (mmapOpt: MarkupMap option) (content: string) =
    match mmapOpt with
    | Some(mmap) ->
      let before = evalPlaceHolderOpt name args npos "" mmap.before
      let after = evalPlaceHolderOpt name args npos "" mmap.after
      let content = match evalPlaceHolderOpt name args npos "" mmap.content with "" -> content | content' -> content'
      let content = if before <> "" || after <> "" then StrUtils.trimString content else content
      before + content + after
    | None -> content

  and evalTagContentWhiteSpace (mmapOpt: MarkupMap option) (content: string) =
    match mmapOpt with
    | Some(mmap) ->
      match mmap.whiteSpace with
      | Some("pre") -> content
      | _ -> StrUtils.trimWhiteSpaceNormal content
    | None -> StrUtils.trimWhiteSpaceNormal content

  and evalPlaceHolderOpt (name: string) (args: Expr list) (npos: NodePos) (ifNoneStr: string ) = function
  | None -> ifNoneStr
  | Some(tmpl) -> evalPlaceHolder name args npos tmpl

  and evalPlaceHolder (name: string) (args: Expr list) (npos: NodePos) (tmpl: TmplString) =
    let tmpl = TmplString (evalPlaceHolderName name tmpl)
    let tmpl = TmplString (evalPlaceHolderArgs args tmpl)
    let cont = evalPlaceHolderNodePos npos tmpl
    cont

  and evalPlaceHolderName (name: string) = function
  | TmplString tmpl -> Regex.Replace(tmpl, "<name>", name)

  and evalPlaceHolderArgs (args: Expr list) = function
  | TmplString(tmpl) ->
    let i = ref 1
    let cont = (List.fold (fun tmpl' arg ->
      let pholder: string = sprintf "<arg%d>" !i
      let pvalue: string = evalExpr arg
      i := !i + 1
      Regex.Replace(tmpl', pholder, pvalue)
    ) tmpl args)
    // remove uncaptured placeholders and chop head and tail.
    Regex.Replace(cont, "<arg\d>", "") |> StrUtils.trimString

  and evalPlaceHolderNodePos (npos: NodePos) = function
  | TmplString(cont) ->
    let cont = Regex.Replace(cont, "<nth>", string(npos.nth))
    let cont = Regex.Replace(cont, "<nthOfType>", string(npos.nthOfType))
    let cont = Regex.Replace(cont, "<index>", string(npos.index))
    let cont = Regex.Replace(cont, "<indexOfType>", string(npos.indexOfType))
    // remove uncaptured placeholders and chop head and tail.
    let cont = List.fold (fun cont pat -> Regex.Replace(cont, pat, "")) cont ["<nth>"; "<nthOfType>"; "<index>"; "<indexOfType>"]
    let cont = StrUtils.trimString cont
    cont

  and evalOpenTagName (name: string) (args: Expr list) (npos: NodePos) (mmapOpt: MarkupMap option) =
    match mmapOpt with
    | None -> name
    | Some(mmap) ->
      match evalPlaceHolderOpt name args npos "" mmap.tagName with
      | "" -> name
      | tagName -> tagName

  and evalCloseTag (ctx: EvalContext) (tagName: string) =
    sprintf "</%s>" tagName

  and evalId (name: string) (args: Expr list) (npos: NodePos) (mmapOpt: MarkupMap option) =
    match mmapOpt with
    | Some(mmap) ->
      match evalPlaceHolderOpt name args npos "" mmap.id with
      | "" -> ""
      | id -> sprintf "id='%s'" id
    | None -> ""

  and evalClassName (name: string) (args: Expr list) (npos: NodePos) (mmapOpt: MarkupMap option) =
    match mmapOpt with
    | Some(mmap) ->
      match evalPlaceHolderOpt name args npos "" mmap.className with
      | "" -> ""
      | className -> sprintf "class='%s'" className
    | None -> ""

  and evalAttributes (name: string) (args: Expr list) (npos: NodePos) (mmapOpt: MarkupMap option) =
    match mmapOpt with
    | Some(mmap) ->
      match mmap.attributes with
      | [||] -> ""
      | attrs -> Array.map (evalAttributeItem name args npos) attrs |> String.concat " " 
    | None -> ""

  and evalAttributeItem (name: string) (args: Expr list) (npos: NodePos) = function 
  | (tmplAttr, tmplValue) -> 
    let attr = evalPlaceHolder name args npos tmplAttr
    let value = evalPlaceHolder name args npos tmplValue
    match attr, value with
    | "", _ | _, "" -> ""
    | attr, value -> sprintf "%s='%s'" attr value

  and evalDatasetAttr = function
  | ObjExpr(constraints) :: _ ->
    List.map (function
    | (key, StrExpr str) -> sprintf "data-%s='%s'" key str // TODO(escape, camelCase -> snake-case)
    | (key, IntExpr i) -> sprintf "data-%s='%d'" key i
    | (key, FloatExpr f) -> sprintf "data-%s='%s'" key (string f)
    | _ -> "" // ignore if not str or int
    ) constraints |> List.filter ((<>) "") |> String.concat " "
  | _ -> ""

  and evalAnnotNode (ctx: EvalContext) = function
  | AnnotNode(_, args, spos, npos) as node ->
    let mmapKey = Config.getMarkupMapKey node
    let mmapOpt = Config.lookupMarkupMap ctx.env.config.markupConfig mmapKey
    let (name, content) = evalAnnotNodeContent ctx node // name -> name(with tree)
    let tagName = evalOpenTagName name args npos mmapOpt
    let className = evalClassName name args npos mmapOpt |> StrUtils.spaceBeforeIfStr
    let attrs = evalAttributes name args npos mmapOpt |> StrUtils.spaceBeforeIfStr
    let content = evalTagContent ctx name args npos mmapOpt content
    let otag = "<" + tagName + className + attrs + ">"
    let ctag = evalCloseTag ctx tagName
    otag + content + ctag
  | _ -> failwith "evalAnnotNode: Invalid argument(not a annot node)"

  (*
    [examples]

    // x is bind to string('foo') and call $x with string.
    @scene({x:"foo"}){
      $x("hello") // "hello"
    }
    // x is bind to 'string' and call $x with no args.
    @scene({x:"foo"}){
      $x() // "foo"
    }
    // x is bind to nothing and call $x with no args.
    @scene(){
      $x() // "$x"
    }
    // x is bind to nothing and call $x with string.
    @scene(){
      $x('hello') // "hello"
    }
    // x is bind to object and call $x with object key.
    @scene({x:{foo:"bar"}}){
      $x("foo") // "bar"
    }
    // x is bind to list and call $x with list index.
    @scene({x:[10,20,30]}){
      $x(0) // "10"
      $x(1) // "20"
      $x(2) // "30"
    }
    // x is bind to nothing and call $x with integer.
    @scene(){
      $x(0) // "0"
      $x(1) // "1"
      $x(2) // "2"
    }
  *)
  and evalAnnotNodeContent (ctx: EvalContext) = function
  | AnnotNode(name, (StrExpr(str) :: rest as args), spos, npos) ->
    match Frame.lookup ctx name with
    // @scene({x:{foo:"bar"}}){ $x("foo") } => "bar"
    | Some(ObjExpr(kvs) as obj) ->
      let (treeKey, content) = evalObjLookupExpr ctx obj args spos [name]
      // printfn "Object treeKey = %s" treeKey
      (treeKey, content)
    // @scene({x:"foo"}){ $x("hello") } => "hello"
    | _ -> (name, str)
  | AnnotNode(name, IntExpr(index) :: rest, spos, npos) ->
    match Frame.lookup ctx name with
    // @scene({x:[10,20,30]}){ $x(0) } => "10"
    | Some (ListExpr(items) as list) -> (name, evalListItemExpr ctx list index spos)
    // @scene(){ $x(0) } => "0"
    | _ -> (name, string(index))
  | AnnotNode(name, [], spos, npos) -> 
    match Frame.lookup ctx name with
    // @scene({x:"foo"}) { $x() } => "foo"
    | Some expr -> (name, evalExpr expr)
    // @scene(){ $x() } => ""
    | None -> (name, "")
  | _ -> failwith "evalAnnotNodeContent: Invalid argument(not a annot node)"

  and evalListItemExpr (ctx: EvalContext) (list: Expr) (index: int) pos =
    let (r1, _) = pos
    match list with
    | ListExpr list ->
      if index >= List.length list then
        failwith (sprintf "evalAnnotNode: Invalid list index %d(out of range) line = %d" index r1.pos_lnum)
      evalExpr (List.item index list)
    | _ -> failwith "evalListItemExpr: Invalid argument(not a list expr)"

  and evalObjLookupExpr (ctx: EvalContext) (obj: Expr) (args: Expr list) (pos: SrcRange) (ancestors: string list) =
    let (r1, _) = pos
    let treeKey = String.concat "-" ancestors
    match obj, args with
    | ObjExpr(_), [] -> (treeKey, "<obj>")
    | ObjExpr(kvs), arg :: rest -> 
      let key = evalExpr arg
      match Frame.lookupAssoc kvs key, rest with
      | Some (ObjExpr(_) as obj'), _ -> evalObjLookupExpr ctx obj' rest pos (ancestors @ [key])
      | Some (ListExpr(_) as list), IntExpr(index) :: _ -> (treeKey, evalListItemExpr ctx list index pos)
      | Some expr, _ -> (treeKey + "-" + key, evalExpr expr)
      | None, _ ->
        failwith (sprintf "evalObjLookupExpr: Undefined object key '%s' for %A line = %d" key obj r1.pos_lnum)
    | _ -> failwith (sprintf "evalObjLookupExpr: Invalid argument(not a obj expr) line = %d" r1.pos_lnum)

  and evalExpr = function
  | StrExpr(str) -> str
  | IntExpr(i) -> string(i)
  | FloatExpr(f) -> string(f)
  | ObjExpr(_) as obj -> sprintf "%A" obj
  | ListExpr(_) as list -> sprintf "%A" list
  | NegOpExpr(expr) -> evalNegOpExpr expr

  and evalNegOpExpr = function
  | IntExpr(i) -> string(-1 * i)
  | FloatExpr(f) -> string(-1.0 * f)
  | _ -> failwith "evalNegOpExpr: Invalid argument(not a numeral)"

end
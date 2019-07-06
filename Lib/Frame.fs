namespace TypeNovel.Lib

module Frame = begin
  open TypeNovel.Lib.Types

  let rec push (ctx: EvalContext) (kvs: Frame) =
    {ctx with constraints = kvs :: ctx.constraints}

  let rec lookup (ctx: EvalContext) (key: string) =
    match ctx.constraints with
    | [] -> None
    | kvs :: rest ->
      match lookupAssoc kvs key with
        | None -> lookup {ctx with constraints = rest} key
        | result -> result

  and lookupAssoc (kvs: Frame) (key: string) =
    match kvs with
    | [] -> None
    | (key', value) :: rest when key = key' -> Some(value)
    | kv :: rest -> lookupAssoc rest key

  and listup (ctx: EvalContext) (key: string) =
    List.fold (fun acm kvs ->
      match lookupAssoc kvs key with
      | None -> acm 
      | x -> x :: acm
    ) [] ctx.constraints

end

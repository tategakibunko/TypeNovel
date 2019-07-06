namespace TypeNovel.Lib

module Ast = begin
  open FSharp.Text.Lexing
  open Types

  let rec fromString text =
    let lexbuf = LexBuffer<char>.FromString text
    fromLexbuf lexbuf

  and fromFile (path: string) = 
    let reader = new System.IO.StreamReader(path)
    let lexbuf = LexBuffer<char>.FromTextReader reader
    lexbuf.StartPos <- {lexbuf.StartPos with pos_fname = path}
    lexbuf.EndPos <- {lexbuf.EndPos with pos_fname = path}
    fromLexbuf lexbuf

  and fromLexbuf lexbuf =
    Parser.start Lexer.token lexbuf |> (expandInclude lexbuf) |> initNodePos

  and expandInclude lexbuf nodes =
    List.fold (fun acm node ->
    match node with
    | AnnotNode("include", StrExpr(filename) :: rest, spos, npos) ->
      let dirname = 
        match lexbuf.StartPos.pos_fname with
        | "" -> System.IO.Directory.GetCurrentDirectory()
        | posFname -> System.IO.Path.GetDirectoryName(posFname)
      let path = System.IO.Path.Combine(dirname, filename)
      acm @ fromFile(path)
    | BlockNode(name, args, children, spos, npos) ->
      let children' = expandInclude lexbuf children
      acm @ [BlockNode(name, args, children', spos, npos)]
    | node -> acm @ [node]
    ) [] nodes

  and isIndexedNode = function
  | TextNode(_) -> false
  | _ -> true

  and nameOfNode = function
  | BlockNode(name, _, _, _, _) -> name
  | AnnotNode(name, _, _, _) -> name
  | TextNode(_) -> "(text)"

  and nodePosOfNode = function
  | BlockNode(_, _, _, _, npos) -> Some(npos)
  | AnnotNode(_, _, _, npos) -> Some(npos)
  | TextNode(_) -> None

  and childrenOfNode = function
  | BlockNode(_, _, children, _, _) -> children
  | _ -> []

  and setNodePosIndex (node: Node) (index: int) =
    match nodePosOfNode node with
    | Some(npos) -> npos.index <- index; npos.nth <- index + 1
    | None -> ()

  and setNodePosIndexOfType (node: Node) (indexOfType: int) =
    match nodePosOfNode node with
    | Some(npos) -> npos.indexOfType <- indexOfType; npos.nthOfType <- indexOfType + 1
    | None -> ()

  and initNodePos nodes =
    let indexedNodes = List.filter isIndexedNode nodes
    initNodePosIndex indexedNodes
    initNodePosIndexOfType indexedNodes
    nodes

  and initNodePosIndex indexedNodes =
    List.iteri (fun index node ->
      setNodePosIndex node index
      ignore (initNodePos (childrenOfNode node))
    ) indexedNodes

  and initNodePosIndexOfType indexedNodes =
    indexedNodes |> Seq.groupBy nameOfNode |> Seq.iter (fun (groupKey, seq) ->
      Seq.iteri (fun indexOfType node ->
        setNodePosIndexOfType node indexOfType
      ) seq
    )

  and findNode fn = function
  | [] -> None
  | (BlockNode(_, _, children, _, _) as node) :: rest ->
    match fn node with
    | true -> Some node
    | false ->
      match findNode fn children with
      | None -> findNode fn rest
      | result -> result
  | node :: rest -> if fn node then Some node else findNode fn rest

  and findAnnot (key: string) (nodes: Node list) =
    findNode (function
    | AnnotNode(key', _, _, _) -> key = key'
    | _ -> false
    ) nodes
end

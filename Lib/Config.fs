namespace TypeNovel.Lib

module Config = begin
  open TypeNovel.Lib.Types
  open FSharp.Data
  open JsonUtil

  let rec getMarkupMapKey = function
  | BlockNode(name, _, _, _, _) -> "@" + name
  | AnnotNode(name, _, _, _) -> "$" + name
  | _ -> failwith "Config.getMarkupKey: Invalid args(not a markup node)"

  let lookupMarkupMap (config: MarkupConfig) name =
    match List.tryFind (fun (entryName, _) -> entryName = name) config with
    | Some(_, markupMap) -> Some(markupMap)
    | _ -> None

  let rec parseMarkupConfig (config: JsonValue): MarkupConfig =
    match config.TryGetProperty("markupMap") with
    | Some config -> parseMarkupConfigEntry config
    | None -> []

  and parseMarkupConfigEntry (config: JsonValue): MarkupConfig =
    let tags = config.Properties()
    Array.foldBack (fun (name, body) acm ->
      (name, (parseMarkupConfigEntryTag name body)) :: acm
    ) tags []

  and parseMarkupConfigEntryTag (name: string) (json: JsonValue): MarkupMap =
    {
      tagName = getPropTmplStrOpt json "tagName";
      id = getPropTmplStrOpt json "id";
      className = getPropTmplStrOpt json "className";
      before = getPropTmplStrOpt json "before";
      after = getPropTmplStrOpt json "after";
      content = getPropTmplStrOpt json "content";
      whiteSpace = getPropStrOpt json "whiteSpace";
      attributes = parseMarkupConfigEntryTagAttrs json;
      validate = getPropBool json "validate" true;
      selfClosing = getPropBool json "selfClosing" false;
    }

  and parseMarkupConfigEntryTagAttrs (json: JsonValue): MarkupAttr array =
    let attrs = getPropArray json "attributes" [||]
    Array.map (fun (name: string, value: JsonValue) ->
      let tmplName = TmplString name
      let tmplValue = TmplString (value.AsString())
      (tmplName, tmplValue)
    ) attrs

  let createInitialConfig (): Config option =
    let icfg = InitialConfig
    let curdir = System.IO.Directory.GetCurrentDirectory()
    let path = System.IO.Path.Combine(curdir, Meta.DefaultConfigFile)
    match System.IO.File.Exists(path) with
    | true -> None // already exists.
    | false ->
      System.IO.File.WriteAllText(path, InitialTnConfig.value)
      Some(icfg)

  let load (filename: string): Config =
    let icfg = InitialConfig
    let curdir = System.IO.Directory.GetCurrentDirectory()
    let path = System.IO.Path.Combine(curdir, filename)
    match System.IO.File.Exists(path) with
    | false -> icfg
    | true -> 
      let src = System.IO.File.ReadAllText(path) in
      let config = JsonValue.Parse(src) in
      {InitialConfig with
        warnDuplicateConstraint = getPropBool config "warnDuplicateConstraint" true;
        warnUnannotatedConstraint = getPropBool config "warnUnannotatedConstraint" true;
        warnUndefinedConstraint = getPropBool config "warnUndefinedConstraint" true;
        markupConfig = parseMarkupConfig config;
      }
end
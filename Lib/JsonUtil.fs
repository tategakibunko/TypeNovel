namespace TypeNovel.Lib

module JsonUtil = begin
  open FSharp.Data
  open TypeNovel.Lib.Types

  let getPropStr (json: JsonValue) (prop: string) (defvalue: string) =
    match json.TryGetProperty(prop) with
    | Some(value) -> value.AsString()
    | None -> defvalue

  let getPropBool (json: JsonValue) (prop: string) (defvalue: bool) =
    match json.TryGetProperty(prop) with
    | Some(value) -> value.AsBoolean()
    | None -> defvalue

  let getPropArray (json: JsonValue) (prop: string) (defarray: (string * JsonValue) array) =
    match json.TryGetProperty(prop) with
    | Some(value) -> value.Properties()
    | _ -> defarray

  let getPropStrOpt (json: JsonValue) (prop: string) =
    match json.TryGetProperty(prop) with
    | Some(value) -> Some(value.AsString())
    | _ -> None

  let getPropTmplStrOpt (json: JsonValue) (prop: string) =
    match getPropStrOpt json prop with
    | Some(str) -> Some(TmplString(str))
    | None -> None
end
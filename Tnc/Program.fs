open TypeNovel.Lib
open TypeNovel.Lib.Types
open Argu

type CmdUsage = string

type CmdArgs =
| Init
| Version
| Usage
| Output of file: string
| Config of file: string
| Env
| Ast
| Release
//| [<MainCommand; ExactlyOnce; Last>] Input of file: string
| [<MainCommand; Last>] Input of file: string
with
  interface IArgParserTemplate with
    member s.Usage =
      match s with
      | Init -> "initialize tnconfig.json"
      | Version -> "print version"
      | Usage -> "print usage help"
      | Input _ -> "input filename"
      | Output _ -> "output filename"
      | Config _ -> "config filename"
      | Env -> "print env"
      | Ast -> "print ast"
      | Release -> "release mode(production mode)"

let parseCmdArgs (args: string []): (CmdUsage * CmdArgs list) =
  let parser = Argu.ArgumentParser.Create<CmdArgs>(programName = Meta.ProgramName)
  let result = parser.Parse args
  let cmdArgs = result.GetAllResults()
  let usage: CmdUsage = parser.PrintUsage()
  (usage, cmdArgs)

let createEnvFromCmdArgs args =
  let env: Environment = InitialEnv
  List.iter (function
  | Init -> env.initConfig <- true
  | Version -> env.printVersion <- true
  | Usage -> env.printUsage <- true
  | Input file -> env.inputFile <- file
  | Output file -> env.outputFile <- file
  | Config file -> env.configFile <- file
  | Env -> env.printEnv <- true
  | Ast -> env.printAst <- true
  | Release -> env.release <- true
  ) args
  env.config <- Config.load env.configFile
  env

let printError ((error: string), (pos: SrcRange)) =
  let (r1, r2) = pos
  stderr.WriteLine (sprintf "%s(line:%d) %s" r1.pos_fname (r1.pos_lnum + 1) error)

[<EntryPoint>]
let main(args) =    
  try
    let (usage, cmdArgs) = parseCmdArgs args
    let env = createEnvFromCmdArgs cmdArgs
    let curdir = System.IO.Directory.GetCurrentDirectory()
    if env.initConfig then
      match Config.createInitialConfig () with
      | Some(_) -> printfn "Created 'tnconfig.json'"
      | None -> printfn "'tnconfig.json' is already exists!"
    else if env.printVersion then
      printfn "typenovel(version:%s)" env.version
    else if env.printEnv then
      printfn "env:\n%A" env
    else if env.printUsage || (env.inputFile = "") then
      System.Console.WriteLine(usage)
    else
      let inputFilePath = System.IO.Path.Combine(curdir, env.inputFile)
      let ast = Ast.fromFile inputFilePath
      if env.printAst then
        printfn "%A" ast
      else
        let errors = Validate.validate env ast
        let output = (Eval.eval env ast) + "\n"
        if errors.Length > 0 then
          List.iter printError errors
        if env.outputFile = "" then
          stdout.WriteLine(output)
        else
          let inputFileDir = System.IO.Path.GetDirectoryName(inputFilePath)
          let outputFilePath = System.IO.Path.Combine(inputFileDir, env.outputFile)
          System.IO.File.WriteAllText(outputFilePath, output, System.Text.Encoding.UTF8)
  with
  | :? Argu.ArguException as exn -> System.Console.WriteLine(exn.Message)
  | error -> printfn "%A" error
  0

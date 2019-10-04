#r "paket: groupref FakeBuild //"
#load ".fake/build.fsx/intellisense.fsx"

open Fake.Core
open Fake.Core.TargetOperators
open Fake.DotNet
open Fake.IO
open Fake.IO.FileSystemOperators
open Fake.IO.Globbing.Operators

let version = "1.0.1"

Target.initEnvironment()
Target.create "Clean" <| fun _ ->
    !!(__SOURCE_DIRECTORY__ </> "**/bin")
    ++ (__SOURCE_DIRECTORY__ </> "**/obj")
    ++ (__SOURCE_DIRECTORY__ </> "dist/**")
    |> Shell.cleanDirs

Target.create "Build" <| fun _ ->
    let setParams (defaults : DotNet.BuildOptions) =
        { defaults with MSBuildParams =
                            { defaults.MSBuildParams with Verbosity = Some Minimal
                                                          NoLogo = true } }
    !!(__SOURCE_DIRECTORY__ </> "*.sln")
    |> Seq.iter (DotNet.build setParams)

Target.create "All" ignore
Target.create "Default" ignore

"Clean" ?=> "Build"
"Build" ==> "Default"
"Build" ==> "All"
"Clean" ==> "All"

Target.create "Publish" ignore

/// Creates targets to publish a `project` with given `runtimeId`.
/// Note: This code assumes that `project` follows _ProjectID_/_ProjectID_`.fsproj` convention.
let publish (project : string) (runtimeId : string) =
    let projectId = Path.getDirectory project
    let target = sprintf "Publish-%s" runtimeId
    let zipTarget = sprintf "Zip-%s" runtimeId
    let distBase = __SOURCE_DIRECTORY__ </> "dist" </> runtimeId
    let distDir = distBase </> projectId

    let setParam (defaults : DotNet.PublishOptions) =
        { defaults with OutputPath = Some distDir
                        Configuration = DotNet.Release
                        Runtime = Some runtimeId
                        SelfContained = Some true
                        MSBuildParams = { defaults.MSBuildParams with Verbosity = Some Minimal
                                                                      NoLogo = true } }
    Target.create target <| fun _ ->
        Directory.delete distDir
        Directory.ensure distDir
        DotNet.publish setParam project
    Target.create zipTarget <| fun _ ->
        !!(distDir </> "**") |> Zip.zip distBase (distBase </> (sprintf "%s-%s.zip" projectId version))
    target ==> zipTarget ==> "Publish" |> ignore
    ()

let tncPath = "Tnc/Tnc.fsproj"

[| "osx.10.14-x64"; "win-x64"; "linux-x64" |]
|> Seq.iter (publish tncPath)

Target.runOrDefault "Default"

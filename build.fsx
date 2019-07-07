#r "paket: groupref FakeBuild //"
#load ".fake/build.fsx/intellisense.fsx"
open Fake.Core
open Fake.DotNet
open Fake.IO
open Fake.IO.FileSystemOperators
open Fake.IO.Globbing.Operators
open Fake.Core.TargetOperators

Target.initEnvironment()

Target.create "Clean" (fun _ ->
    !! (__SOURCE_DIRECTORY__ </> "**/bin")
    ++ (__SOURCE_DIRECTORY__ </> "**/obj")
    |> Shell.cleanDirs
)

Target.create "Build" (fun _ ->
    !! (__SOURCE_DIRECTORY__ </> "*.sln")
    |> Seq.iter (DotNet.build id)
)

Target.create "All" ignore
Target.create "Default" ignore

"Clean" ?=> "Build"
"Build" ==> "Default"

"Build" ==> "All"
"Clean" ==> "All"

Target.runOrDefault "Default"

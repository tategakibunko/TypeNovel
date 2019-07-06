namespace Tests

open NUnit.Framework
open TypeNovel.Lib

[<TestStmts>]
type TestStmts () =
  let externalText = "this is external text!"
  let externalTextFile = "external-text.tn"
  let externalTextPath = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), externalTextFile)

  let externalScene = "@scene(){this is external scene!}"
  let externalSceneFile = "external-scene.tn"
  let externalScenePath = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), externalSceneFile)

  member this.EvalTn (src: string): string =
    let ast = Ast.fromString src
    let str = Eval.eval Types.InitialEnv ast
    str

  [<SetUp>]
  member this.Setup () =
    System.IO.File.WriteAllText(externalTextPath, externalText)
    System.IO.File.WriteAllText(externalScenePath, externalScene)

  [<TearDown>]
  member this.TearDown () =
    System.IO.File.Delete(externalTextPath)
    System.IO.File.Delete(externalScenePath)
  
  [<Test>]
  member this.TestIncludeText () =
    let actual = this.EvalTn("@scene(){$include('external-text.tn')}")
    Assert.AreEqual("<scene>this is external text!</scene>", actual)

  [<Test>]
  member this.TestIncludeScene () =
    let actual = this.EvalTn("@scene(){$include('external-scene.tn')}")
    Assert.AreEqual("<scene><scene>this is external scene!</scene></scene>", actual)

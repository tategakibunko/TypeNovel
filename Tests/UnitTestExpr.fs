namespace Tests

open NUnit.Framework
open TypeNovel.Lib

[<TestExpr>]
type TestExpr () =
  member this.EvalTn (src: string): string =
    let ast = Ast.fromString src
    let str = Eval.eval Types.InitialEnv ast
    str

  [<SetUp>]
  member this.Setup () =
    ()

  [<Test>]
  member this.TestTextNode () =
    let actual = this.EvalTn("@scene(){foo}")
    Assert.AreEqual("<scene>foo</scene>", actual)

  [<Test>]
  member this.TestAnnotSymbol () =
    let actual = this.EvalTn("@scene({foo:'bar'}){$foo()}")
    Assert.AreEqual("<scene data-foo='bar'><foo>bar</foo></scene>", actual)

  [<Test>]
  member this.TestAnnotString () =
    let actual = this.EvalTn("@scene({foo:'bar'}){$foo('baz')}")
    Assert.AreEqual("<scene data-foo='bar'><foo>baz</foo></scene>", actual)

  [<Test>]
  member this.TestAnnotInt () =
    let actual = this.EvalTn("@scene({age:10}){$age()}")
    Assert.AreEqual("<scene data-age='10'><age>10</age></scene>", actual)

  [<Test>]
  member this.TestAnnotFloat () =
    let actual = this.EvalTn("@scene({rate:0.58}){$rate()}")
    Assert.AreEqual("<scene data-rate='0.58'><rate>0.58</rate></scene>", actual)

  [<Test>]
  member this.TestAnnotObj1 () =
    let actual = this.EvalTn("@scene({foo:{bar:'baz'}}){$foo('bar')}")
    Assert.AreEqual("<scene><foo-bar>baz</foo-bar></scene>", actual)

  [<Test>]
  member this.TestAnnotObj2 () =
    let actual = this.EvalTn("@scene({foo:{bar:{baz:'hoge'}}}){$foo('bar', 'baz')}")
    Assert.AreEqual("<scene><foo-bar-baz>hoge</foo-bar-baz></scene>", actual)

  [<Test>]
  member this.TestAnnotListItem () =
    let actual = this.EvalTn("@scene({words:[1,2,'switch']}){$words(0), $words(1), $words(2)!}")
    Assert.AreEqual("<scene><words>1</words>, <words>2</words>, <words>switch</words>!</scene>", actual)

  [<Test>]
  member this.TestAnnotUndefined () =
    let actual = this.EvalTn("@scene(){$foo()}")
    Assert.AreEqual("<scene><foo></foo></scene>", actual)

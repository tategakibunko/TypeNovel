namespace Tests

open NUnit.Framework
open TypeNovel.Lib.StrUtils

[<TestStrUtils>]
type TestStrUtils () =
  [<SetUp>]
  member this.Setup () = ()

  [<TearDown>]
  member this.TearDown () = ()
  
  [<Test>]
  member this.TestEscapeGtLt () =
    let actual = escape("<script>")
    Assert.AreEqual("&#60;script&#62;", actual)

  [<Test>]
  member this.TestEscapeQuote () =
    let actual = escape("'meso'")
    Assert.AreEqual("&#39;meso&#39;", actual)

  [<Test>]
  member this.TestEscapeDoubleQuote () =
    let actual = escape("\"meso\"")
    Assert.AreEqual("&#34;meso&#34;", actual)

  [<Test>]
  member this.TestEscapeAmp () =
    let actual = escape("meso&hoge")
    Assert.AreEqual("meso&#38;hoge", actual)

  [<Test>]
  member this.TestCamelToChain () =
    let actual = camelToChain("fooBarBaz")
    Assert.AreEqual("foo-bar-baz", actual)


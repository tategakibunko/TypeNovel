namespace TypeNovel.Lib

module StrUtils = begin
  open System.Text.RegularExpressions

  let camelToChain (text: string) =
    Regex.Replace(text, "[A-Z]", fun (m: Match) -> 
      "-" + m.ToString().ToLower()
    )

  let escape (text: string) =
    let text = Regex.Replace(text, "&", "&#38;")
    let text = Regex.Replace(text, "<", "&#60;")
    let text = Regex.Replace(text, ">", "&#62;")
    let text = Regex.Replace(text, "\"", "&#34;")
    let text = Regex.Replace(text, "'", "&#39;")
    text

  let headTrimChars: char array = [|
    '\u0009';  // CHARACTER TABULATION
    '\u000A';  // LINE FEED
    '\u000B';  // LINE TABULATION
    '\u000C';  // FORM FEED
    '\u000D';  // CARRIAGE RETURN
    '\u0020';  // SPACE
    '\u00A0';  // NO-BREAK SPACE
    '\u2000';  // EN QUAD
    '\u2001';  // EM QUAD
    '\u2002';  // EN SPACE
    '\u2003';  // EM SPACE
    '\u2004';  // THREE-PER-EM SPACE
    '\u2005';  // FOUR-PER-EM SPACE
    '\u2006';  // SIX-PER-EM SPACE
    '\u2007';  // FIGURE SPACE
    '\u2008';  // PUNCTUATION SPACE
    '\u2009';  // THIN SPACE
    '\u200A';  // HAIR SPACE
    '\u200B';  // ZERO WIDTH SPACE
    // '\u3000';  // IDEOGRAPHIC SPACE
    '\uFEFF' // ZERO WIDTH NO-BREAK SPACE
  |]

  let trimString (text: string) =
    let text = text.TrimStart(headTrimChars)
    // \s of dotnet includes '\u3000'!!
    // let text = Regex.Replace(text, "^[\n\s]*", "")
    let text = Regex.Replace(text, "[\n\s]*$", "")
    text

  let trimWhiteSpaceNormal (text: string) =
    let text = trimString text
    let text = Regex.Replace(text, "\n[\s]+", "") // cut space after newline
    let text = Regex.Replace(text, "\n{2,}", " ") // compress multi-newline to single space
    let text = Regex.Replace(text, "\n", "") // remove rest newline
    text

  let spaceBeforeIfStr = function
  | "" -> ""
  | str -> " " + str
end

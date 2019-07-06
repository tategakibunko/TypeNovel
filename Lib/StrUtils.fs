namespace TypeNovel.Lib

module StrUtils = begin
  open System.Text.RegularExpressions

  let trimString (text: string) =
    let text = Regex.Replace(text, "^[\n\s]*", "")
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

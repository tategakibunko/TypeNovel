namespace TypeNovel.Lib

module Context = begin
  open TypeNovel.Lib.Types
  open FSharp.Collections

  let create (env: Environment) =
    {
      output = "";
      env = env;
      constraints = [];
      errors = [];
    }
end

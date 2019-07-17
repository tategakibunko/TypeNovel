namespace TypeNovel.Lib

module InitialTnConfig = begin
  let value = "{\n  \"warnDuplicateConstraint\": true,\n  \"warnUndefinedConstraint\": true,\n  \"warnUnannotatedConstraint\": true,\n  \"markupMap\": {\n    \"@pre\": {\n      \"whiteSpace\": \"pre\"\n    },\n    \"@scene\": {\n      \"tagName\": \"div\",\n      \"className\": \"<name> <arg2>\"\n    },\n    \"//\": \"[example]\",\n    \"//\": \"@speak('John'){ speech text here }\",\n    \"@speak\": {\n      \"tagName\": \"div\",\n      \"className\": \"speak\",\n      \"attributes\": {\n        \"data-character\": \"<arg1>\"\n      }\n    },\n    \"//\": \"[example]\",\n    \"//\": \"$ruby('\u6f22\u5b57', '\u304b\u3093\u3058')\",\n    \"$ruby\": {\n      \"validate\": false,\n      \"content\": \"<arg1><rt><arg2></rt>\"\n    }\n  }\n}\n"
end

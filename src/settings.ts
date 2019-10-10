import { TnConfig } from './modules';

export const DefaultRootBlockName = 'body';

export const DefaultTnConfig: TnConfig = {
  compilerOptions: {
    rootBlockName: DefaultRootBlockName,
    warnDuplicateConstraint: true,
    warnUndefinedConstraint: true,
    warnUnannotatedConstraint: true,
  },
  markupMap: {
    "@body": {
      "tagName": "div",
      "id": "tn-main",
    },
    "@pre": {
      "whiteSpace": "pre"
    },
    "@scene": {
      "tagName": "div",
      "className": "<name> <arg2>"
    },
    // [example]
    // @speak('John'){ speech text here }
    "@speak": {
      "tagName": "div",
      "className": "<name>",
      "attributes": {
        "data-character": "<arg1>"
      }
    },
    // [example]
    // sb = speech bubble, start or end is avatar position
    // @sb-start(<chara-key>, <img-key>){ speech text here }
    "@sb-start": {
      "tagName": "speech-bubble",
      "attributes": {
        "data-direction": "start",
        "data-chara-key": "<arg1>",
        "data-image-key": "<arg2>"
      }
    },
    "@sb-end": {
      "tagName": "speech-bubble",
      "attributes": {
        "data-direction": "end",
        "data-chara-key": "<arg1>",
        "data-image-key": "<arg2>"
      }
    },
    // paragraph, but treated as simple line (zero margin)
    "@line": {
      "tagName": "p",
      "className": "line"
    },
    "@dropcaps": {
      "tagName": "div",
      "className": "<name>",
      "validate": false
    },
    "$hr": {
      "validate": false,
      "selfClosing": true
    },
    // [example]
    // $ruby('漢字', 'かんじ')
    // $ruby('漢,字', 'かん,じ')
    "$ruby": {
      "tagName": "ruby-text",
      "validate": false,
      "attributes": {
        "data-rt": "<arg2>"
      }
    },
    "$br": {
      "validate": false,
      "selfClosing": true
    },
    // [example]
    // Inspired by Machi$notes('By Chunsoft@1998')
    "$notes": {
      "tagName": "<name>",
      "content": "<arg1>",
      "validate": false
    },
    // [example]
    // $tip('IMO', 'In my opinion'), it's correct.
    "$tip": {
      "tagName": "<name>",
      "content": "<arg2>",
      "validate": false,
      "attributes": {
        "data-title": "<arg1>"
      }
    },
    "@tip": {
      "tagName": "<name>",
      "attributes": {
        "data-title": "<arg1>"
      }
    },
    // [example]
    // $img(<img-path>, <width>, <height>, <'float start'|'float end'|''>)
    // $img('path/to/img.png', 100, 100, '')
    "$img": {
      "validate": false,
      "selfClosing": true,
      "className": "<arg4>",
      "attributes": {
        "src": "<arg1>",
        "width": "<arg2>",
        "height": "<arg3>"
      }
    },
    "$a": {
      "validate": false,
      "attributes": {
        "href": "<arg2>"
      }
    },
    "$b": {
      "validate": false
    },
    "$strong": {
      "validate": false
    },
    "$fdot": {
      "tagName": "span",
      "className": "empha filled dot",
      "validate": false
    },
    "$odot": {
      "tagName": "span",
      "className": "empha open dot",
      "validate": false
    },
    "$fcircle": {
      "tagName": "span",
      "className": "empha filled circle",
      "validate": false
    },
    "$ocircle": {
      "tagName": "span",
      "className": "empha open circle",
      "validate": false
    },
    "$ftriangle": {
      "tagName": "span",
      "className": "empha filled triangle",
      "validate": false
    },
    "$otriangle": {
      "tagName": "span",
      "className": "empha open triangle",
      "validate": false
    },
    "$fdcircle": {
      "tagName": "span",
      "className": "empha filled double circle",
      "validate": false
    },
    "$odcircle": {
      "tagName": "span",
      "className": "empha open double circle",
      "validate": false
    },
    "$fsesame": {
      "tagName": "span",
      "className": "empha filled sesame",
      "validate": false
    },
    "$osesame": {
      "tagName": "span",
      "className": "empha open sesame",
      "validate": false
    },
    // [example]
    // $icon('calendar outline')
    "$icon": {
      "tagName": "<name>",
      "className": "<arg1>",
      "content": "&#x20;",
      "validate": false
    },
    // [example]
    // $tcy('!?')
    "$tcy": {
      "tagName": "span",
      "className": "tcy",
      "validate": false
    },
    "$page-break": {
      "tagName": "hr",
      "className": "page break before",
      "selfClosing": true,
      "validate": false
    }
  }
};

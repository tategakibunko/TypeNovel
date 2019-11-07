const moo = require('moo');
const rexIdent = /[a-zA-Z][a-zA-Z0-9_]*/;
const rexTagName = /[a-zA-Z][a-zA-Z0-9_\-]*/;
const rexLiteralDq = /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/;
const rexLiteralSq = /'(?:\\['bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^'\\])*'/;
const rexInt = /\d+/
// [example]
// 0.1, 1.1, 1e10, 1.0e10, 1e+10, 1e-10, 1.0e-10 ...
const rexFloat = /\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/
const debug = false;

const skipTypes = [
  'skip',
  'lineCommentStart',
  'rangeCommentStart',
  'rangeCommentEnd',
  'lineCommentText',
  'rangeCommentText1',
  'rangeCommentText2',
];

const plainTextRule = {
  lineCommentStart: { match: '//', push: 'lineComment' },
  rangeCommentStart: { match: '/*', push: 'rangeComment' },
  escape: /\\[@${}\/]/,
  textBeforeComment: /[^@${}\\]*?(?=(?:\/\/|\/\*))/,  // (?=xxx) is positive lookahead
  text: { match: /[^@${}\\]+/, lineBreaks: true },
  annotStart: { match: '$', push: 'annot' },
  blockStart: { match: '@', push: 'block' },
};

const blockTextRule = {
  blockTextEnd: { match: '}', pop: true },
  ...plainTextRule,
};

/*
  [example]

  @scene({season: "winter"}){
    $season('xmas') has come!
    @p(){ this is it! }
  }
*/
const argsRule = function (argsEnd) {
  return {
    argsStart: '(',
    argsEnd: argsEnd,
    rangeCommentStart: { match: '/*', push: 'rangeComment' },
    comma: ',',
    objStart: { match: '{', push: 'object' },
    arrayStart: { match: '[', push: 'array' },
    literalDq: rexLiteralDq,
    literalSq: rexLiteralSq,
    float: rexFloat,
    integer: rexInt,
    ws: { match: /\s+/, lineBreaks: true },
  };
};

const lexer = moo.states({
  plain: plainTextRule,
  lineComment: {
    ws: { match: '\n', lineBreaks: true, pop: true },
    lineCommentText: /[^\n]+/,
  },
  rangeComment: {
    ws: { match: '\n', lineBreaks: true },
    rangeCommentEnd: { match: '*/', pop: true },
    rangeCommentText1: /[^\n]+(?=\*\/)/,
    rangeCommentText2: /[^\n]+/,
  },
  annot: {
    annotName: { match: rexTagName, next: 'annotArgs' },
    ws: { match: /\s+/, lineBreaks: true },
  },
  block: {
    blockName: { match: rexTagName, next: 'blockArgs' },
    blockTextStart: { match: '{', next: 'blockText' },
    ws: { match: /\s+/, lineBreaks: true },
  },
  blockText: blockTextRule,
  annotArgs: argsRule({ match: ')', pop: true }),
  blockArgs: argsRule({ match: ')', next: 'block' }),
  object: {
    lineCommentStart: { match: '//', push: 'lineComment' },
    rangeCommentStart: { match: '/*', push: 'rangeComment' },
    // (?=...) is positive look-ahead, so text of '...' is not included in matched result.
    skip: /\s*?(?=(?:\/\/|\/\*))/, // space between comment and args
    objStart: { match: '{', push: 'object' },
    objEnd: { match: '}', pop: true },
    colon: ':',
    comma: ',',
    ident: rexIdent,
    arrayStart: { match: '[', push: 'array' },
    literalDq: rexLiteralDq,
    literalSq: rexLiteralSq,
    float: rexFloat,
    integer: rexInt,
    ws: { match: /\s+/, lineBreaks: true },
  },
  array: {
    lineCommentStart: { match: '//', push: 'lineComment' },
    rangeCommentStart: { match: '/*', push: 'rangeComment' },
    skip: /\s*?(?=(?:\/\/|\/\*))/, // space between comment and args
    arrayEnd: { match: ']', pop: true },
    comma: ',',
    literalDq: rexLiteralDq,
    literalSq: rexLiteralSq,
    float: rexFloat,
    integer: rexInt,
    ws: { match: /\s+/, lineBreaks: true },
  }
});

lexer.next = (next => () => {
  let token;
  while ((token = next.call(lexer)) && skipTypes.indexOf(token.type) >= 0) {
    /*
    if (debug) {
      console.log('--- skip --- [%s, %s](%s) ... skip', token.type, lexer.state, token.value);
    }
    */
  };
  if (token && debug) {
    // console.log('[%s, %s](%s)', token.type, lexer.state, token.value);
    if (token.type === 'ws') {
      console.log('ws');
    } else {
      console.log('%s[%s]', token.type, token.value);
    }
  }
  return token;
})(lexer.next);

module.exports = {
  debug: debug,
  lexer: lexer,
};

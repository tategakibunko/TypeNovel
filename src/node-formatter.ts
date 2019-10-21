import {
  Utils,
  TnNode,
  BlockNode,
} from './modules';

const BLOCK_INDENT_SIZE = 2;

// TnNode -> string
export interface NodeFormatter {
  visitTextNode: (args: {
    content: string;
    isWhiteSpacePre: boolean;
    isFirstChild: boolean;
    isLastChild: boolean;
    prev?: TnNode;
    next?: TnNode;
    indent: number;
  }) => string;

  visitAnnotNode: (args: {
    name: string;
    tagName: string;
    id: string;
    className: string;
    attrs: any;
    content: string;
    selfClosing: boolean;
    prev?: TnNode;
    next?: TnNode;
    indent: number;
  }) => string;

  visitBlockNode: (args: {
    name: string;
    tagName: string;
    id: string;
    className: string;
    attrs: any;
    content?: string;
    children: TnNode[];
    prev?: TnNode;
    next?: TnNode;
    indent: number;
  }) => string;
}

function createOpenTag(args: {
  tagName: string;
  id: string;
  className: string;
  attrs: any;
}): string {
  const keys = Object.keys(args.attrs);
  const idAttr = args.id ? `id="${Utils.escapeAttr(args.id)}"` : '';
  const htmlAttr = keys.map(key => `${key}="${Utils.escapeAttr(args.attrs[key])}"`).join(' ');
  const classAttr = args.className ? `class="${Utils.escapeAttr(args.className)}"` : '';
  const attrField = [idAttr, classAttr, htmlAttr].filter(s => s !== '').join(' ');
  return attrField ? `<${args.tagName} ${attrField}>` : `<${args.tagName}>`;
}

function addIndent(text: string, size: number): string {
  for (let i = 0; i < size; i++) {
    text = ' ' + text;
  }
  return text;
}

/*
  Generate pretty print html

  [input]
  @div(){
    @p(){ foo }
  }

  [output]
  <div>
    <p>foo</p>
  </div>
*/
export class StdHtmlFormatter implements NodeFormatter {
  public visitTextNode(args: {
    content: string,
    isFirstChild: boolean,
    isLastChild: boolean,
    isWhiteSpacePre: boolean,
    prev?: TnNode;
    next?: TnNode;
    indent: number;
  }): string {
    let content = Utils.escapeText(args.content);
    if (args.isWhiteSpacePre) {
      return content;
    }
    if (args.isFirstChild) {
      content = Utils.trimHeadSpaces(content);
    }
    if (args.isLastChild) {
      content = Utils.trimTailSpaces(content);
    }
    return content;
  }

  public visitAnnotNode(args: {
    name: string;
    tagName: string;
    id: string;
    className: string;
    attrs: any;
    content: string;
    selfClosing: boolean;
    prev?: TnNode;
    next?: TnNode;
    indent: number;
  }): string {
    const openTag = createOpenTag({
      tagName: args.tagName,
      id: args.id,
      className: args.className,
      attrs: args.attrs
    });
    if (args.selfClosing) {
      return openTag;
    }
    const closeTag = `</${args.tagName}>`;
    const annotContent = Utils.escapeText(args.content);
    return openTag + annotContent + closeTag;
  }

  public visitBlockNode(args: {
    name: string;
    tagName: string;
    id: string;
    className: string;
    attrs: any;
    children: TnNode[];
    content?: string;
    prev?: TnNode;
    next?: TnNode;
    indent: number;
  }): string {
    const otag = createOpenTag({
      tagName: args.tagName,
      id: args.id,
      className: args.className,
      attrs: args.attrs
    });
    const ctag = `</${args.tagName}>`;
    if (args.content) {
      return addIndent(otag + args.content + ctag, args.indent) + '\n';
    }
    if (!args.children.some(child => child.isBlockNode())) {
      const body = args.children.reduce((acm, child) => {
        return acm + child.acceptNodeFormatter(this, args.indent);
      }, '');
      return addIndent(otag + body + ctag, args.indent) + '\n';
    }
    const body = args.children.reduce((acm, child) => {
      return acm + child.acceptNodeFormatter(this, args.indent + BLOCK_INDENT_SIZE);
    }, '');
    return addIndent(otag, args.indent) + '\n' + body + addIndent(ctag, args.indent) + '\n';
  }
}

/*
  Generate minified html(without indent)

  [input]
  @div(){}
    @p(){ foo }
  }

  [output]
  <div><p>foo</p></div>
*/
export class MinifiedHtmlFormatter extends StdHtmlFormatter {
  public visitBlockNode(args: {
    name: string;
    tagName: string;
    id: string;
    className: string;
    attrs: any;
    children: TnNode[];
    content?: string;
    prev?: TnNode;
    next?: TnNode;
    indent: number;
  }): string {
    const otag = createOpenTag({
      tagName: args.tagName,
      id: args.id,
      className: args.className,
      attrs: args.attrs
    });
    const ctag = `</${args.tagName}>`;
    const body = args.content ? Utils.escapeText(args.content) : args.children.reduce((acm, child) => {
      return acm += child.acceptNodeFormatter(this, args.indent);
    }, '');
    return otag + body + ctag;
  }
}

/*
  Generate plain text(without block tag)

  [input]
  @div(){
    @p(){ foo }
  }

  [output]
  foo
*/
export class PlainTextFormatter extends StdHtmlFormatter {
  public visitBlockNode(args: {
    name: string;
    tagName: string;
    id: string;
    className: string;
    attrs: any;
    children: TnNode[];
    content?: string;
    prev?: TnNode;
    next?: TnNode;
    indent: number;
  }): string {
    const body = args.content ? Utils.escapeText(args.content) : args.children.reduce((acm, child) => {
      return acm += child.acceptNodeFormatter(this, args.indent);
    }, '');
    return body + '\n';
  }
}


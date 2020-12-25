"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules");
const BLOCK_INDENT_SIZE = 2;
function createOpenTag(args) {
    const keys = Object.keys(args.attrs);
    const idAttr = args.id ? `id="${modules_1.Utils.escapeAttr(args.id)}"` : '';
    const htmlAttr = keys.map(key => `${key}="${modules_1.Utils.escapeAttr(args.attrs[key])}"`).join(' ');
    const classAttr = args.className ? `class="${modules_1.Utils.escapeAttr(args.className)}"` : '';
    const attrField = [idAttr, classAttr, htmlAttr].filter(s => s !== '').join(' ');
    return attrField ? `<${args.tagName} ${attrField}>` : `<${args.tagName}>`;
}
function createRubyContent(args) {
    const rbs = String(args[0]).split(',');
    const rts = String(args[1]).split(',');
    return rbs.reduce((acm, rb, index) => {
        return acm + `${modules_1.Utils.escapeText(rb)}<rt>${modules_1.Utils.escapeText(rts[index])}</rt>`;
    }, '');
}
function addIndent(text, size) {
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
class StdHtmlFormatter {
    visitTextNode(args) {
        let content = modules_1.Utils.escapeText(args.content);
        if (args.isWhiteSpacePre) {
            return content;
        }
        if (args.isFirstChild) {
            content = modules_1.Utils.trimHeadSpaces(content);
        }
        if (args.isLastChild) {
            content = modules_1.Utils.trimTailSpaces(content);
        }
        return content;
    }
    visitAnnotNode(args) {
        const otag = createOpenTag({
            tagName: args.tagName,
            id: args.id,
            className: args.className,
            attrs: args.attrs
        });
        if (args.selfClosing) {
            return otag;
        }
        const ctag = `</${args.tagName}>`;
        const annotContent = args.name === 'ruby' ? createRubyContent(args.args) : modules_1.Utils.escapeText(args.content);
        return otag + annotContent + ctag;
    }
    visitBlockNode(args) {
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
exports.StdHtmlFormatter = StdHtmlFormatter;
/*
  Generate minified html(without indent)

  [input]
  @div(){}
    @p(){ foo }
  }

  [output]
  <div><p>foo</p></div>
*/
class MinifiedHtmlFormatter extends StdHtmlFormatter {
    visitBlockNode(args) {
        const otag = createOpenTag({
            tagName: args.tagName,
            id: args.id,
            className: args.className,
            attrs: args.attrs
        });
        const ctag = `</${args.tagName}>`;
        const body = args.content ? modules_1.Utils.escapeText(args.content) : args.children.reduce((acm, child) => {
            return acm += child.acceptNodeFormatter(this, args.indent);
        }, '');
        return otag + body + ctag;
    }
}
exports.MinifiedHtmlFormatter = MinifiedHtmlFormatter;
/*
  Generate plain text(without block tag)

  [input]
  @div(){
    @p(){ foo }
  }

  [output]
  foo
*/
class PlainTextFormatter extends StdHtmlFormatter {
    visitBlockNode(args) {
        const body = args.content ? modules_1.Utils.escapeText(args.content) : args.children.reduce((acm, child) => {
            return acm += child.acceptNodeFormatter(this, args.indent);
        }, '');
        return body + '\n';
    }
}
exports.PlainTextFormatter = PlainTextFormatter;
//# sourceMappingURL=node-formatter.js.map
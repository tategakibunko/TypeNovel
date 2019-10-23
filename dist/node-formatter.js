"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var modules_1 = require("./modules");
var BLOCK_INDENT_SIZE = 2;
function createOpenTag(args) {
    var keys = Object.keys(args.attrs);
    var idAttr = args.id ? "id=\"" + modules_1.Utils.escapeAttr(args.id) + "\"" : '';
    var htmlAttr = keys.map(function (key) { return key + "=\"" + modules_1.Utils.escapeAttr(args.attrs[key]) + "\""; }).join(' ');
    var classAttr = args.className ? "class=\"" + modules_1.Utils.escapeAttr(args.className) + "\"" : '';
    var attrField = [idAttr, classAttr, htmlAttr].filter(function (s) { return s !== ''; }).join(' ');
    return attrField ? "<" + args.tagName + " " + attrField + ">" : "<" + args.tagName + ">";
}
function createRubyContent(args) {
    var rbs = String(args[0]).split(',');
    var rts = String(args[1]).split(',');
    return rbs.reduce(function (acm, rb, index) {
        return acm + (modules_1.Utils.escapeText(rb) + "<rt>" + modules_1.Utils.escapeText(rts[index]) + "</rt>");
    }, '');
}
function addIndent(text, size) {
    for (var i = 0; i < size; i++) {
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
var StdHtmlFormatter = /** @class */ (function () {
    function StdHtmlFormatter() {
    }
    StdHtmlFormatter.prototype.visitTextNode = function (args) {
        var content = modules_1.Utils.escapeText(args.content);
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
    };
    StdHtmlFormatter.prototype.visitAnnotNode = function (args) {
        var otag = createOpenTag({
            tagName: args.tagName,
            id: args.id,
            className: args.className,
            attrs: args.attrs
        });
        if (args.selfClosing) {
            return otag;
        }
        var ctag = "</" + args.tagName + ">";
        var annotContent = args.name === 'ruby' ? createRubyContent(args.args) : modules_1.Utils.escapeText(args.content);
        return otag + annotContent + ctag;
    };
    StdHtmlFormatter.prototype.visitBlockNode = function (args) {
        var _this = this;
        var otag = createOpenTag({
            tagName: args.tagName,
            id: args.id,
            className: args.className,
            attrs: args.attrs
        });
        var ctag = "</" + args.tagName + ">";
        if (args.content) {
            return addIndent(otag + args.content + ctag, args.indent) + '\n';
        }
        if (!args.children.some(function (child) { return child.isBlockNode(); })) {
            var body_1 = args.children.reduce(function (acm, child) {
                return acm + child.acceptNodeFormatter(_this, args.indent);
            }, '');
            return addIndent(otag + body_1 + ctag, args.indent) + '\n';
        }
        var body = args.children.reduce(function (acm, child) {
            return acm + child.acceptNodeFormatter(_this, args.indent + BLOCK_INDENT_SIZE);
        }, '');
        return addIndent(otag, args.indent) + '\n' + body + addIndent(ctag, args.indent) + '\n';
    };
    return StdHtmlFormatter;
}());
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
var MinifiedHtmlFormatter = /** @class */ (function (_super) {
    __extends(MinifiedHtmlFormatter, _super);
    function MinifiedHtmlFormatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MinifiedHtmlFormatter.prototype.visitBlockNode = function (args) {
        var _this = this;
        var otag = createOpenTag({
            tagName: args.tagName,
            id: args.id,
            className: args.className,
            attrs: args.attrs
        });
        var ctag = "</" + args.tagName + ">";
        var body = args.content ? modules_1.Utils.escapeText(args.content) : args.children.reduce(function (acm, child) {
            return acm += child.acceptNodeFormatter(_this, args.indent);
        }, '');
        return otag + body + ctag;
    };
    return MinifiedHtmlFormatter;
}(StdHtmlFormatter));
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
var PlainTextFormatter = /** @class */ (function (_super) {
    __extends(PlainTextFormatter, _super);
    function PlainTextFormatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlainTextFormatter.prototype.visitBlockNode = function (args) {
        var _this = this;
        var body = args.content ? modules_1.Utils.escapeText(args.content) : args.children.reduce(function (acm, child) {
            return acm += child.acceptNodeFormatter(_this, args.indent);
        }, '');
        return body + '\n';
    };
    return PlainTextFormatter;
}(StdHtmlFormatter));
exports.PlainTextFormatter = PlainTextFormatter;
//# sourceMappingURL=node-formatter.js.map
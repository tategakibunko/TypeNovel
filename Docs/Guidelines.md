# Basic guidelines

Here is recommended guidelines.

## 1. Consider using @speak tag for speech text.

If you want to write speech of some character, we recommend you to use `@speak` tag that is already defined in  `tnconfig.json` by default.

Definitions of `@speak`, `@speak-jp`, `@speak-latin` is following.

```javascript
{
  "markupMap": {
    "@speak": {
      "tagName": "div",
      "className": "speak",
      "attributes":{
	   "data-character": "<arg1>"
      }
    },
    "@speak-latin": {
      "tagName": "div",
      "className": "speak",
      "attributes":{
	   "data-character": "<arg1>"
       "before":"\"",
       "after": "\""
      }
    },
    "@speak-jp": {
      "tagName": "div",
      "className": "speak",
      "attributes":{
	   "data-character": "<arg1>",
       "before":"&#x300c;",
       "after": "&#x300d;"
      }
    }
  }
}
```

Note that if you use `@speak-latin`, `@speak-jp`, you don't have to enclose quotation mark for speech text.

So if you write like this,

```javascript
@speak-latin('Michael Jackson'){
  This is it!
}
```

you'll get following output.

```html
<!-- heading and trailing quotation(") is auto inserted! -->
<div class="speak" data-character="Michael Jackson">
  "This is it!"
</div>
```

In this html, speaker of speech is described in `data-character` in `<speak>` tag.

It's very context aware and meaningful, and NLP friendly.

## 2. Structure story, devide source

In TypeNovel, you can `include` external file by using `$include("filename")`.

We recommend you to devide all text into scene pieces.

```javascript
// good!
@chapter({season:"spring", title:"prologue"}){
  $include("scene1.tn")
  $include("scene2.tn")
}

// meh..
@chapter({season:"summer", title:"awesome summer"}){
  @scene({time:"morning", date:"07/01"}){
    some text...
  }
  @scene({time:"12:00AM", date:"07/01"}){
    some text...
  }
}
```

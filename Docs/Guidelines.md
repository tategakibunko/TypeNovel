# Basic guidelines

Here is recommended guidelines.

## 1. Use @speak tag for speech text.

If you want to write speech of some character, we recommend you to use `@speak` tag that is already defined in  `tnconfig.json` by default.

Definition of `@speak` is following.

```javascript
{
  "markupMap": {
    "@speak": {
      attributes:{
	   "data-person": "<arg1>",
       "before":"\"",
       "after": "\""
      }
    }
  }
}
```

Change `before` and `after` value according to your language. For example, if you're Japanese, use`「`(U+300C) for `before`, and `」`(U+300D) for `after`.

If you wrote speech by `@speak` tag...

```javascipt
@scene({time:"morning"}){
  @speak('John'){
    Hi, $time("good morning!") // "Hi, <time>good morning!</time>"
  }
}
```

Output is following.

```html
<scene data-time="morning">
  <speak data-person="John">
    "Hi, <time>good morning!</time>"
  </speak>
</scene>
```

Speaker of this speech is described in `data-person` in `<speak>` tag.

It's very context aware and meaningful, and NLP friendly.

Note that heading and trailing `"`  are automatically inserted by markupMap of `@spaek`.


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

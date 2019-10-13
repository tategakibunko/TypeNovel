# Cheatsheet

## How do I read a work written in TypeNovel?

Use [TypeNovelReader](https://github.com/tategakibunko/TypeNovelReader).

## Compile options

### --version

Display TypeNovel version.

### --init

Create `tnconfig.json` of default settings, ignored if it already exsits.

### --format

Specify output format. You can use `html`(default) or `text`.

### --output

Define output file. If not defined, stdout is used.

```bash
[foo@localhost] tnc --output foo.html foo.tn
```

### --minify

Output file by minify mode.

In minify mode, all whitespaces are removed in output html except the tag that is defined by `whiteSpace:'pre'` in markupMap of `tnconfig.json`.

### --config

Specify configuration. If it's not specified or found, `tnconfig.json` is used.

If `tnconfig.json` is not found too, default configuration is used.

### --help

Display command line usage.

## Block level markup

Markup of block level is defined by `@<block-name>`.

Regexp of `block-name` is `[a-zA-Z]+[a-zA-Z0-9-_]*`.

```javascript
@scene(){
  @p(){
  }
}
```

## Block level constraints

You can define `constraint` in the argument of block markup like this.

```javascript
// constraint 'season' is defined
@chapter({season:"summer"}){
  @scene({time:"9:00"){
  }
  @scene({time:"10:00"}){
  }
  @p({time:"12:00"}){
  }
  @blockquote(){
  }
}
```

In this example, we define 'season' constraint as 'summer', so we have to `annotatate` this constraint at somewhere in the child text field.

But we don't annotate nothing in this example, compiler will warn error.

### Ignored constraints (since version 0.9.1)

Since version 0.9.1, you can define `ignored constraint` by setting it's value starts with `"?"`.

Ignored constraint is the constraint that is not warned even if it's not annotated in the body text.

It's usefull when you want to defined ambigous constraint value but want to add the ambiguity to it's output html.

See next example.

```javascript
@scene({
  time:"?night" // ignored constraint!
}){
  body text
}
```

In this example, `time` is defined as `ignored constraint`.

In body text, there is no annoration for `time`, but compiler warn nothing because `time` is defined as `ignored constraint`.

And output html is here.

```html
<scene data-time="?">
  body text
</scene>
```

Offcource you can be ambiguous about `time` by defining `@scene` without any constraints too.

But if you want `data-time="?"` in your output html by application issue, and at the same time, don't wont to be warned by compiler by `time` constraint, `ignored constraint` is very usefull.

## Annotation markup

Markup of annotation is written by `$<annot-name>`.

Regexp of `annot-name` is same as `block-name`.

```javascript
@scene({
  season: "winter",
  time: "noon"
}){
  Finally $time("lunch time")! // Finally <time>lunch</time> time!

  $season("Xmas") is comming! // <season>Xmas</season> is comming!
  $season() is cold! // <season>winter</season> is cold!
}
```

## Include external file

```javascript
@book(){
  $include("prologue.tn")
  $include("chapter1.tn")
  $include("chapter2.tn")
  $include("finale.tn")
}
```

## Comment

```javascript
@scene(){
  // this is comment!

  /*
    this is comment too!
  */
}
```

## Escaping

`@`, `$`, `{`, `}` must be escaped in the text.

```javascript
@scene(){
  My email is foo\@gmail.com. // My email is foo@gmail.com
  It costs 100\$! // It consts 100$!
}
```

## Expression

### String, Int, Float

You can define `String`, `Int`, `Float` to block constraints.

Note that if we annotate these constraint without any arguments, it's replaced by constrait value itself.

```javascript
@scene({
  name: "taro",
  age: 10,
  rate: 14.2
}){
  name is $name(). // name is <name>taro</name>.
  age is $age(). // age is <age>10</age>.
  rate is $rate(). // rate is <rate>14.2</rate>.
}
```

### List

```javascript
@scene({
  words: [1, 2, "switch"]
}){
  $words(0), $words(1), $words(2)! // <words>1</words>, <words>2</words>, <words>switch</words>!
}
```

### Object

```javascript
@scene({
  taro:{
    name: '山田太郎',
    age: 10
  }
}) {
  $taro("name") // <taro-name>山田太郎</taro-name>
  $taro("age") // <taro-age>10</taro-age>.
}
```

## Configuration file

### Disable warning

You can set each warning enable/disable by setting `true` or `false` for each item in `tnconfig.json`.

Default setting of warning is here.

```javascript
{
  "warnDuplicateConstraint": true,
  "warnUndefinedConstraint": true,
  "warnUnannotatedConstraint": true
}
```

#### warnDuplicationConstranit

Warns if you define same constraint in multiple nested blocks. Default setting is `true`.

```javascript
@chapter({season:"summer"}){
  @scene({season:"winter"}){ // error! season is already defined in parent block.
  }
}
```

Note that following case is safe because each scene blocks are independent siblings(not nested).

```javascript
@scene({season: "summer"}){ foo }
@scene({season "winter"}){ bar }
```

#### warnUndefinedConstraint

Warns if you write some annotation that is not defined in constraints fields. Default setting is `true`.

```javascript
@scene({season:"summer"}){
  $time("This morning"), I'm very sleepy. // error! 'time' is not defined in constraint fields!
}
```

#### warnUnannotatedConstraint

Warns if you don't write annotation that is defined in constraints fields. Default setting is `true`.

```javascript
@scene({season:"summer"}){
  foo
} // error! constraint 'season' is not annotated in body of @scene block.
```

### Markup map

Markup map enables you to customize actual tagName or attributes in outputted html.

#### Basics

You can define markup map in `tnconfig.json`.

```javascript
{
  "markupMap": {
  "@scene": {
      "tagName": "div",
      "className": "<name>"
     }
  }
}
```

After this configuration, `@scene` will produce `<div class='scene'>` in output html.

If you don't define markup map, `@scene` will produce `<scene>`.

#### Customizable item

You can customize various fields for each markup of TypeNovel.

##### tagName

Defines tagName for html output.

##### className

Defines `class` attribute for html output.

##### id

Defines `id` attribute for html output.

##### validate

If `validate` is set to `false`, errors of constraints and annotations in target markup are ignored.

```javascript
{
  "markupMap": {
    "@noerror":{
      "validate": false
    }
  }
}
```

##### selfClosing (since version 0.9.4)

If `selfClosing` is set to `true`, target markup is not required to close.

For example, `<img>`, `<br>`, `<hr>` are all self-closing tags. You should define them in markupMap if you use them.

```javascript
// [usage] $img("foo.jpg")
"$img":{
  "tagName": "<name>",
  "validate": false,
  "selfClosing": true,
  "attributes":{
    "src": "<arg1>"
  }
}
```

##### whiteSpace

If `whiteSpace` is set to `"pre"`, all newline, whitespace, tab are kept like html `<pre>` tag.

Note that if we compile source with `--release` option, all whitespaces are pruned, but if we set `whiteSpace:"pre"`, content of it's body is all kept as it is.

##### attributes

Defines misc HTML attributes by `<attribute-key>: <attribute-value>` format.

Here is example markup map.

```javascript
{
  "markupMap": {
    "@speak":{
      "tagName": "div",
      "className": "<name>",
      "attributes": {
        "data-character": "<arg1>"
      }
    }
  }
}
```

And here is example TypeNovel using `@speak`.

```javascript
@speak('taro'){
  "Hello, world!"
}
```

Then compilation result is here.

```html
<div class="speak" data-character='taro'>
  "Hello, world!"
</div>
```

##### before, after, content

`before` is text **before** content text.

`after` is text **after** content text.

`content` is treated as **content text itself** of target markup.

Here is example markup map.

```javascript
{
  "markupMap": {
    "@chapter":{
      "tagName": "section",
      "className": "<name>",
      "before": "<h<arg2>><arg1></h<arg2>>"
    }
  }
}
```

And here is example TypeNovel.

```javascript
@chapter("prologue", 3){
  This is prologue text!
}
```

It'll produce result like this.

```html
<section><h3>prologue</h3>This is prologue text!</section>
```

### Placeholder variables

`Placeholder variables` are the values you can use in fields of `markupMap`.

They are temporary placeholder, so it's replaced by associated string in compile time.

#### `<name>`

`<name>` is markup **name** of body tag or annotation tag in TypeNovel.

For example, **name** of `@scene`(body-tag) is **scene** and **name** of `$time`(annot-tag) is **time**.

#### `<arg1>`, `<arg2>`, ...

`<arg1>`, `<arg2>`, ... are argument expressions given to block-tag or annot-tag.

For example, if you write like this,

```javascript
@scene({time:"9:00AM"}, "foo", 123){
}
```

then `<arg1>` is `{time: "9:00AM"}`(object), `<arg2>` is `"foo"`(string), and `<arg3>` is `123`(int).

#### `<uniqueId>`, `<nth>`, `<nthOfType>`, `<index>`, `<indexOfType>`

`<uniqueId>` is unique id of target markup in whole markups.

`<nth>` is nth number of target markup in it's siblings, number starts from **1**.

`<index>` is index number of target markup in it's siblings, number starts from **0**.

`<nthOfTYpe>` is nth number of target markup in it's same markup siblings, number starts from **1**.

`<indexOfTYpe>` is index number of target markup in it's same markup siblings, number starts from **0**.

You can use these placeholder to produce unique `id` to it's html tag.

For example, you can give unique id attribute to all `@scene` markup.

```javascript
{
  "markupMap": {
    "@scene": {
      "id": "scene-<uniqueId>"
    }
  }
}
```

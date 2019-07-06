# TypeNovel terminology

## Example code

Here is example code used to describe this section.

```javascript
@scene({time:"9:00AM"}){
  Wow, $time("early morning")!
  It is $time().
}
```

## block-form format

`@<block-name>`({`<block-constraints>`}, `<arg2>`, `<arg3>`, ...){
  `<block-body>`
}
where `<arg1>` is `{<block-constraints>}`.

## annot-form:

`$<annot-name>`("`<annot-body>`", `<arg2>`, `<arg3>`, ...)
where `<arg1>` = `"<annot-body>"`

## block-form terminology

Here is `block-form` terminology for this example.

- `<block-name>` = `scene`
- `<block-tag-name>` = `div`
- `<block-class-name>` = `scene`
- `<block-constraints>` = `{time:"9:00AM"}`
- `<block-args>` = `[{time:"9:00AM"}]`
- `<block-body>` = `[Wow, $time("early morning")!, It's $time.]`

Generally, `<block-constraints>` is first item of `<block-args>`.

## annot-form terminology

Here is annot-form terminology for this example.

- `<annot-name>` = `time`
- `<annot-tag-name>` = `span`
- `<annot-class-name>` =  `time`
- `<annot-args>` = `["early morning"]`
- `<annot-body>` = `["early morning"]`

Generally, `<annot-body>` is first item of `<annot-args>`.

Note that if you update this `annot-form` like this...

```javascript
$time("early morning", "foo")
```

then `<annot-args>` is `["early morning", "foo"]` and `<arg2>` is `"foo"`.

## special annot-form terminology

In this example, we have two `annot-form`, `$time("early morning")` and `$time()`.

Second one(without `<annot-args>`) is called `annot-symbol`.

It's replaced by constraint value defined in `<block-constraints>`.

In this example, it's `"9:00AM"`.


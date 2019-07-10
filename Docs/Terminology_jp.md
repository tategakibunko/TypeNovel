# TypeNovel 用語集

## 前提

この章を解説するに当たり、以下のサンプルコードを前提とします。

```javascript
@scene({time:"9:00AM"}){
  Wow, $time("early morning")!
  It is $time().
}
```

## ブロックフォーム書式

`@<block-name>`({`<block-constraints>`}, `<arg2>`, `<arg3>`, ...){
  `<block-body>`
}

ここで、`<arg1>` は`{<block-constraints>}`

## 注釈フォームの書式

`$<annot-name>`("`<annot-body>`", `<arg2>`, `<arg3>`, ...)

ここで、 `<arg1>` は `"<annot-body>"`

## ブロックフォームの用語

以下にブロックフォームの書式における用語を、このサンプルに当てはめます。

- `<block-name>` = `scene`
- `<block-tag-name>` = `div`
- `<block-class-name>` = `scene`
- `<block-constraints>` = `{time:"9:00AM"}`
- `<block-args>` = `[{time:"9:00AM"}]`
- `<block-body>` = `[Wow, $time("early morning")!, It's $time.]`

一般には `<block-constraints>` は `<block-args>` の最初の引数となります。

> ただし強制ではありません。

## 注釈フォームの用語

以下に注釈フォームの書式における用語を、このサンプルに当てはめます。

- `<annot-name>` = `time`
- `<annot-tag-name>` = `span`
- `<annot-class-name>` =  `time`
- `<annot-args>` = `["early morning"]`
- `<annot-body>` = `["early morning"]`

一般には`<annot-body>`は `<annot-args>` の最初の引数となります。

ちなみにサンプルの注釈フォームを以下のように変更すると（引数を２つにした）、

```javascript
$time("early morning", "foo")
```

`<annot-args>` は `["early morning", "foo"]` であり、 `<arg2>` は `"foo"` となります。

## 特別な注釈フォームの用語

このサンプルでは、２つの注釈がなされています（`$time("early morning")` と `$time()` です）。

二つ目の`$time()`には`<annot-args>`に該当する引数がありません。

これを注釈シンボル（`annot symbol`）と呼びます。

注釈シンボルは、ブロック制約（`<block-constraints>`）に指定された値に置き換わります。

ですので、このサンプルでは`"9:00AM"`という値になります。


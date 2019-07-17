# ガイドライン

ここでは推奨する使い方について述べます。

## 1. 台詞テキストには@speakタグを使おう

登場人物の台詞を記述するときは、`@speak`系のタグを使うことをお勧めします（初期設定の`tnconfig.json`にすでに登録されています）。

`@speak`タグは次のように定義されています。

```javascript
"@speak": {
  "tagName": "div",
  "className": "speak",
  "attributes":{
    "data-character": "<arg1>"
  }
}
```

台詞を記述するのに`@speak`タグを使うと、話者の情報がHTMLタグの`data-character`属性として記載されます。

文脈による意味情報が詰まっており、とても自然言語処理のしやすいテキストです。

ちなみに人によっては、次のような独自の`@speak`タグを定義したくなるかもしれません。

```javascript
"@speak-latin": {
  "tagName": "div",
  "className": "speak",
  "attributes":{
    "data-character": "<arg1>"
  },
  "before":"\"",
  "after": "\""
},
"@speak-jp": {
  "tagName": "div",
  "className": "speak",
  "attributes":{
    "data-character": "<arg1>"
  },
  "before":"&#x300c;",
  "after": "&#x300d;"
}
```

このように定義した`@speak-latin`や`@speak-jp`を使うと、台詞テキストを引用符で囲う必要がなくなります。

つまり次のように記述すると、

```javascript
@speak-latin('Michael Jackson'){
  This is it!
}
```

次のような出力になります。

```html
<!-- heading and trailing quotation(") is auto inserted! -->
<div class="speak" data-character="Michael Jackson">
  "This is it!"
</div>
```

## 2. 物語を構造化し、分割しよう

TypeNovelでは、外部のファイルを`$include("filename")`という形で取り込むことが出来ます。

テキストをシーンごとに分割することをお勧めします。

```javascript
// 良い例
@chapter({season:"春", title:"プロローグ"}){
  $include("scene1.tn")
  $include("scene2.tn")
}

// 悪い例
@chapter({season:"夏", title:"素晴らしい夏"}){
  @scene({time:"朝", date:"07/01"}){
    some text...
  }
  @scene({time:"正午", date:"07/01"}){
    some text...
  }
}
```

# ガイドライン

ここでは推奨する使い方について述べます。

## 1. 台詞テキストには@speakタグを使おう

登場人物の台詞を記述するときは、`@speak`タグを使うことをお勧めします（初期設定の`tnconfig.json`にすでに登録されています）。

`@speak`タグは次のように定義されています。

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

`before`と`after`の値は、使用する言語に合わせて変更して下さい。

> 例えば日本語であれば`before`は、`「`(U+300C)で、`after`は`」`(U+300D)とすると良いでしょう。

さて、`before`と`after`を日本語用のものに変えた後に、台詞テキストを`@speak`タグで記述すると、

```javascipt
@scene({time:"朝"}){
  @speak('ジョン'){
    やあ, $time("おはよう！") // "やあ, <time>おはよう！</time>"
  }
}
```

出力は次のようになります。

```html
<scene data-time="朝">
  <speak data-person="ジョン">
    「やあ、<time>おはよう！</time>」
  </speak>
</scene>
```

話者（ジョン）の情報が`<speak>`タグに`data-person`として記載されています。

文脈による意味情報が詰まっており、とても自然言語処理のしやすいテキストです。

ちなみに先頭と最後の「かぎ括弧」が`@speak`タグの`markupMap`によって、自動的に追記されていることに注意して下さい。


## 2. 物語を構造化し、分割しよう

TypeNovelでは、外部のファイルを`$include("filename")`という形で取り込むことが出来ます。

全テキストをシーンごとに分割することをお勧めします。

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

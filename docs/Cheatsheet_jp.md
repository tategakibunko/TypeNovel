# チートシート

## TypeNovelで書かれた作品を読む方法は？

[TypeNovelReader](https://github.com/tategakibunko/TypeNovelReader)を使って下さい。

## コンパイル・オプション

### --version

TypeNovelのバージョンを表示します。

### --init

現在の作業ディレクトリに初期設定の`tnconfig.json`を作成します。すでに存在される場合は無視されます。

### --output

出力先ファイルを指定します。このオプションが指定されていないときは、標準出力に出力されます。

```bash
[foo@localhost] tnc --output foo.html foo.tn
```

### --minify

圧縮モードで出力します。

圧縮モードでは、空白文字（半角の空白や改行など）が削除されます。ただし`tnconfig.json`のタグ設定にて`whiteSpace:'pre'`が指定されているタグについては、空白文字が保たれます。

### --config

設定ファイルを指定します。指定されていない場合や、指定されたファイルが存在しない場合は、`tnconfig.json`が使用されます。

もし`tnconfig.json`も存在しない場合は、初期設定が使用されます。

### --help

コマンドラインの使用方法を表示します。

## ブロックレベルのマークアップ

ブロックレベルのマークアップは`@<block-name>`の形式で記述します。

`block-name`の正規表現は`[a-zA-Z]+[a-zA-Z0-9-_]*`です。

```javascript
@scene(){
  @p(){
  }
}
```

## ブロックレベルの制約

ブロックレベルのマークアップには以下のようにして`制約(constraint)`を貸すことが出来ます。

```javascript
@chapter({season:"夏"}){
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

上の例では、`season`という制約を「夏」として定義していますので、子である本文のフィールドのどこかで、この制約を`注釈`しなければなりません。

しかしこの例ではまだ何も注釈していないので、コンパイルするとエラーが警告されます。

### 無視される制約 (バージョン0.9.1以降)

バージョン`0.9.1`より、`"?"`で始まる制約値を設定することで、`無視される制約`を定義することができるようになりました。

無視される制約とは、本文テキストの中で注釈しなくても、コンパイラに警告されないような制約のことです。

これは「曖昧な制約を宣言したいけれども、その曖昧さ**そのもの**を出力HTMLにデータとして載せたい」といった場合に便利です。

次の例を見て下さい。

```javascript
@scene({
  time:"?深夜" // 無視される制約！
}){
  本文テキスト
}
```

この例では、`time`の制約値は無視される制約として定義されています。

そして本文テキストでは`time`に関する注釈がありませんが、コンパイラは警告を発しません。無視される制約として定義されたからです。

そしてコンパイル結果はこうなります。

```html
<scene data-time="?">
  本文テキスト
</scene>
```

もちろん何も制約を宣言しないで`@scene`を定義しても、`time`に関する曖昧さは実現できます。

しかしもし出力されるHTMLに`data-time="?"`という情報が（アプリ側の都合などで）欲しくて、しかも`time`制約については警告されたくない、と言った場合、`無視される制約`は非常に便利です。

## 注釈マークアップ

注釈用のマークアップは`$<annot-name>`の形式で記述します。

`annot-name`の正規表現は`block-name`の場合と同じです。

```javascript
@scene({
  season: "冬",
  time: "お昼"
}){
  ついに$time("ランチタイム")だ！ // ついに<time>ランチタイム</time>だ！

  $season("クリスマス")がやってきた！ // <season>クリスマス</season>がやってきた！
  $season() is cold! // <season>冬</season>は寒い！
}
```

## 外部ファイルの埋め込み

```javascript
@book(){
  $include("prologue.tn")
  $include("chapter1.tn")
  $include("chapter2.tn")
  $include("finale.tn")
}
```

## コメント

```javascript
@scene(){
  // this is comment!

  /*
    this is comment too!
  */
}
```

## エスケープ

本文中では`@`,`$`, `{`, `}` をエスケープしなければなりません。

```javascript
@scene(){
  私のメールアドレスはfoo\@gmail.comです。 // 私のメールアドレスはfoo@gmail.comです。
  100\$もするのか！ // 100$もするのか！
}
```

## 式

### 文字列、整数、浮動小数点数

制約に用いる式として、文字列、整数、浮動小数点数を定義することができます。

ちなみにこれらの制約を引数の文字列無しで注釈すると、代わりに制約に記述した値が用いられることに注意して下さい。

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

### リスト

```javascript
@scene({
  words: [1, 2, "switch"]
}){
  $words(0), $words(1), $words(2)! // <words>1</words>, <words>2</words>, <words>switch</words>!
}
```

### オブジェクト

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

## 設定ファイル

### 警告を無効にする

警告は`tnconfig.json`におけるそれぞれの項目を`true`もしくは`false`にすることで有効にしたり無効にしたりすることができます。初期設定は`true`です。

初期設定における警告の設定は以下のとおりです。

```javascript
{
  "warnDuplicateConstraint": true,
  "warnUndefinedConstraint": true,
  "warnUnannotatedConstraint": true
}
```

#### warnDuplicationConstranit

入れ子になっているブロックの中で、同じ制約を複数回定義した場合に警告を発します。

```javascript
@chapter({season:"summer"}){
  @scene({season:"winter"}){ // エラー！ seasonはすでに親ブロックで定義されています。
  }
}
```


次の場合は警告を発しません。それぞれのブロックが兄弟関係であって、親子関係ではないからです。

```javascript
@scene({season: "summer"}){ foo }
@scene({season "winter"}){ bar }
```

#### warnUndefinedConstraint

ブロックの制約に定義されていない注釈がなされたときに警告を発します。初期設定は`true`です。

```javascript
@scene({season:"summer"}){
  $time("This morning"), I'm very sleepy. // エラー！ 'time'は定義されていない制約です。
}
```

#### warnUnannotatedConstraint

ブロックに定義した制約が注釈されていない場合に警告を発します。初期設定は`true`です。

```javascript
@scene({season:"summer"}){
  foo
} // エラー！ 'season'制約が@sceneのブロックで注釈されていません。
```

### マークアップ・マップ

マークアップ・マップを使うと、出力される実際のHTMLタグを変更することができます。

#### 基本

マークアップマップは`tnconfig.json`にて記述します。

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

この設定をすると、`@scene`は`<div class='scene'>`としてHTMLに出力されるようになります。

何も設定していない場合、`@scene`は`<scene>`というタグとして出力されます。

#### 編集可能な項目

TypeNovelのマークアップはさまざまな項目を編集できます。

##### tagName

HTML出力のタグ名を定義します。

##### className

HTML出力のクラス名を定義します。

##### id

HTML出力のID名を定義します。

##### validate

`validate`項目を`false`と設定すると、そのマークアップ内では制約や注釈に関するエラーが警告されなくなります。

```javascript
{
  "markupMap": {
    "@noerror":{
      "validate": false
    }
  }
}
```

##### selfClosing (バージョン0.9.4以降)

`selfClosing`項目を`true`に設定すると、対象のマークアップは閉じタグが不要になります。

例えば`<img>`, `<br>`, `<hr>`などは全て閉じタグが不要なタグです。これらのタグを使用する場合は、markupMapで閉じタグが不要であることを設定する必要があります。

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

`whiteSpace`項目を`"pre"`と設定すると, HTMLの`<pre>`タグのように全ての改行や空白がそのまま表示されます。

コンパイルオプションとして`--release`を使用すると、通常は全ての改行空白は取り除かれますが、`whiteSpace:'pre'`が設定されている場合は、そのまま残ることに注意して下さい。

##### attributes

その他のHTML属性を`<attribute-key>: <attribute-value>`の書式で定義します。

以下に例を示します。

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

以下に上で定義した`@speak`を使用した例を示します。

```javascript
@speak('taro'){
  "Hello, world!"
}
```

これをコンパイルすると、結果は次のようになります。

```html
<div class="speak" data-character='taro'>
  "Hello, world!"
</div>
```

##### before, after, content

`before`は中身のテキストの**前に**差し込まれるテキストです。

`after` は中身のテキストの**後に**差し込まれるテキストです。

`content`は中身のテキスト**そのもの**として扱われます。

以下に例を示します。

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

こちらがマークアップ例です。

```javascript
@chapter("prologue", 3){
  This is prologue text!
}
```

コンパイルすると次のような出力になります。

```html
<section><h3>prologue</h3>This is prologue text!</section>
```

### プレースホルダー変数

`プレースホルダー変数`は、マークアップ・マップ内で使用できる値です。

一時的な代替用のマークアップなので、コンパイルすると関連した値に置き換えられます。

#### `<name>`

`<name>`は、TypeNovelにおけるボディータグもしくは注釈タグの**name**を指します。

例えば`@scene`(ボディータグ)の**name**は**scene**で、`$time`(注釈タグ)の**name**は**time**です。

#### `<arg1>`, `<arg2>`, ...

`<arg1>`, `<arg2>`は、ブロックタグもしくは注釈タグに与えられた引数のことを指します。

例えば次のように記述したとします。

```javascript
@scene({time:"9:00AM"}, "foo", 123){
}
```

このとき`<arg1>`は`{time: "9:00AM"}`(オブジェクト)で、`<arg2>`は`"foo"`(string),で、`<arg3>`は`123`(int)です。

#### `<uniqueId>`, `<nth>`, `<nthOfType>`, `<index>`, `<indexOfType>`

`<uniqueId>`は全マークアップを横断して他と被らない唯一の数値に置き換わります。

`<nth>`は当該マークアップの兄弟関係における順序番号（**1**から始まる）に置き換わります。

`<index>` は当該マークアップの兄弟関係における順序番号（**0**から始まる）に置き換わります。

`<nthOfTYpe>`は当該マークアップの兄弟関係において、当該マークアップと同じ名前のタグにおける順序番号（**1**から始まる）に置き換わります。

`<indexOfTYpe>`は当該マークアップの兄弟関係において、当該マークアップと同じ名前のタグにおける順序番号（**0**から始まる）に置き換わります。

これらのプレースホルダーは、HTMLタグの中で唯一のIDを与えたい場合に役立ちます。

例えば以下は、`@scene`タグに唯一のIDを与える設定です。

```javascript
{
  "markupMap": {
    "@scene": {
      "id": "scene-<uniqueId>"
    }
  }
}
```

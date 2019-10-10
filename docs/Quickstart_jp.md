# クイックスタート

## 制約付きの文章を書いてみましょう

例として、`@scene`というブロックを**季節が冬である**という制約付きで定義してみましょう。

そしてその制約を`$season("クリスマス")`と描写することで**注釈**してみます。

```javascript
// hello.tn
@scene({
  season:"冬"
}){
  ついに$season("クリスマス")だ！
}
```

次にコンパイルしてみます。

```bash
[foo@localhost]$ tnc hello.tn
```

結果は次のようになります。

```html
<scene data-season="冬">
  ついに<season>クリスマス</season>だ！
</scene>
```

## 出力されるHTMLが気に入らないですか？ では変更しましょう！

出力されるHTMLタグは`tnconfig.json`における`markupMap`という項目で編集できます。

```javascript
{
  "markupMap": {
    "@scene": {
      "id": "scene-<nthOfType>",
      "tagName": "div",
      "className": "<name>"
    },
    "$season": {
      "tagName": "time",
      "className": "<name>"
    }
  }
}
```

> `<name>`や`<nthOfType>`はプレースホルダーと呼ばれる値です。より詳しい情報については[チートシート](https://github.com/tategakibunko/TypeNovel/blob/master/docs/Cheatsheet_jp.md)のプレースホルダーに関する項を参照して下さい。.

再度コンパイルすると、次のような結果になります。

```html
<div id="scene-1" class="scene">
  ついに<time class="season">クリスマス</time>だ！
</div>
```

これで終わりです！

もっと詳しい情報が欲しい場合は、[チートシート](https://github.com/tategakibunko/TypeNovel/blob/master/docs/Cheatsheet_jp.md)を参照して下さい。



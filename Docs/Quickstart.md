# Quickstart

## Write some text with some constraints

For example, we define block as `@scene` with one constraint(season is 'winter').

And constraint of season is filled by annotation markup `$season("Xmas")`.

```javascript
// hello.tn
@scene({
  season:"winter"
}){
  Finally, $season("Xmas") has come!
}
```

Then we can compile this code.

```bash
[foo@localhost]$ tnc hello.tn
```

And result is here.

```html
<scene data-season="winter">
  Finally, <season>Xmas</season> has come!
</scene>
```

## You don't like output html? Let's custumize!

You can define markup map in `tnconfig.json`.

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

> `<name>` and `<nthOfType>` is called `placeholder variable`. For more information, see [cheatsheet](https://github.com/tategakibunko/TypeNovel/blob/master/Docs/Cheatsheet.md) section.

If you re-compile this source, you'll get

```html
<div id="scene-1" class="scene">
  Finally, <time class="season">Xmax</time> has come!
</div>
```

That's it!

Want more information?  See [cheatsheet](https://github.com/tategakibunko/TypeNovel/blob/master/Docs/Cheatsheet.md) section.



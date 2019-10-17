# TypeNovel

A simple markup language to write novel with types.

## Example

This is what it looks like.

```javascript
@scene({
  season:"winter"
}){
  Finally, $season("Xmas") has come!
}
```

Output is here.

```html
<scene data-season="winter">
  Finally, <season>Xmas</season> has come!
</scene>
```

For more information, take a look at [Cheatsheet](https://github.com/tategakibunko/TypeNovel/tree/master/docs/Cheatsheet.md).

## Install

```bash
npm install -g typenovel
```

Tnen `/usr/local/bin/tnc` would be installed.

```bash
[foo@localhost] tnn --version
1.0.4
```

## Use compiler from project

You can compile from source by `Tcn.fromString`.

```typescript
import { Tnc } from 'typenovel';

const result = Tnc.fromString('@scene(){ foo }', {
  format: 'html', // or 'text'
  minify: false
});

console.error(result.errors);
console.log(result.output);
```

Or you can compile from file by `Tcn.fromString`.

```typescript
import { Tnc } from 'typenovel';

const result = Tnc.fromFile('sample.tn', {
  format: 'html',
  minify: false
});

console.error(result.errors);
console.log(result.output);
```

## Reader Application

Reader application is available for TypeNovel(compiler included).

Take a look at [TypeNovelReader](https://github.com/tategakibunko/TypeNovelReader).


## Motivation

### What is the difference between pro novelist and amature novelist?

I'm running a [novel posting platform](https://tb.antiscroll.com) over recent decades, and I always thought about differences between pro and amature.

I think that amature novelist sometimes lack some context description in their story, especially tend to lack the **time** description.

To confirm this feeling, I measured the scores how many times they wrote **time** in their novel, and gave them **quolity scores**.

The formula is simple.

[Total count of time written sentence] * [Entropy of time written sentence] / [Total sentence count]

For example, score of "Mon"('門' in Japanese) written by 'Natsume Soukeki (1867-1916)' is like this.

```bash
histgram: [30, 24, 33, 21, 29, 29, 30, 24, 24, 17]
score: 0.221913(total sentence size = 3879, total time sentences = 261, entropy = 3.298082)
```

In this way, I measured the average scores of many writers in my platform.

Here is scores of **amature** writers.

```
user1: average score:0.055084
user2: average score:0.057143
user3: average score:0.020505
user4: average score:0.071971
user5: average score:0.045247
user6: average score:0.042603
user7: average score:0.086316
user8: average score:0.051926
user9: average score:0.089533
```

And here is scores of **pro** writers.

```
pro1: average score:0.120076, Arthur Conan Doyle
pro2: average score:0.210235, Anton Pavlovich Chekhov
pro3: average score:0.124371, James Augustine Aloysius Joyce
pro4: average score:0.101132, Feodor Dostoyevsky
pro5: average score:0.138546, Nomura Kodou(野村胡堂)
pro6: average score:0.153463, Mori Ougai(森鴎外)
pro7: average score:0.148902, Christian Andersen
pro8: average score:0.110636, Natsume Souseki(夏目漱石)
pro9: average score:0.118976, Nakajima Atsushi(中島敦)
```

Clearly pro scores around `0.1`, but amature scores around `0.05`, difference is not so small.

So I thought "How can we fill the differences between pro and amature?".

In other words, "Can we fill the diffecence using some kind of technology?".

### My answer is "novel with type"

I think we can force all writers to fill enough information in their text, to use **typing**.

But what is the type of novel?

I think it's pair of **constraint** and **annotation**.

This is what it looks like.

```javascript
// block level tag starts with '@'
@scene({
  season: "winter", // constraint 'season'
  time: "7:00AM" // constraint 'time'
}){
  // annotation tag starts with '$'.
  // annotated constraint 'time(7:00AM)' as 'morning'
  I woke up at the $time("morning"). // I woke up at the morning.

  // annotated constraint 'season(winter)' as 'Xmas'
  Finally $season("Xmas")!
}
```

In this example, we have two constraints(`season` as "winter" and `time` as "7:00AM") for this scene block.

So we have to annotate them by writing **annotation** tag.

And we annotated them by `$time("morning")` and `$season("Xmas")`.

Now we annotated all constraints, let's compile this code!

```bash
[foo@localhost]$ tnc sample.tn
```

And you get html output like this.

```html
<scene data-season="winter" data-time="7:00AM">
  I woke up at the <time>morning</time>.
  "Finally <season>Xmas</season>!"
</scene>
```

This output is NLP(Natural Language Processing) or ML(Machine Leraning) friendly, so both platform and writers win!

Writers merit: **quality of novel**

Platform merit: **quality of data**

By the way, if we don't annotated our constraints, what happens?

Offcource, you'll get errors at the compilation time.

```bash
/Users/u1/sample.tn(line:1) 'season' is not annotated in this block!
/Users/u1/sample.tn(line:2) 'time' is not annotated in this block!
```

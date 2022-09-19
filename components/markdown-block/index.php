<title>Markdown block</title>
<meta name="viewport" content="width=device-width">

<!-- ▼ Fichiers cache-busted grâce à PHP -->
<!--<?php versionizeStart(); ?>-->

<script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
<script>window.esmsInitOptions = { polyfillEnable: ['css-modules'] }</script>
<script defer src="../../polyfills/es-module-shims.js"></script>

<script type="importmap">
{
  "imports": {
    "markdown-wasm": "/_common/components/markdown-block/markdown-wasm/markdown.es.js",
    "markdown-block": "/_common/components/markdown-block/markdown-block.js"
  }
}
</script>

<link rel="modulepreload" href="/_common/components/markdown-block/markdown-block.js">
<!-- CSS modules not supported in modulepreload yet 😢 -->

<!--<?php versionizeEnd(__DIR__); ?>-->

<style>
  body {
    margin: 0;
    padding: 10px;
    background-color: #DDD;
    color: #222;
    margin: 20px;

    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color: #222;
      color: #DDD;
    }
  }

  .intro { 
    opacity: .8;
  }

  pre {
    white-space: pre-wrap;
  }

  markdown-block:not([parsed]),
  markdown-block:not(:defined) > * {
    opacity: 0;
  } 
</style>

<script type="module">
  import { MarkdownBlock } from 'markdown-block';
</script>

<body>

<h2 class="intro">This column is Markdown.</h2>
<h2 class="intro">This column is HTML.</h2>

<pre id="inert">
# Inert example

Hello, I am an example.
</pre>

<markdown-block>
# Inert example

Hello, I am an example.
</markdown-block>

<pre id="test" contenteditable="true">
# Editable example

## You can edit this example on the left side, and the block on the right will automatically be updated.

A third of the distance across the Beach, the meadow ends and sand begins. This slopes gradually up for another third of the distance, to the foot of the sand hills, which seem tumbled into their places by some mighty power, sometimes three tiers of them deep, sometimes two, _and sometimes only one._ A third of the distance across the Beach, the meadow ends and sand begins.

The outline of this inner shore is most irregular, curving and bending in and out and back upon itself, making coves and points and creeks and channels, and often pushing out in flats with not water enough on them at low tide to wet your ankles.

## Subtitle

This is another fine paragraph

### Smaller subtitle

This is a paragraph `with` ~style~ *italic* _italic_ **bold** __bold__

![image](https://remiscan.fr/mon-portfolio/images/moi.jpg)

*Hello [link](https://remiscan.fr) lol*

Hello [*link*](https://remiscan.fr) lol "cat"

Hello from *[link](https://remiscan.fr)* to __everyone__ `reading this`

Here's an [**important** anchor link](#example).

line 1
line 2

Code & Poetry
-------------

    You can also indent
    blocks to display
    code or poetry.

    Indented code/poetry blocks
    can be hard-wrapped.

**Or, wrap your code in three backticks:**

```js
function codeBlocks() {
  return "Can be inserted"
}
```


### Block Quotes

> You can insert quotes by
> preceeding each line with `>`.
>
> Blockquotes can also contain line
> breaks.


## Lists

### Unordered lists

- Unordered
- Lists
- Hello

### Ordered lists

1. Ordered
2. Lists
4. Numbers are ignored
1. Ordered

121) Ordered lists can start
122) with any number and
123) use . as well as ) as a separator.

### Task lists

- [ ] Task 1
- [x] Task 2
- [ ] Task 3
- Regular list item

## Tables

| Column 1 | Column 2 | Column 3 | Column 4
|----------|:---------|:--------:|---------:
| default | left | center | right

### Table of image file types

| Header                    | Mime type    | Extensions | Description
|---------------------------|--------------|------------|-------------
| `89 50 4E 47 0D 0A 1A 0A` | image/png    | png        | PNG image
| `47 49 46 38 39 61`       | image/gif    | gif        | GIF image
| `FF D8 FF`                | image/jpeg   | jpg jpeg   | JPEG image
| `4D 4D 00 2B`             | image/tiff   | tif tiff   | TIFF image
| `42 4D`                   | image/bmp    | bmp        | Bitmap image
| `00 00 01 00`             | image/x-icon | ico        | Icon image
</pre>


<markdown-block source="test"></markdown-block>

</body>
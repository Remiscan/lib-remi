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
    "cancelable-async": "/_common/js/cancelable-async.js",
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

Simply write some markdown inside a &lt;markdown-block&gt; tag and it will be automatically converted to HTML.
</pre>

<markdown-block>
# Inert example

Simply write some markdown inside a &lt;markdown-block&gt; tag and it will be automatically converted to HTML.
</markdown-block>

<pre id="test" contenteditable="true">
# Editable example

## You can edit this example on the left side, and the block on the right will automatically be updated.

\&lt;markdown-block\&gt; can also use another element as its source, and automatically convert that source's content to HTML. Try editing this example in the markdown column and see those changes reproduced in the HTML column!

---

# Heading level 1

This is a paragraph.

This is another paragraph,
with a line break.

## Heading level 2

### Heading level 3

#### Heading level 4

##### Heading level 5

###### Heading level 6

Heading level 1
===============

Heading level 2
---------------

- This is an unordered list.
- ~Crossed out text~
- *Italic text*
- **Bold text**
- ***Bold and italic text***
- _Italic text_
- __Bold text__
- ___Bold and italic text***
- [Link](#link)

* Another
* unordered
* list
  * with a
  * sub list
* 👍

+ Another
+ unordered
+ list.

1. This is an ordered list with task lists in it.
  + [x] Pasta
  + [ ] Rice
  + [ ] Bread
2. And :
  * [x] Shirt
  * [ ] Pants

***

This is a paragraph with a `code` element in it.

    This is a code block.
    body {
      color: red;
    }
  
```javascript
const text = 'This is also a code block';
console.log(text);
```

> "This is a quote."
>
>> "This is a nested quote."
>
> Remiscan, 2022

_________________

| Table     | with      | four        | columns
|-----------|-----------|-------------|---------
| One       | Two       | Three       | Four
| Five      | Six       | Seven       | Eight

Here's an image:

![Photo of me](/mon-portfolio/images/moi.jpg)

The end.
</pre>


<markdown-block source="test"></markdown-block>

</body>
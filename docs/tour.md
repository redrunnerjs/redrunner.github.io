## Overview

RedRunner is a JavaScript framework you can use in place of React, Angular, Vue etc to build:

* Reactive web pages
* Mobile apps
* Embedded applications

### Why should I use it?

#### Performance

RedRunner is lightning fast, but real world performance is mostly about avoiding lags in complex views.

That often requires granular control, and RedRunner makes than easier and cleaner than any other framework.

#### Productivity

RedRunner is very mechanical, with no magic, so you'll spend at lot less time being confused about behaviour than other frameworks. 

It also has a built-in help system.

#### Size

Bundle size directly affects page loading times, particularly on low end devices.

RedRunner's basic "Hello World" app bundle is roughly 10% the size of a React or Angular equivalent.

## Installation

RedRunner is not a library you can just load into a page like jQuery. It compiles code using a special Babel plugin, so you need a tool such as [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org/guide/en/) or [parcel](https://parceljs.org/).

If you want to code along (recommended) simply to clone the demo project.

### Clone the demo project

Clone the repo:

```bash
git clone git@github.com:redrunnerjs/demo.git
```

Install packages:

```
npm i
```

Then run the dev server:

```
npm start
```

You can now access the site at [https://localhost:8000](https://localhost:8000) with hot-reload enabled.

### Manual Installation

You need two packages:

```
npm i -D redrunner babel-plugin-redrunner
```

When upgrading, make sure the minor versions match.

#### Babel

Your babel configuration should look like this:

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
      "babel-plugin-redrunner",
      "@babel/plugin-proposal-class-properties"
  ]
}
```

Note that the order of plugins is important.

#### Source Maps

This gets a bit tricky as RedRunner generates code, but you want source maps to point to your original files.

##### WebPack

FIirst set devtools to `eval-cheap-source-map`:

```javascript
{
  devtool: 'eval-cheap-source-map'
  entry: '...',
  devServer: {...},
  output: {...},
  module: {...}
}
```

The remove `@babel/preset-env` from the presets (but add it back for production).

##### Parcel

I couldn't get source maps to work satisfactorily, but haven't tried in a while.

##### Rollup

I haven't tried.

## Click Counter

Below is a simple click counter. You should find something similar in the demo project.

```javascript
import {Component, mount} from 'redrunner'

const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(p, c)">+</button>
    <div>Clicked {..count} times</div>
  </div>
`)

const increment = (props, component) => {
  props.count += 1
  component.update()
}

mount('click-counter-div', ClickCounter, {count: 0})
```

> The `html` right before the string tells editors and highlighters to treat the text as HTML. It has nothing to do with RedRunner.

What happened in the code:

1. We defined a component called `Counter`
2. We defined a callback for our button.
3. We mounted an instance of `Counter` to a div and passed `{count: 0}` as props.

All we need in our HTML file is an element with the expected `id`:

```html
<div id="click-counter-div"></div>
```

Here are equivalents in [React](https://codepen.io/trnkat96/pen/KqPOoX), [Vue](https://paulund.co.uk/vuejs-click-counter) and [Angular](https://codepen.io/NickCelaya/pen/qXjPbB) for comparison.

### Notes

The code looks similar to React: 

1. We define components in ES6 modules (rather than annotating existing HTML like Angular or Vue).
3. We mount components onto elements in the DOM (from which point on they control it's inner DOM).
4. We explicitly tell components when to update (no magic data binding).

Like React you can nest components, and updates cascade down the tree so it all feels reactive even though it's not.

Where it differs is that rather than JSX which generates virtual DOM, our HTML is just a string with **directives** which get converted to optimised instructions during **compilation**. 

### Directives

Directives are special instructions you place in a component's HTML string. They come in two kinds:

#### Inline directives

You place these in within tags or inside attribute values:

```html
<div>Clicked {..count} times</span>
<div class="{..style}"></div>
```

They work as you'd expect.

#### Attribute directives

You write these as HTML attributes:

```html
<button :onClick="increment(p, c)">+</button>
```

These let you do all the clever things like conditional hiding, repeating elements etc... You can also define your own.

### Syntax

RedRunner hardly has any syntax. The dots just save typing:

* `{count}` means variable `count` in global/module scope.
* `{.count}` means `this.count`, where `this` is the component.
* `{..count}` means `this.props.count`.

And `p` and `c` are variables (which refer to the `props` and `component` respectively) which are available to use.

Here's the component re-written to use a global `count` variable instead:

```javascript
import {Component, mount} from 'redrunner'

const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c)">+</button>
    <div>Clicked {count} times</div>
  </div>
`)

let count = 0
const increment = (c) => {count += 1; c.update()}

mount('click-counter-div', ClickCounter)
```

It's all really simple, and there's a built-in cheat sheet in case you forget.

## Cheat sheet

Just add a `?` anywhere inside an html tag:

```html
<button ? :onClick="increment(c)">+</button>
```

And the cheat sheet will appear in the browser, which will show:

* The syntax rules.
* The list variables available to callbacks.
* The list of attribute directives and how to use them.

It even covers custom directives which you defined.

#### Good to know

You can define as many custom directives as you like without affecting bundle size. Directives are parsed and converted during compilation, and only the generated code ends up in the bundle. 

Moving that workload from run time to compile time is one of the reasons RedRunner bundles are so lean and fast.

## Showcase

Here is a small showcase of some basic features, including:

* Single nested components with `<use: >`
* Repeating nested components using `:items`
* Conditionally displaying with `:show`

```javascript
import {Component, mount} from 'redrunner'

class Counter extends Component {
  __html__ = html`
    <div>
      <button :onClick="increment()">+</button>
      <div>Clicked {..count} times</div>
    </div>
  `
  increment() {
    this.props.count += 1; 
    this.update()
  }
}

class CounterColumn extends Component {
  __html__ = html`
    <div style="float: left">
      <div :items="p|Counter"></div>
	  <div :show="total(p) > 10">
        You've reached the limit!
      </div>
      <div>Average: {total(p)| n / p.length}</div>
    </div>
  `
}

const CounterContainer = Component.__ex__(html`
  <div>
	 <use:CounterColumn :props="leftCounters">
	 <use:CounterColumn :props="rightCounters">
	 <button :onClick="addCounters(c)">Add Counters</button>
  </div>
`)

const leftCounters = Array.from([4, 2], x => {count: x})
const rightCounters = Array.from([0, 2, 3], x => {count: x})
const addCounters = c) => {
  leftCounters.push({count: x})
  rightCounters.push({count: x})
  c.update()
}
const total(counters) => counters.reduce((t, p) => p.count + t, 0)
      
mount('click-counter-div', CounterContainer)
```

Note how we can:

* Define components as classes if we prefer.
* Pass arrays, objects or primitives as props.

Of course you can do a lot more, including:

* Inheritance
* Composition using stubs
* Bubbles
* Switch
* Selective updates
* Control DOM reuse for nested components

Before we get into all that juicy stuff, let's take a minute to explore how RedRunner works internally.

## Internals

There are 3 pieces: **wrappers**, **trackers** and **components**.

### Wrappers

Wrapper are simple objects which wrap a DOM element and expose methods to manipulate it:

```javascript
import {Wrapper} from 'redrunner'

const el = document.getElementById('click-counter-div')
const w = new Wrapper(el)
w.text('hello')
w.css('danger')
w.att('color', 'blue')
```

You don't normally create wrappers manually, we're just showing how it works.

### Trackers

A tracker is an object which tracks a value, and has two functions:

* One to read the value.
* One to call if the value has changed.

The following directive:

```html
<span>Clicked {..count} times</span>
```

Would result in a tracker which looks like this:

```javascript
{
  value: 0,
  getNew: (c) => c.props.count,
  callback: (c, n) => c.wrappers[0].text(`Clicked ${n} times`)
}
```

Where `c` is the component, and `n` is the new value. Note this is an approximation, the real code is different.

### Components

When we instantiate a component, it:

1. Creates its initial DOM.
2. Creates a wrapper for each dynamic element.

When you `update` a component, this is roughly what happens:

```javascript
function update() {
  const c = this
  trackers.forEach(tracker => {
    const n = tracker.getNew(c)
    if (n !== tracker.value) {
      tracker.callback(c, n)
      tracker.value = n
    }
  })
  this.nestedComponents.forEach(child => child.update())
}
```

And that, in a nutshell, is how RedRunner updates the DOM.

Everything (text, styles, visibility, repeated elements etc) is handled the same way: by calling a method on a wrapper if a tracked value has changed.

### Advantages

#### Predictability

There is no data binding, observers or other magic reactivity happening.

You can look at your code and confidently tell exactly how and when each element is being updated.

#### Speed

Updates are very fast as:

* It only touches DOM elements that actually need changed.
* It access those elements via pointers, so there is no DOM traversal.
* It only rebuilds content strings if the watched value has changed.

#### Control

The wrapper system lets us safely update some elements in a component without affecting others.

Being able to apply selective updates cleanly lets you crawl out of many performance jams.

## Slots

You can transform a value before it is inserted:

```html
<div>Hello {..name|n.toUpperCase()}</div>
```

This might look similar to **filters** in Vue or Angular, but what is actually happening is quite different.

A directive is made of **slots** separated by the `|` symbol. Inline directives allow either one or two slots:

* Slot 1 returns a value to track.
* Slot 2 returns a value to insert.

The text in each slot is inserted into functions in the generated code during compilation. 

Here are the two functions that would be generated from that last directive:

```javascript
// Function which returns the value to track
function(w, p, c) {
  return p.count;
}

// Function which returns the value to insert
function(w, p, c, n, o) {
  return n.toUpperCase();
}
```

The variables available in slots are simply the function's parameters, which differ according to the situation:


| Var  | Meaning   | Availability         |
| ---- | --------- | -------------------- |
| p    | Props     | All slots            |
| c    | Component | All slots            |
| w    | Wrapper   | All slots            |
| n    | New value | Transform slot only  |
| o    | Old value | Transform slot only  |
| e    | Event     | Event directive only |

You can use these variables however you like so long as it results in valid JavaScript when inserted into the generated function.

All of the following are valid:

```html
<div>{..name|'Hello' + n}</div>
<div>{..name|c.formatName(n)}</div>
<div>{..name|p.firstName}</div>
<div>{p.name|foo(c, p, w)}</div>
<div>{c.props.name|p.bar(o, n)}</div>
<div>{getName(p)|n.toUpperCase()}</div>
```

At this point you could argue that RedRunner is more of a glorified code generator than a truly declarative framework.

That may be so, but it doesn't really matter as:

* You use it exactly as if it were one.
* You reap the same benefits.
* You get much smaller bundles.
* You get far better performance.
* You have a lot more control.

The rest of this section contains notes on slots, but you can [skip ahead](#watch) if you're in a hurry.

#### No eval

There is no nasty `eval` at play here, we just use the text to generate code at compile time.

#### Single slot

If the second slot is missing, RedRunner assumes you just want the new value, so these two are equivalent:

```html
<div>Hello {..name}</div>
<div>Hello {..name|n}</div>
```

#### Always and once

You can tell a slot to always update:

```html
<div>Hello {*|..name}</div>
```

Or to only update once:

```html
<div>Hello {|..name}</div>
```

These are for fine tuning performance, so don't worry about these for now.

#### Dot notation

RedRunner only detects dot notation at the start of a slot. So these two work:

```html
<div>Hello {..name}</div>
<div>Hello {*|..name}</div>
```

But this doesn't:

```html
<div>Hello {*|capitalize(..name)}</div>
```

You would need to do one of the following:

```html
<div>Hello {*|capitalize(p.name)}</div>
<div>Hello {*|capitalize(c.props.name)}</div>
<div>Hello {..name|capitalize(n)}</div>
```

#### It's just a tracker

You don't actually have to use the value from the first slot in the second slot. You could use the first slot solely to decide whether to update the contents:

```javascript
const Paragraph = Component.__ex__(html`
  <div>{p.revision|rebuildParagraph(p.text)}</div>
`)

const paragraph = {
  revision: 12,
  text: "Lorem ipsum dolor sit amet \n consectetur adipiscing elit"
}
const rebuildParagraph = (text) => text.replaceAll('\n', '<br>')
```

This comes in useful later.

#### Beware ES6

The text inside slots gets copied *directly* into the generated ES5 code, and therefore does not undergo transformation from ES6 to ES5.

So you cannot do this:

```html
<div>Hello {..name|n + o ? ` (was ${o})` : ''}</div>
```

Because that is an ES6 string literal which older browsers will not recognise.

Simply move the code out to a function in your module, which will be converted:

```html
<div>Name: {..name|printName(n, o)}</div>
```

On that note, a component's `html` string is processed by babel, which reads code but doesn't interpret it, so this kind of thing won't work:

```javascript
const UserName = Component.__ex__(html`
	<div>${foo()}</div>
`)
const UserName = Component.__ex__("<div>" + foo() + "</div>")
```

We only use template strings to allow it to be multi-line.

## The Walrus

We'll get onto repeat elements and nested components shortly.

The most versatile directive is `:watch` which takes either 2 or 3 slots.

#### Two slot mode

In this mode the first slot returns a value to track, and the second one is function to call if the tracked value has changed:


```html
<div :watch="..count|alert('Count changed!')"></div>
```

Although you can use this to you react to data changes, the more typical use case is modifying the element by passing the wrapper:

```javascript
<div :watch="{..name|updateDiv(w)}"></div>

const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <div :watch="..count|updateLabel(w, n)"></div>
  </div>
`)

const increment = (c, p) => {p.count += 1; c.update()}
const updateLabel = (w, n) => w.text(`Clicked ${n} times`).att('color', n >= 3 ? 'red' : 'black')
```

Note how we can chain calls to wrapper methods.

Here is an alternative way to achieve this:

```javascript
<div :watch="{..name|updateDiv(w)}"></div>

const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <div color="..count|getColor(n)">
      Clicked {..count} times
    </div>
  </div>
`)

const increment = (c, p) => {p.count += 1; c.update()}
const getColor = (w, n) => n >= 3 ? 'red' : 'black'
```

It's up to you which approach you prefer, you can safely combine approaches:

```javascript
<div :watch="{..name|updateDiv(w)}"></div>

const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <div :watch="..count|updateLabel(w, n)">
      Clicked {..count} times
    </div>
  </div>
`)

const increment = (c, p) => {p.count += 1; c.update()}
const updateLabel = (w, n) => w.att('color', n >= 3 ? 'red' : 'black')
```

#### Three slot mode

In this mode the slots mean the following:

1. returns a value to track.
2. returns a value to insert.
3. Name of a wrapper method

For example:


```html
<div :watch="{..name|n.toUpperCase()|text}"></div>
```

Which is the exact same as this:


```html
<div>{..name|n.toUpperCase()}</div>
```

You can leave the second slot empty:

```html
<div :watch="{..name||text}"></div>
```

Which would be the same as this:


```html
<div>{..name}</div>
```

It doesn't make much sense using this to set the text. It is occasionally useful for methods like `html`, `value`, `checked` etc...

The `@` notation lets you call the `att` method, which sets an element's attribute, and requires the name as first parameter:

```html
<div :watch="..height|n + 'px'|@height"></div>
```

So the above calls `wrapper.att('height', '100px')` to result in this:

```html
<div height="100px"></div>
```

Of course you could do it like this too:

```html
<div height="{..height}px"></div>
```









```
<div :items=".props|Child|id"></div>

slots


```





Note how we control the element's color manually, while its text is controlled by the declarative code in the component.

This example may strike you as being odd, given that:

1. You can do that with plain JavaScript or jQuery.
2. The whole point of a declarative framework is to avoid doing that kind of thing.

Let's dig into why this is relevant.

## Declaring war

```
sequence
	point about performance
	point about productivity
	direct DOM
	reactivity
	
```





Declarative programming saves time by hiding implementation details and making your code more readable. We'd rather work with this than the mess of code required to make it work:

```html
<div>Hello {..name}</div>
```

But there

1. Some simple things become more complicated.
2. Performance can be an issue.

A classic example is wanting to update just one column in a table:

```html
<table>
    <tr>
        <td>name</td>
        <td>email</td>
        <td>online</td>  <!--  Just update this -->
    </tr>
    <tr>
        <td>name</td>
        <td>email</td>
        <td>online</td>  <!--  Just update this -->
    </tr>
    <tr>
        <td>name</td>
        <td>email</td>
        <td>online</td>  <!--  Just update this -->
    </tr>
</table>
```

With jQuery that's an easy task. But with a declarative framework you 







You can easily access wrappers to update specific elements independently of one another. 

Let's use the `:el` directive which names the wrapper so we can access it directly:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c)">+</button>
    <div :el="label"></div>
  </div>
`)

let count = 0
const increment = (c) => {
  count += 1;
  c.el.label.text(`Clicked ${count} times`)
}
```

> We don't bother calling `update()` as there are no component-controlled elements values, but you can safely mix both approaches, even with the same elements.

You can use this feature to apply selective updates, which is useful for performance tweaking, but more about that later.



Note 

Here is how we might use the old value:

```javascript
const UserName = Component.__ex__(html`
  <div>Name: {..name|printName(n, o)}</div>
`)

const printName = (n, o) => n + o ? ` (was ${o})` : ''
const user = {name: 'A'}

mount('main', UserName, user)
setTimeout(() => user.name = 'B', 2000)
```

### 
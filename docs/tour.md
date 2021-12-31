## Overview

RedRunner is a JavaScript framework you can use in place of React, Angular, Vue etc to build websites, mobile apps, PWAs etc...

### Why should I use it?

#### Performance

RedRunner compiles your code into tiny bundles which update the DOM a lot more efficiently than popular frameworks like React.

But real world performance is really about fixing slow pages (which affect all frameworks) and that's where RedRunner really shines.

#### Productivity

Reactive frameworks speed up development, but also slow us down with:

* Confusing behaviour.
* Performance issues.

Instead of using a smart runtime engine, RedRunner intelligently generates dumb code, which has two benefits:

1. You can clearly see how, when and why each update happens.
2. You can easily tweak any aspect of that to fix performance issues.



## Installation

RedRunner isn't a library you can just load into a page with a `<script>` tag. It compiles code using a special Babel plugin, so you need a tool such as [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org/guide/en/) or [parcel](https://parceljs.org/).

If you want to code along (recommended) simply clone the demo project:

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

The rest of this section covers installation details, so you can [skip ahead](#first-example) if you like.

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

## First example

Here is a simple click counter similar to the one in the demo project.

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

Here's what the code does:

1. Defined a component called `Counter`
2. Defines a callback for our button.
3. Mounts an instance of `Counter` to a div and passes `{count: 0}` as props.

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

Like React you can nest components, and updates cascade down the tree, so it all feels reactive even though it's not.

But instead of JSX and virtual DOM, the HTML in our component is a plain string with **directives**.

### Directives

Directives are instructions in a component's HTML string which get converted into instructions during **compilation**. 

They come in two kinds:

#### Inline directives

You place these in HTML text:

```html
<div>Clicked {..count} times</span>
<div class="{..style}"></div>
```

And they do exactly what you'd expect.

#### Attribute directives

You write these as tag attributes:

```html
<button :onClick="increment(p, c)">+</button>
```

And they do all the clever things like conditional hiding, repeating elements etc... 

### Syntax

RedRunner hardly has any syntax. The two dots you see here mean that field is on the props:

```html
<div>Clicked {..count} times</span>
```

A single dot means it is on the component:

```html
<div>Clicked {.count} times</span>
```

An no dots means we look in global/module scope.

```html
<div>Clicked {count} times</span>
```

The `p` and `c` you see here are variables which are available to use:

```html
<button :onClick="increment(p, c)">+</button>
```

The refer to the `props` and `component` respectively.

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

It's all really simple, and there's a built-in help system in case you forget.

## Help

Just place a `?` anywhere inside an tag in a component's HTML:

```html
<button ? :onClick="increment(c)">+</button>
```

And the help page will appear in the browser, with:

* The syntax rules.
* The list variables available to callbacks.
* The list of attribute directives and how to use them.

It even covers custom directives which you defined.

#### Good to know

You can define as many custom directives as you like without affecting bundle size. Directives are parsed and converted during compilation, and only the generated code ends up in the bundle. 

Moving that workload from run time to compile time is one of the reasons RedRunner bundles are so lean and fast.

## Basic features

Here is a showcase of basic features, including:

* Single nested components.
* Repeat nested components.
* Conditionally visibility.

```javascript
import {Component, mount} from 'redrunner'

const Counter = Component.__ex__(html`
  <div>
    <button :onClick="increment(p)">+</button>
    <span>Clicked {..count} times</span>
  </div>
`)

const CounterColumn = Component.__ex__(html`
  <div>
    <div :use="Counter" :items="p.slice()"></div>
    <div :show="total(p) > 10">
      You've reached the limit.
    </div>
  </div>
`)

const CounterContainer = Component.__ex__(html`
  <div class="click-counter">
    <button :onClick="addCounters(c, p)">Add Counters</button>
	  <use:CounterColumn :props="..left">
	  <use:CounterColumn :props="..right">
  </div>
`)

const increment = (p) => {p.count += 1; root.update()}
const total = (ctrs) => ctrs.reduce((t, p) => p.count + t, 0)
const addCounters = (c, p) => {
  p.left.push({count: 0})
  p.right.push({count: 0})
  c.update()
}
const root = mount('router', CounterContainer, {
  left: [], right: [],
})
```

Of course you can do a lot more, including:

* Inheritance
* Composition using stubs
* Bubbles
* Switch
* Selective updates
* Control DOM reuse for nested components

But before we go into  

efore we get into all that juicy stuff, let's take a minute to explore how RedRunner works internally.

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

RedRunner has a very special directive affectionately called the walrus, for obvious reasons:

```html
<div :="..count|n<5|visible"></div>
```

> This is legal HTML, as `:` is just the name of the attribute.

The walrus has three slots:

1. Return the value to track.
2. Return the value to use.
3. Wrapper method to pass that value to.

So the example above:

* We track `count` on the props. 
* If that has changed since last update, we passes the new value to a function generated from the middle slot which returns true if it is less than 5.
* We pass that result to the method `visible` on the wrapper, which will show or hide the div accordingly.

#### Why is it special?

The walrus can do almost everything that other directives do, albeit in a more verbose manner. 

The following do exactly the same:

```html
<div :="..count|n<=5|visible"></div>
<div :visible="..count|n<=5"></div>
<div :hide="..count|n>5"></div>
```

The same is true of inline directives. These two do exactly the same, and even compile to identical code: 

```html
<div :="..count|'Clicked ' + n + 'times'|text"></div>
<div>Clicked {..count} times</div>
```

It's not so much that the walrus can do anything, but rather that other directives are just more concise expressions of specific use cases of the walrus.

However, the walrus comes into its own when you omit the third slot.

#### Two slot mode

Without a third slot pointing to a wrapper method, there is nowhere to send the return value of the second slot. So essentially the slots mean:

1. Return the value to track.
2. Code to run if the tracked value has changed.

This lets you do silly things like this:


```html
<div :="..count|console.log('Count is now: ' + n)"></div>
```

But the really useful thing you can do is pass the wrapper to a callback:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <div :="..count|updateLabel(w, n)"></div>
  </div>
`)

const increment = (c, p) => {p.count += 1; c.update()}
const updateLabel = (w, n) => w.text(`Clicked ${n} times`)
```

We are updating the element in a function outside of the component. This may seem like a very odd thing to do, but it comes in handy in some situations.

For example, if we have multiple dynamic properties in an element, the HTML can get pretty messy:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <div 
        style="font-size: {..count}em;"
        color="{..count|getColor(n)}"
        :visible="..count|n <= 5"
      >
      Clicked {..count} times
    </div>
  </div>
`)

const increment = (c, p) => {p.count += 1; c.update()}
const getColor = (n) => n >= 3 ? 'red' : 'black'
```

We can tidy the HTML by moving all that mess to a walrus callback:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <div :="..count|updateLabel(w, n)"></div>
  </div>
`)

const increment = (c, p) => {p.count += 1; c.update()}
const updateLabel = (w, n) => {
  w.text(`Clicked ${n} times`)
   .visible(n <= 5)
   .atts({
      color: n >= 3 ? 'red' : 'black',
      style: `font-size: ${n}em;`
   })
}
```

Note how we can chain wrapper methods calls.

There are other advantages to:

* It is easier to share and reuse functionality
* You can avoid repeating operations

#### Direct DOM manipulation

This may feel very close to direct DOM manipulation, and it is, but:

* It is triggered by a data change.
* It runs in an isolated scope.
* We have clean syntax.

So all the reasons to avoid direct DOM manipulation are mitigated.

Note that you can safely manipulate an element both ways at the same time:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <div :="..count|updateLabel(w, n)">
      Clicked {..count} times
    </div>
  </div>
`)

const increment = (c, p) => {p.count += 1; c.update()}
const updateLabel = (w, n) => w.att('color', n >= 3 ? 'red' : 'black')
```

If you don't like this, you can stick to the declarative approach (which does the exact same thing under the hood).

## Misc

## Nesting

## Repeat items

To repeat items under an element, you must tell it which component to use, and then specify the items:

```html
<div :use="ToDoComponent" :items="todos"></div>
```

Note that RedRunner uses `!==` to check if a tracked value has changed, so if `todos` is the same array instance as it was last `update`, then it won't update the DOM because `todos === todos` even if the array's contents have changed.

This lets you avoid rebuilding DOM when you don't need to, but it can catch you out. The simplest way to ensure it always updates is this:

```html
<div :items="*|todos"></div>
```

Alternatively, just make sure the tracked variable is a different array instance:

```html
<div :items="rebuildTodos()"></div>
<div :items="todos.slice()"></div>
<div :items="todos.map(getId)|todos"></div>
```

## Performance

Here is a page which displays a list of smoothies and their ingredients, which pagination to show just 50 smoothies at a time:

```javascript
const Ingredient = View.__ex__(html`
  <span>{p}</span>
`)

const Smoothie = View.__ex__(html`
  <div>
    <div>{..name}</div>
	<div :items="..ingredients|Ingredient"></div>
  </div>
`)

class SmoothieList = extends View{
  __html__ = html`
    <div>
      <button :onClick=".next()">Next 50</button>
      <div :items=".getSmoothies()|Smoothie"></div>
    </div>
  `
  init() {
    this.page = 1
  }
  getSmoothies() {
    const start = this.page * 50
    const end = start + 50
    return this.props.slice(start, end)
  }
  next() {
    this.page += 1
    this.update()
  }
)

mount('smoothie-list', SmoothieList, [
   {name: 'Bananango', ingredients: ['banana', 'mango']},
   {name: 'Rouge', ingredients: ['blueberry', 'cherry', 'redcurrant']},
   ...
])
```

Let's imagine that:

* `Smoothie` and `Ingredient` have far more complex DOM than depicted.
* There are thousands of smoothies.

When the component first loads, we to create the DOM for the first 50 smoothies plus their ingredients, which is expensive but can't really be avoided.

However, when we jump to the next 50 smoothies, we can reuse the components (including their DOM) and update their content, which is *significantly* faster than creating fresh DOM.

All we need is a pool of reusable child components, and this is exactly what the `:use` directive does.

The pool of child components is attached to that wrapper, and whenever we pass an array to the `items` method it fetches.



#### Sequential cache

The `:items` directive has two slots:

1. Array of items
2. Child component definition

It creates a pool child components and attaches that to the wrapper. Whenever we pass an array of items to the `items` method the wrapper will draw from that pool, creating new instances as necessary.

So in our example the pool of `Smoothie` components will always have exactly 50 components which get reused at every update.

#### Shared cache

But each `Smoothie` component has its own pool of `Ingredient` components, which makes things interesting.

If the row 1 on page 1 has 3 ingredients, but row 1 on page 2 has 6 ingredients, then when we load page 2 the component on row 1 will need to create those missing 3 `Ingredient` components.

So even if the total number of `Ingredient` components is similar across pages, we may end up having to create a load because they are not evenly distributed and each `Smoothie` component has its own pool.

The obvious solution is to create a shared pool. 

```javascript
const Smoothie = View.__ex__(html`
  <div>
    <div>{..name}</div>
	<div :items="..ingredients" :pool="c.parent.ingredientPool"></div>
  </div>
`)

class SmoothieList extends View {
  __html__ = `
    <div :use="Smoothie" :items=".smoothies"></div>
  `
  init() {
    this.smoothies = this.props
    this.ingredientPool = this.pool(Ingredient)
  }
}
```

This way if page 1 has 150 ingredients, but page 2 has 170, we'd only need to create an additional 20.









In some cases you don't want to rebuild the child elements, but do want to update 

```javascript
<div :apply=""></div>

w.apply(items, foo)
w.apply(items, foo)

w.apply(items.map((x,i)=>i), foo)
w.apply(50, foo)
Array(5).fill().map((x,i)=>i)
```









```javascript
//Ideas

const SmoothieList = View.__ex__(html`
  <use:Smoothie :items="p" />
`)

const SmoothieList = View.__ex__(html`
  <div :use="Smoothie" :items="p"></div>
`)

const SmoothieList = View.__ex__(html`
  <div :items="p" :pool="myPool" ></div>
`)

const SmoothieList = View.__ex__(html`
  <use:Smoothie :items="p" :pool="myPool" />
`)
```







One solution is to store `Smoothie` components in a cache, and reuse those every time we update the `SmoothieList` component.

So long as the cache isn't shared with other components, and the child components don't store state, this works fine.

This is exactly what the `:items` directive does: it creates a cache which yields instances of the child component from objects.

The `Smoothie` components do the same with nested `Ingredient` components, but 

#### Keyed cache







 



The `:items` directive creates a hidden cache of child components, which in this case would yield a `Smoothie` component for every smoothie object.

On first pass each one of those needs to be instantiated and the DOM created.

When the `SmoothieList` component is updated, the cache is reset, and when we start requesting `Smoothie` components it reuses existing ones until it runs out, and which point it creates more.

Each `Smoothie` component creates a cache for nested `Ingredient` components.

#### Keyed cache















#### Three slot mode

* Set html
* Set attributes



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

By the way, adding new directives doesn't bloat the bundle. We could add 20 different spellings of `:visible` or `:hidden`.
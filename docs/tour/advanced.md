# Tour

This page introduces RedRunner and acts as a mini-tutorial. For full usage details see the [reference](/reference).

## Overview

#### What is RedRunner?

RedRunner is a front end JavaScript framework (like React, Angular or Vue) which you can use to build reactive web pages, mobile apps, PWAs etc...

#### What makes it special?

##### Tiny bundles

Bundles are often 10% of an equivalent app in React or Angular, which results in *noticeably* faster page loading.

That's because parsing JavaScript takes time, regardless of whether it is cached or minified.

##### Ease of development

RedRunner is actually more of a cookie cutter than a framework.

This keeps things really simple, so you don't waste hours debugging weird behaviour.

##### Real world performance

RedRunner scores very high on the [official js framework benchmark](https://krausest.github.io/js-framework-benchmark/current.html). 

But no matter how fast a framework is, large complex DOM trees will slow things right down.

Fixing that usually involves tweaks such as:

* Partial or targeted updates
* Moving DOM elements (aka reparenting)
* Optimising DOM reuse

Most frameworks make such tweaks really difficult, leaving you to pick between poor performance or messy hacks in your code.

RedRunner make this so clean and easy you can fix slow pages in minutes, not days.

> *If you're confused by any of the above concepts, I highly recommend reading [this post on DOM](https://codeburst.io/taming-huge-collections-of-dom-nodes-bebafdba332).*

## Basics

If you want to code along (which I recommend) just clone the demo project:

```bash
git clone git@github.com:redrunnerjs/demo.git
```

Install dependencies:

```bash
npm i
```

And run the empty project:

```bash
npm run empty
```

Your page should now be at [http://0.0.0.0:3000](http://0.0.0.0:3000) with hot reload enabled.

#### The document

Here's all you need in your **index.html**:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>RedRunner Demo</title>
  </head>
  <body>
    <div id="main"></div>
    <script src="src/main.js"></script>
  </body>
</html>
```

> You can call the div and file whatever you like, it doesn't have to match.

We won't touch the HTML file beyond this, everything is done in ES6 modules.

#### Components

Components control parts of the DOM, and can be nested to form a tree, just like React.

Let's modify **empty/src/main.js** to make a click counter:

```javascript
import {Component, mount} from 'redrunner'

const Counter = Component.__ex__(html`
  <div>
	<button>+</button>
    <span>Clicked 0 times</span>
  </div>
`)

mount('main', Counter)
```

The page should display something like this:

<div>
  <button>+</button>
  <span>Clicked 0 times</span>
</div>
It doesn't work yet.

#### The HTML string

The HTML is just a string, not JSX.

That `html` right before the string  has nothing to do with RedRunner. It just helps editors to treat the string as HTML for syntax highlighting and code completion purposes:

<img src="/static/img/vs-code.png">

You may need a plugin for this to work, such [this one](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) for vs code, which even lets other plugins see that as HTML.

Although it's a template string, you can't `${interpolate}` inside it. Instead you include directives, which come in two types:

* **inline**
* **attribute**

#### Inline directives

These have `{braces}` and inject a value in the DOM. They can be placed inside a node's text:

```html
<span>Clicked {count} times</span>
```

Or attribute text:

```html
<button class="btn-{getStyle()}"></button>
```

They can refer to values or call functions.

Let's add one to our component:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button>+</button>
    <span>Clicked {count} times</span>
  </div>
`)

let count = 1
mount('main', Counter)
```

The page should now display:

<div>
  <button>+</button>
  <span>Clicked 1 times</span>
</div>

#### Updates

Components don't automatically update when data changes.

```javascript
let count = 0
mount('main', Counter)
// This does nothing
count += 1
```

You must explicitly tell them to `update`:

```javascript
let count = 0
const root = mount('main', Counter)
count += 1
root.update()
```

When you call `update` the component:

* Reads the current value of `count` 
* Compares it to the value saved during previous `update` 
* Updates the DOM elements that use it

This keeps things simple, and minimises DOM operations.

#### Attribute directives

These are written as valid HTML attributes:

```html
<div :show="isUserActive()"></div>
```

There are dozens of these, and they do all the clever stuff, like nesting, repeating, visibility, events etc.

But you don't need to remember them. Just place a `?` anywhere inside a tag:

```html
<div ? :show="isUserActive()"></div>
```

And your page will be replaced with the help page which details all the directives, including any custom ones you define.

#### Slots

Some directives accept multiple slots, which we separate with the `|` symbol:

```html
<button :on="click|alert('hello')"></button>
```

Inline directives optionally accept a second slot:

```html
<span>Clicked {count|n*2} times</span>
```

Which modifies the value before it is inserted into the DOM (we'll explain that mysterious `n` later).

#### Compilation

RedRunner uses a babel plugin to strip the directives from the HTML string and convert them into code.

This happens during compilation, meaning:

1. The job of translating high-level declarations into low-level DOM operations is done long before the page is loaded.
2. The code which handles all that isn't included in the bundle.

Bundles far smaller than traditional frameworks.

It also means we can define as many directives or permutations as we like without affecting bundle size.

Directives can also be as slow at parsing their slots they like, because all that matters is the generated code.

#### Events

If a directive starts with `:on` it treats the rest of the name as the event to handle.

So these do exactly the same thing:

```html
<button :on="click|alert('hello')"></button>
<button :onClick="alert('hello')"></button>
```

Let's add a click event to our counter:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment()">+</button>
    <span>Clicked {count} times</span>
  </div>
`)
let count = 0
const root = mount('main', Counter)
const increment = () => {
  count += 1
  root.update()
}
```

> You should now have a functioning click counter!

We could have done this in a normal click event handler, so let's see why this one is different.

#### Ready vars

Slots mostly get copied into generated code during compilation.

So `increment()` lands in a function like so:

```javascript
function btnClick(w, e, p, c) {
  increment()   
}
```

That function's parameters naturally become variables available to our code.

Let's use `c` which refers to the component:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c)">+</button>
    <span>Clicked {count} times</span>
  </div>
`)

let count = 0
mount('main', Counter)
const increment = (c) => {
  count += 1
  c.update()
}
```

> It works the same, but we no longer need to save a reference to the mounted component.

Here's what the other parameters mean:

* `w`  the wrapper (we'll cover this later)
* `e`  the original event.
* `p`  the props.

#### Props

Props are properties we pass to components.

Let's create an object to keep track of the count and pass that to our component instead of a module scoped variable:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span>Clicked {p.count} times</span>
  </div>
`)

const increment = (c, p) => {
  p.count += 1
  c.update()
}
mount('main', Counter, {count: 0})
```

>  It still works the same, but there is no global data.

Note that you can choose what order to use the ready vars in.

#### Nested items

Let's add a component which houses two counters:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span>Clicked {p.count} times</span>
  </div>
`)

const DoubleCounter = Component.__ex__(html`
  <div>
    <use:Counter :props="{count: 0}">
    <use:Counter :props="{count: 0}">
  </div>
`)

const increment = (c, p) => {
  p.count += 1
  c.update()
}
mount('main', DoubleCounter)
```

> Each has its own props, so will update independently.

Not that we changed `{count}` to `{p.count}` in the previous example. That slot ends up in a function with similar parameters to our event:

```javascript
function readValue(w, p, c) {
  return p.count
}
```

> There's no event here, so no `e` parameter.

The return value will be passed to a method on a **wrapper**.

#### Wrappers

Wrapper are objects which wrap a DOM element and expose methods to manipulate it. 

You don't create them yourself, but let's do it here just to see what they look like:

```javascript
import {Wrapper} from 'redrunner'

const el = document.getElementById('main')
const w = new Wrapper(el)
w.text('hello')
w.css('danger')
w.style('font-size', '48px')
w.on('click', () => alert('Yo'))
```

Directives compile to code which involves a wrapper. This directive:

```html
<span>Clicked {p.count} times</span>
```

Will generate code similar to this:

```javascript
w.text('Clicked ' + n + ' times')
```

All DOM updates happen by calling methods on wrappers, whether it's text, styles, visibility or repeat items.

#### Repeat items

Let's implement multiple counters:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(p)">+</button>
    <span>Clicked {p.count} times</span>
  </div>
`)

const MultiCounter = Component.__ex__(html`
  <div :use="Counter" :items="filter(p)"></div>
`)

const filter = (p) => p.filter(i => i.count < 2)
const increment = (p) => {
  p.count += 1
  root.update()
}
const root = mount('main', MultiCounter, [
  {count: 0},
  {count: 0},
  {count: 0},
])
```

> Counters will disappear from view when clicked 3 times.

The `:items` directive calls the `items` method on the wrapper:

```javascript
w.items(n)
```

That rebuilds the nested items with the array of props supplied, using the component class specified in the `:use` directive.

Note that `Array.filter()` constructs a new array, which might make you think it rebuilds everything.

But if you open your browser's inspector you will see that only the `span` affected by the click gets updated:

<img src="/static/img/inspect.png">

We'll look at alternatives approaches later, but for now always pass a new array to `items`.

We've now covered enough basics for you to start using RedRunner like a normal framework.

But RedRunner is no ordinary framework!

## Advanced



The last section covered enough basics to start using RedRunner like a normal framework.

This section digs into how it differs from most frameworks, and what that lets you do.

#### References

Wrappers store a *reference* to their element, so they don't care *where* in the DOM it is.

Let's move our `span` element out of the component:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span id="label">Clicked {p.count} times</span>
  </div>
`)

const increment = (c, p) => {
  p.count += 1
  c.update()
}
mount('main', Counter, {count: 0})

const label = document.getElementById('label')
// This moves the span out of the div
document.body.appendChild(label)
```

> Clicking the button still updates the `span` even though it has moved out of the `div`.

It's unlikely you'd ever do this. The point was to show how it works differently to virtual DOM, which you might be more used to.

There are two advantages to this approach:

1. Accessing elements by reference is a *lot* faster than traversing DOM trees (real or virtual).
2. It allows us to update individual elements in a component without affecting the rest.

That might sound undesirable, even dangerous if you've been conditioned by React.

But it can be done safely, and enables clean yet very effective performance boosts.

#### Direct wrapper access

Let's rebuild our basic click counter:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span :el="label"></span>
  </div>
`)

const increment = (c, p) => {
  p.count += 1
  c.el.label.text(`Clicked ${p.count} times`)
}
mount('main', Counter, {count: 0})
```

The `:el` directive just lets you name a wrapper so you can access it on `component.el` later.

Wrapper methods act instantly, so we don't even need to call `update` here.

Of course this is bad practice as our update is no longer data-driven. It's about time we met the walrus.

#### The walrus

The walrus `:=` accepts two slots:

```html
<span :="watch|apply"></span>
```

Where `watch` is a property or function which returns a value to watch, and `apply` is code to run if the watched value changes, and typically involves using the wrapper.

Let's use it to update our `span` element:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span :="p.count|updateLabel(w, n)"></span>
  </div>
`)

const increment = (c, p) => {
  p.count += 1
  c.update()
}
const updateLabel = (w, n) => {
  w.text(`Clicked ${n} times`)
}
mount('main', Counter, {count: 0})
```

> This works as it did before.

This is not a live watch, it only runs on `update`.

This may feel like direct DOM manipulation which is normally a bad idea, however:

1. It is data driven
2. It happens in a controlled scope
3. It uses nice wrapper syntax

So it is perfectly clean and safe. Besides, this is exactly how components do their own updates.

You can even control one property this way, while letting the component control another:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span :="p.count|setStyle(w, n)">
      Clicked {p.count} times
    </span>
  </div>
`)

const increment = (c, p) => {
  p.count += 1
  c.update()
}
const setStyle = (w, n) => {
  w.style('color', n > 2 ? 'red' : 'black')
}
mount('main', Counter, {count: 0})
```

> The text turns red after 3 clicks.

You might be wondering why you'd want to do that, and the answer is:

* It can make your HTML clearer
* It can help avoid duplication

Here is what it looks like without using the walrus:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span style="color: {getColor(p.count)};">
      Clicked {p.count} times
    </span>
  </div>
`)

const increment = (c, p) => {
  p.count += 1
  c.update()
}
const getColor = (n) => n > 2 ? 'red' : 'black'
mount('main', Counter, {count: 0})
```

> This does the same as last example.

That's fine, but if we multiple attributes in the element it could get messy.

Or you could handle both properties using the walrus:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span :="p.count|updateLabel(w, n)"></span>
  </div>
`)

const increment = (c, p) => {
  p.count += 1
  c.update()
}
const updateLabel = (w, n) => {
  w.text(`Clicked ${n} times`)
   .style('color', n > 2 ? 'red' : 'black')
}
mount('main', Counter, {count: 0})
```

> Also the same, and all of these will generate very similar code in the bundle.

Note that we can chain wrapper calls for convenience:

```javascript
w.text(...).style(...)
```

#### More walrus

The walrus accepts an optional 3rd slot:

```html
<span :="watch|transform|method"></span>
```

In this mode, rather than manipulate the wrapper, the 2nd slot returns a value which gets piped to the method named in the 3rd slot.

Let's try it on our click counter:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span :="p.count|labelText(n)|text"></span>
  </div>
`)
const increment = (c, p) => {
  p.count += 1
  c.update()
}
const labelText = (n) => `Clicked ${n} times`
mount('main', Counter, {count: 0})
```

> This behaves like the original click counter.

We only evaluate the 2nd slot (and pass the return value to the wrapper) if the value returned from the 1st slot has changed.

So if `p.count` hasn't changed, `labelText` doesn't get called, and the `span` doesn't get updated.

#### Walruses in disguise

Most other directives are essentially a walrus with a preset wrapper method:

```html
<button :="p.count|n>5|disabled">+</button>
<button :disabled="p.count|n>5">+</button>
```

> Both end up calling `w.disabled(n>5)` if `p.count` has changed.

The same is true of inline directives, which infer the method from their location.

```html
<span>{p.count|n*2}</span>
<span :="p.count|n*2|text"></span>
```

> These are identical to each other.

As such, you are unlikely to ever need to use it, but it explains how most other directives work.

#### Walrus control

If you don't need to transform the value, you can leave the 2nd slot blank:

```html
<span :="p.count||text"></span>
<span>{p.count}</span>
```

> These are identical to each other.

You can also tell it to always update:

```html
<span :="*|p.count|text"></span>
<span>{*|p.count}</span>
```

> These are identical to each other.

Or never update:

```html
<span :="|p.count|text"></span>
<span>{|p.count}</span>
```

> These are identical to each other.

Whichever form you use, it is processed the same way. So the difference between these two:

```html
<span>{p.count*2}</span>
<span>{p.count|n*2}</span>
```

> These produce the same output, but work differently

Is that in the 1st, the multiplication is always carried out, but in the 2nd only if `p.count` has changed.

The difference is clearer if we write them as walruses:

```html
<span>{p.count*2||text}</span>
<span>{p.count|n*2|text}</span>
```

That make virtually no difference in this case and you're as well going for the  more concise version:

```html
<span>{p.count*2}</span>
```

But for more expensive operations it can be a game changer.

#### Update control

Let's say we display paragraphs from lines. The first pass might look like this:

```javascript
const Paragraph = Component.__ex__(html`
  <p :html="rebuildPar(p.lines)"></p>
`)

const paragraph = {
  lines: [
    "Lorem ipsum dolor sit amet",
    "consectetur adipiscing elit"
  ]
}
const rebuildPar = (lines) => lines.join('<br>')
mount('main', Paragraph, paragraph)
```

Our directive is the equivalent of:

```html
<p :="rebuildPar(p.lines)||html"></p>
```

Where `html` is a method which sets the `innerHTML` of the element.

This implementation calls `rebuildPar` at every `update` which could be expensive, even if it produces the same string and the DOM isn't updated.

But the 2nd slot doesn't *have to* use the value from the 1st slot:

```html
<p :="foo|bar|text"></p>
```

So you could use a counter, timestamp, or revision tracker to determine whether the data has changed:

```javascript
const Paragraph = Component.__ex__(html`
  <p :html="p.changes|rebuildPar(p.lines)"></p>
`)
const paragraph = {
  changes: 12,
  lines: [
    "Lorem ipsum dolor sit amet",
    "consectetur adipiscing elit"
  ]
}
const rebuildPar = (lines) => lines.join('<br>')
mount('main', Paragraph, paragraph)
```

> `rebuildPar` will only be called if `changes` has changed.

A good development philosophy is to prototype quickly (but clearly) and deal with performance issues later. 

Unfortunately that can entail drastic code changes, especially in frontend development.

RedRunner mitigates this by letting you progressively integrate granular control into your code without changing its structure.

#### Partial updates

For this we're going to need a more juicy example, so let's build a global  smoothie empire.

This table displays each smoothie, with its ingredients, and a sales figure that updates every second from an API:

```javascript
const Ingredient = Component.__ex__(html`
  <div>
    <img src="/static/icons/{p}.png">
    <span>{p}</span>
  </div>
`)

const Smoothie = Component.__ex__(html`
  <tr>
    <td>{p.name}</td>
    <td>{fmtSales(p.sales)}</td>
    <td
      :use="Ingredient" 
      :items="p.ingredients.sort()">
    </td>
  </tr>
`)

const SmoothieTable = Component.__ex__(html`
  <table>
    <thead>
      <th>Name</th>
      <th>Sales</th>
      <th>Ingredients</th>
    </thead>
    <tbody
      :use="Smoothie"
      :items="*|p">
    </tbody>
  </table>
`)

const smoothies = [
 {
   id: 123,
   name: 'Bananango',
   sales: 100000,
   ingredients: ['banana', 'mango', 'apple']
  },
  ...
]
const fmtSales = (n) => n.toLocaleString()
const root = mount('main', SmoothieTable, smoothies)
```

The new sales data looks like this:

```json
// key= id, val=sales
salesData = {
  123: 150000,
  456: 300000,
}
```

We use it to update our smoothies, then tell our root component to update like so:

```javascript
for (const [id, sales] of Object.entries(salesData)) {
  const smo = smoothies.find(s => s.id === id)
  if (smo) smo.sales = sales;
}
root.update()
```

But `update` calls `p.ingredients.sort()` for each row, and passes the resulting array to `items` which will map them over the `Ingredient` components, even though they don't change.

That's unnecessary processing, which will slow things down, so let's fix that.

Firstly we use `:el` to name the wrapper for the sales cell:

```javascript
const Smoothie = Component.__ex__(html`
  <tr>
    <td>{p.name}</td>
    <td :el="sales">{fmtSales(p.sales)}</td>
    <td
      :use="Ingredient" 
      :items="p.ingredients.sort()">
    </td>
  </tr>
`)
```

Next we create a function which updates that cell on component from its props:

```javascript
const setSales = (c) =>
  c.el.sales.text(fmtSales(c.props.sales))
```

Next we use `:el` to name the wrapper for `tbody`:

```javascript
const SmoothieTable = Component.__ex__(html`
  <table>
    <thead>
      <th>Name</th>
      <th>Sales</th>
      <th>Ingredients</th>
    </thead>
    <tbody
      :el="rows"
      :use="Smoothie|id"
      :items="*|p">
    </tbody>
  </table>
`)
```

> We also changed the `:use` directive to `"Smoothie|id"` which we'll explain the key in the next section.

And lastly, a function which applies the update across the column:

```javascript
const updateSalesColumn = (salesData) => {
  const indices = Object.keys(salesData)
  root.el.rows.apply(indices, setSales)
}
```

The `apply` method accepts:

* An array of indices (in this case the ids of the smoothies)
* A callback to apply to each child component included in the indices.

We can now call `updateSalesColumn` rather than `root.update` upon receiving sales data, which is a lot faster as:

* It only touches the sales cell.
* It only touches rows that need updated.

You can't do it any faster in vanilla js, and we did it with minimal fuss or changes to structure.

With React you'd need to break it into separate components, sprinkle  `shouldComponentUpdate` everywhere, and it wouldn't come close.

#### Pools

Let's revisit this directive from last example:

```html
<tbody :use="Smoothie|id" :items="*|p"></tbody>
```

This `:use` directive instantiates a pool object with a component class and a key  (in this case `Smoothie` and `id`).

This pool supplies and stores items

For every item in the array passed to  `items` method, it fetches a component from the pool.

 attaches a pool of reusable components to the wrapper.





 as child elements: 

But it also invisibly creates a pool of  `Smoothie` components.



reusable child components:

of `Smoothie` components

When we pass an array of props to `items` it patches the array of nested components, pulling from the pool, creating more as needed. 

So if we paginate our Smoothie table to 50 rows, it would create 50 `Smoothie` components on the first run, and reuse them thereafter.

Pagination will be a lot faster as updating existing DOM is a lot faster than creating new DOM.

The default pool is sequential, the `items` method resets it and starts pulling elements out./

In some cases you might prefer a keyed pool.

The reason for this is that creating new DOM is a lot more expensive than .

#### 

Creating new DOM is expensive, meaning we can really improve speed by reusing discarded trees.

Consider a data table paginated at 50 rows. It is faster to retain and update the rows as the user pages, than to build 50 new rows each time.



Some frameworks try to reuse components or recycle the DOM, some ignore this completely.

In RedRunner uses pools of reusable elements, which are created by 

# ----99999999



https://medium.com/@moshe_31114/building-our-recycle-list-solution-in-react-17a21a9605a0



The `zip` method accepts a callback, and an array of indices. In this case

```javascript
const getIndices = (salesData, items) => {
  const ids = Object.keys(salesData)
  ids.map(id =>
    items.findIndex(item => item.id === id)
  ).filter(x => x >= 0)
}
```









```
const updateSalesColumn = (salesData) => {
  const ids = Object.keys(salesData)
  const indices = getIndices(ids, root.props)
  root.el.body.zip(indices, setSales)
}

const getIndices = (ids, items) => {
  ids.map(id =>
    items.findIndex(item => item.id === id)
  ).filter(x => x >= 0)
}

const smoothies // no change
const fmtSales  // no change
const root      // no change
const salesData = {
  123: 150,
  456: 300,
}
setTimeout(
  () => updateSalesColumn(salesData), 
  2000
)
```

> The table updates the sales figures after 2s.









Change to stock and traders.

If we have a large table of smoothies



# -----------



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







Include bubble

#### DOM reuse

#### Inheritance

#### Stubbs



# SCRAP

Let's make the text turn red after 3 clicks.

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span :el="label">Clicked {p.count} times</span>
  </div>
`)

const increment = (c, p) => {
  p.count += 1
  c.update()
  c.el.label.style('color', 
    p.count > 2 ? 'red' : 'black'
  )
}
mount('main', Counter, {count: 0})
```

> 





Note that we can call the wrapper method after `update` as it doesn't rely on it.





```
update() {
    this.buildProps()
    super.update()
  }
```





#### 

The walrus `:=` is a very special directive because it ties up all the loose ends. 





### Two slot walrus



You rarely use the three slot walrus, because other directives are more concise forms of it.

For example:

```html
<button :="p.count|n>5|disabled">+</button>
```

Can be written like this:

```html
<button :disabled="p.count|n>5">+</button>
```

Or like this:

```html
<button :disabled="p.count>5">+</button>
```

The difference







Which is identical to this:

```html
<span>Clicked {p.count|n} times</span>
```

And all three result in code which looks like this:

```javascript
function readValue(w, p, c) {
  return p.count
}
function useValue(w, p, c, n, o) {
  return 'Clicked ' + n + 'times'
}
```

You rarely use the three slot walrus, because other directives are more concise forms of it.

For example:

```html
<button :="p.count|n>5|disabled">+</button>
```

Can be written like this:

```html
<button :disabled="p.count|n>5">+</button>
```

Or like this:

```html
<button :disabled="p.count>5">+</button>
```

The difference

#### Updates








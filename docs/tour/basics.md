## Basics

If you want to code along (which I recommend) just clone the seed project:

```bash
git clone git@github.com:redrunnerjs/seed.git
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

That repository also contains examples showing you how to use all of RedRunner's features, and has templates to start your own project from.

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

> Choose whatever name you like for the div and module, they don't have to be the same.

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






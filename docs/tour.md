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

## Walk through

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

Here's all the HTML you need to get started:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>RedRunner Demo</title>
  </head>
  <body>
    <div id="main"></div>
    <script src="main.js"></script>
  </body>
</html>
```

You can call the div and file whatever you like, it doesn't have to match.

We won't touch the HTML file beyond this, everything is done in ES6 modules.

#### Components

Components control parts of the DOM, and can be nested to form a tree, just like React.

Modify the code in **src/empty/main.js** of the demo project as follows:

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
It doesn't do anything yet.

#### The HTML string

The HTML string is just a string, not JSX.

That `html` right before the string  has nothing to do with RedRunner. It just helps editors to treat the string as HTML for syntax highlighting and code completion purposes:

<img src="/static/img/vs-code.png">

You may need a plugin for this to work, such [this one](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) for vs code, which even lets other plugins see that as HTML.

The string gets processed by a babel plugin during compilation which looks for **directives** of which there are two types:

* **inline** directives
* **attribute** directives

> Note that babel only sees source code, so this must be a string declaration with no concatenation or interpolation.

#### Inline directives

These have `{braces}` and inject a value in the DOM. They can be placed inside a node's text:

```html
<span>Clicked {count} times</span>
```

Or attribute text:

```html
<button class="btn-{getStyle()}"></button>
```

They can references values or call functions.

Let's make our component display a value:

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

#### Update

Components don't automatically update when data changes.

```javascript
let count = 0
mount('main', Counter)
// This does nothing
count += 1
```

You must explicitly tell it to `update`:

```javascript
let count = 0
const root = mount('main', Counter)
count += 1
root.update()
```

The component simply remembers the value of count and if differs from the last call to `update`, then it updates the DOM.

This keeps things simple, and minimises DOM operations.

#### Attribute directives

These are written as valid HTML attributes:

```html
<div :show="isUserActive()"></div>
```

There are dozens, and they do all the clever stuff, like nesting, repeating, visibility, events etc. But you really only need to remember one:

```html
<div :help></div>
```

This will load the offline help system in your browser, which lists all the directives and how to use them, including any custom ones you define.

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

A babel plugin strips the directives from the HTML string and convert them into code.

This has several advantages over traditional frameworks:

1. The job of translating high-level declarations into low-level DOM operations is done long before the page is loaded.
2. The code which handles all that isn't included in the bundle.

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

You should now have a functioning click counter!

We could have done this in a normal click event handler, so let's see why this one is different.

#### Ready vars

That `increment()` in our directive is just text which gets copied as code into a function during compilation:

```javascript
function btnClick(w, e, p, c) {
  increment(c)   
}
```

That function is called internally, and its parameters naturally become variables available to our code.

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

Things are starting to look cleaner.

The other variables available to event callbacks are:

* `w`  the wrapper (we'll cover this later)
* `e`  the original event.
* `p`  the props.

#### Props

Props are data we pass to components.

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

Now we can have multiple counters with their own data.

Notice how can choose which ready vars to use and in what order.

We also changed `{count}` to `{p.count}` which works because that is also just text which gets copied into a function:

```javascript
function readValue(w, p, c) {
  return p.count
}
```

The component feeds the return value of that function to a wrapper.

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

All DOM updates happen by calling methods on wrappers, and directives mostly generate code which does exactly that.

So a directive like this:

```html
<span>Clicked {p.count} times</span>
```

Gets compiled into something like this:

```javascript
w.text('Clicked ' + n + ' times')
```

Before we explore the fun things you do by accessing wrappers yourself, lets see how repeat items are handled. 

#### Repeat items

Let's create a component which displays a task List:

```javascript
const TaskItem = Component.__ex__(html`
  <li>{p.text}</li>
`)

const TaskList = Component.__ex__(html`
  <div>
    <h4>
      Showing {todo(p).length} of {p.length} items.
    </h4>
    <ul :use="TodoItem" :items="todo(p)"></ul>
  </div>
`)

const todo = (p) => p.filter(i => !i.done)

mount('main', TaskList, [
  {done: true, text: 'Wake up'},
  {done: false, text: 'Learn RedRunner'},
  {done: false, text: 'Profit'},
])
```

This will display 2 of the 3 tasks.

The `:use` directive specifies the component class to use. The `:items` directive supplies the array of props to map to components.

The generated code works by calling the method `items` on the wrapper:

```javascript
w.items(n)
```

Which rebuilds the list of `li` elements.

#### References

A wrapper stores a *reference* to its DOM element, so it doesn't care *where* it is.

Let's mess with our DOM a bit:

```javascript
const TaskList = Component.__ex__(html`
  <div id="div">
    <h4>
      Showing {todo(p).length} of {p.length} items.
    </h4>
    <ul id="ul" :use="TodoItem" :items="todo(p)"></ul>
  </div>
`)

const todo = (p) => p.filter(i => !i.done)
const tasks = [
  {done: true, text: 'Wake up'},
  {done: false, text: 'Learn RedRunner'},
  {done: false, text: 'Profit'},
]
const root = mount('main', TaskList, tasks)
const div = document.getElementById('div')
const ul = document.getElementById('ul')

// This adds a HR after the UL
div.appendChild(document.createElement('hr'))
// This moves the UL outside of the DIV
document.body.appendChild(ul)

tasks.push({done: false, text: 'Wow'})
root.update()
```

> The dynamic elements are still updated even when moved outside of the components div.

Of course you wouldn't do this, we're just showing how different it is to virtual DOM.

This system has several advantages:

* Non-dynamic elements are ignored
* There is no slow DOM traversal
* Reference access is lightening fast
* You can update individual elements without breaking things

That last point enables partial updates, which is just one of the performance tweaks we'll look at in the next section.

But first let's tie up all the loose ends.

#### The walrus

The walrus `:=` is a very special directive because it ties up all the loose ends. 

It has three slots, which you can think of as:

```html
<span :="read|transform|wrapperMethodName"></span>
```

> Fun fact: that is still valid HTML.

When we tell the component to `update` it will:

1. Evaluate the 1st slot to obtain the new value.
2. Compare that to the value saved during previous update.
3. If the value has changed:
   1. Evaluate the 2nd slot.
   2. Call the method named in the 3rd slot on the wrapper for this element, passing the value returned by the 2nd slot.

Let's try it on our click counter:

```javascript
const Counter = Component.__ex__(html`
  <div>
	<button :onClick="increment(c, p)">+</button>
    <span :="p.count|foo(n)|text"></span>
  </div>
`)
const increment = (c, p) => {
  p.count += 1
  c.update()
}
const foo = (n) => `Clicked ${n} times`
mount('main', Counter, {count: 0})
```

This does exactly the same as the previous implementation:

```html
<span>Clicked {p.count} times</span>
```

In fact the generated code is equivalent.

In both cases `foo(n)` only gets called if `p.count` has changed since last update, which saves rebuilding the string if there's no need to.

#### Walruses in disguise

Most directives are essentially a walrus with a preset wrapper method.

Both of these end up calling `w.disabled(n>5)` if `p.count` has changed:

```html
<button :="p.count|n>5|disabled">+</button>
<button :disabled="p.count|n>5">+</button>
```

Inline directives infer the method from their location. So these are equivalent:

```html
<span>{p.count}</span>
<span :="p.count||text"></span>
```

> If you omit the 2nd slot, it uses the value from the 1st slot unmodified.

As are these two:

```html
<span class="{spanStyle()}"></span>
<span :="spanStyle()||@class"></span>
```

> The @ symbol calls the `att` method on the wrapper, passing the next bit as first parameter, so becomes `w.att('class', n)`

You could also just use the `:css` directive:

```html
<span :css="spanStyle()"></span>
```

All of these accept two slots, but the second one is optional, and relates to control.

#### Control

Both of these behave the same:

```html
<button :disabled="p.count|n>5">+</button>
<button :disabled="p.count>5">+</button>
```

But they operate differently internally:

```html
<button :="p.count|n>5|disabled">+</button>
<button :="p.count>5||disabled">+</button>
```

In the first form, `p.count>5` is only evaluated if `p.count` has changed.

That make virtually no difference in this case, but for more expensive operations it can be a game changer.

Let's say we display paragraphs from lines. The first pass might look like this:

```javascript
const Paragraph = Component.__ex__(html`
  <p :html="rebuild(p.lines)"></p>
`)
const paragraph = {
  lines: [
    "Lorem ipsum dolor sit amet",
    "consectetur adipiscing elit"
  ]
}
const rebuild = (lines) => lines.join('<br>')
mount('main', Paragraph, paragraph)
```

This calls `rebuild` at every `update` which could causes a performance issue, even if the DOM isn't updated.

One strategy is to use a counter which you increment whether the lines are changed. You could then use it like this:

```javascript
const Paragraph = Component.__ex__(html`
  <p :html="p.changes|rebuild(p.lines)"></p>
`)
const paragraph = {
  changes: 12,
  lines: [
    "Lorem ipsum dolor sit amet",
    "consectetur adipiscing elit"
  ]
}
const rebuild = (lines) => lines.join('<br>')
mount('main', Paragraph, paragraph)
```

> `rebuild` will only be called if `changes` has changed.

The idea is always to build first, tweak later if necessary. RedRunner makes that as clean and unobtrusive as possible.

You can also do it

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








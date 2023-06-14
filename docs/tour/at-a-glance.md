## At a glance

RedRunner is a front-end framework you can use like [React](https://reactjs.org/), [Angular](https://angular.io/) or [Vue](https://vuejs.org/) etc...

This page explains how it differs from those.

### Engine problems

A framework must convert your instructions into DOM updates, and most do this with an engine that runs once the page is loaded.

There are four issues with this:

##### Bloat

An engine is a large piece of code, and it needs to be loaded and parsed before your page can do anything, which can be several seconds on mobile devices.

##### Confusion

It is very easy to make the engine do the wrong thing, yet very hard to figure out why.

This can easily waste more time than you save.

##### Poor performance

Some views require more tailored updates to perform well, but the engine doesn't allow this.

Trying to find ways round that wastes even more time, often with substandard results.

##### Constraints

You usually can't modify the DOM except via the engine, which makes some things more complicated than they should be.

> E.g. moving a component to a new parent is *finally* possible in React, but requires "portals" (whatever those are).

### Enter RedRunner

RedRunner's simple design avoids these issues, and a lot more.

##### Design in a nutshell

Here is a component which counts how many times you click a button:

```js
import {Component, mount} from 'redrunner'

const increment = (props, comp) => {
  props.count += 1
  comp.update()
}

const Counter = Component(html`
  <div>
    <button :onClick="increment(p, c)">+</button> 
    <span>Clicked {..count} times</span>
  </div>
`)

mount('my-div', Counter, {count: 0})
```

During compilation, a babel plugin transforms that HTML into an object which looks like this:

```js
{
  html: '<div><button>+</button><span></span></div>',
  wrappers: {
    span: this.wrapElementAt([0, 1])
  },
  watch: [
    function() {
      return this.props.count
    }
  ],
  callbacks: [
    function(newVal, oldVal) {
      this.wrappers.span.text(
        'Clicked ' + newVal + ' times'
      )
    }
  ]
}
```

> This is just an illustration, the real code differs for performance reasons.

When the component updates, it will:

1. Read all the watched fields
2. Compare the values to the previous ones
3. Call the corresponding callback if it has changed

The callback then calls a method on a *wrapper*, which is a object used for updating element, and looks like this:

```js
import {wrap} from 'redrunner'

const myDiv = wrap('my-div')

myDiv.text('Hello')
myDiv.style('color', 'red')
myDiv.visible(false)
```

And that's it really. You now understand RedRunner's internals.

### Advantages

There are four major advantages to this design:

##### Predictabilty

All (yes all!) DOM changes:

* Text
* Styles
* Attributes
* Visibility
* Repeat items
* Swaps

happen the same way: by calling methods on wrappers if a watched value differs from its previous value.

And components only do this when you (or the parent component) tell it to update - there is no reactive data binding of any sort.

This simple and consistent system makes everything very predictable, so you can spend less time confused and more time shipping.

##### Efficiency 

The update process is a lot more efficient than virtual DOM for two reasons:

1. Components update elements directly. There is no "walking" over real or virtual DOM.
2. Many operations (such as formatting strings) only happen if the source data has changed.

You can also micro-optimise further if you choose to.

> Replacing all the React in the world with RedRunner could theoretically reduce global warming... &#127758;

##### Power

You can access a component's wrappers to do several interesting things.

Here is a callback which further modifies our element when `props.count` changes:

```js
const Counter = Component.__ex__(html`
  <div>
    <button :onClick="increment(c, p)">+</button>
    <span :="..count|updateSpan(n, w)">
      Clicked {..count} times
	</span>
  </div>
`)

const updateSpan = (n, w) => {
  w.style('color', n > 3 ? 'red' : 'black')
  w.visible(n < 5)
}
```

We could have done this entirely in HTML, or entirely in the callback, and the resulting code would be functionally identical.

The only difference is that our HTML is now less cluttered, and our function is reusable.

> Of course this is direct DOM manipulation, and most places will fire you for suggesting that - but there's nothing cooler than a Rebel.

Here's a component with a named wrapper, and a method which updates only that one.

```js
const UserRow = Component(html`
  <tr>
    <td>{..userName}</td>
    <td :el="status">{..status}</td>
    <!-- loads of cells with expensive render -->
  </tr>
`)

const updateStatus = (c) => 
  c.el.status.text(c.props.status)
```

You can also use this to apply partial updates, which solves most performance issues.



We can now update the status cell of each row without touching the GameStats which requires expensive calculations to determine if anything has changed.



By telling the parent component to call `updateStatus` rather than `update` you avoid the expensive calculations for GameStats.





Here is another way of updating our label:

```js
const Counter = Component.__ex__(html`
  <div :="..count|countChanged(n, c)">
    <button :onClick="increment(c, p)">+</button>
    <span :el="label"></span>
  </div>
`)

const countChanged = (n, c) => {
  c.el.label.text(`Clicked ${n} times`)
}
```

You can technically update any element at any time from anywhere without breaking things.



You can technically update any element at any 

This is still a data-driven change, but shows how we can take full control of the DOM updates. 



You're advised to stick to data-driven changes, but techincally you can update any element from anywhere:

```js
const Banner = Component.__ex__(html`
  <div>
	Hello <span :el="name"></span>!
  </div>
`)

const banner = mount('my-div', Banner)
banner.el.name.text("RedRunner")
```







With a bit of imagination, you can see how this



# Old







> The walrus `:=` directive calls a function when a watched value changes.

When `props.count` changes it will call `updateSpan` as well as the generated callback we saw earlier.

Both callback call methods on the same wrapper, and that's totally fine.

The biggest advantage of this system is that you can

Because the system is so simple, you can safely make your own changes alongside.

You can safely apply manual updates alongside the 

Look at the following example:

conditionally set the color and visibilty of our element. We could do it in the HTML, but it will get pretty cluttered.



We're doing exactly the same as what the compiled code would do, but with less clutter in our HTML.

We could take it a step further and set the text in our callback too:

```js
const updateSpan(n, w) {
  w.text(`Clicked ${n} times`)
  w.css(n > 3 ? 'danger', 'normal')
  w.visible(n < 5)
}
```

This pattern can really help reduce duplication.

Here's a rather different way of updating our element:

```js
const increment = (c, p) => {
  p.count += 1
  c.el.label.text(`Clicked ${p.count} times`)
}

const Counter = Component.__ex__(html`
  <div>
    <button :onClick="increment(c, p)">+</button>
    <span :el="label"></span>
  </div>
`)
```

> The `el` directive names a wrapper so you can access it elsewhere.

Th



is shows how you might go about partially updating components







You can use it to declutter the HTML, or to reduce duplication.

This also enables partial updates, which lets you fix most performance issues in minutes rather than days.

The key point is that you can safely do this alongside a componen't own updates, because they work the exact same way.





##### Usability

The compiler allows us so completely separate 





--------



##### Simple design

Here is a *wrapper* - an object with methods to instantly update a DOM element:

```js
import {wrap} from 'redrunner'

const wrapper = wrap('my-div')
wrapper.text('Hello')
wrapper.css('bold red')
wrapper.visible(false)
```

Here is a *component* - an object which controls its own DOM tree:

```js
import {Component, mount} from 'redrunner'

const Counter = Component(html`
  <div>
    <button :onClick="increment(p, c)">+</button> 
    <span>Clicked {..count} times</span>
  </div>
`)

mount('my-div', Counter, {count: 0})
```

Here is how they interact. A component:

1. Creates wrappers for all its dynamic DOM elements
2. Calls methods on those wrappers when watched data has changed

The entire update logic of our component can be expressed as follows:

```js
if (hasChanged(props.count)) {
  span.text('Clicked ' + props.count + ' times')
}
```

The beauty is that ***all*** DOM updates happen this way, which makes for a predictable and efficient system.



### Advantages



##### Compilation

RedRunner transforms your code during compilation



Svelte is another framework famous for compiling, which achieves smaller bundles than RedRunner.

But the code it generates is a black box, and uses magic databinding, which means that asside from bloat it suffers from all the same problems as frameworks which load an engine.





It uses self-updating components, which can be nested just like React:

 bypasses all these issues by not really having an engine.

All you have are components which control their own DOM, and can be nested, like React.

It only has components which control their DOM using wrappers around dynamic elements.

When data changes, they call methods on the wrappers.





doesn't use a runtime engine. Instead it *compiles* your instructions into code which watch data and updates elements directly.

Doing all this work 

### DOM Engines

Most frameworks use an *engine* to update the DOM, which you might:

* Instruct via HTML annotation (like Angular)
* Feed with virtual DOM (like React)

Either way, the engine handles all DOM operations and hides the details from you. This mostly works well, but also has issues.

##### Debugging

When the engine doesn't do as you ask, it can be very time consuming to figure out why.

##### Constraints

Engines don't share power. The only way of updating framework-controlled DOM it is via the engine.

##### Performance

Some pages are too complex to be updated efficiently by a generic strategy, and those shackles really reduce your options.

##### Bloat

An engine is a large piece of code, and that needs to be included in your bundle.

### RedRunner







### Broken promises

Frameworks were supposed to solve the mess of developing with jQuery. Although they did just that, they also introduced a new mess.



### A way back home

It's scarily easy to hit the point where the framework wasted more time than it saved relative to say, jQuery.



We don't have those issues with jQuery. And many projects would have been far better with that tha

### Risks

There are two main risks with picking a framework.

##### Poor returns

A project can (sometimes quite easily) hit the point where the framework wasted more time than it saved relative to say, jQuery.

It can be hard to notice, let alone accept that you have reached this point.

##### Stuck in a bad place

You may hit a point where performance is not acceptable, and your options are:

* Bypass the framework and do direct DOM.
* Radically change the page design.
* Use a different framework.

### Point zero

The stark reality is that many projects waste more time using frameworks than they save relative to say jQuery.

It is easier to see time saved by clean syntax than time wasted debugging odd behaviour.

But jQuery lacks the two main benefits of a framework:

##### Structure

Frameworks generally provide organisitional units (components, controllers etc...) which control scope and provide a clear structure for your code.

##### Declarative syntax in HTML

Frameworks generally provide a way of defining what the DOM should like using something close to HTML, which really helps us undertsand what is happening.

### Enter RedRunner

RedRunner gives you React style components and declarative HTML:

```js
const Counter = Component(html`
  <div>
    <button :onClick="increment(p, c)">+</button> 
    <span>Clicked {..count} times</span>
  </div>
`)
```

But rather than a DOM *engine*, it *compiles* into code which looks a bit like jQuery:

```js
if (hasChanged(props.count)) {
  span.text('Clicked ' + props.count + ' times')
}
```

This has interesting consequences:

##### Simplicity

Components update the DOM by calling methods on element wrappers when data is found to have changed. 

That's the engine in a nutshell.

##### Efficiency

Wrappers update elements directly, so there is no DOM traversal. 

Operations such as string concatenations only happens if watch data has changed.

##### Control

You can access those wrappers directly, which gives you manual override if you need it.

Use this to fix performance issues in minute, declutter your HTML, and remove duplication.

##### Features

RedRunner *compile*s your code, which lets us do all sorts of clever things, like launching help from your IDE.

```html
<span ? >RedRunner</span>
```

Removing css from your HTML:

```html
<span css.counter.span >RedRunner</span>
```

Letting you define custom directives:

```html
<span :foo="whatever">RedRunner</span>
```

And lots of other things.

##### Size

The task of interpreting HTML is 

And because all this is done during the *compile* step, all the code which deals with parsing annotations doesn't get included in 



we don't need to include a pile of code in the bundle to interpret.





# dd



This conversion happens during compilation, so all you have left at run time is a minimal engine to flush updates down the component tree.

#### Is it like Svelte?

Svelte also compiles declarative syntax into direct DOM instructions, but does so differently.

Firstly Svelte uses its own file format, whereas RedRunner does everything in ES6 modules. I don't want my code split between HTML and ES6 files.

Secondly Svelte uses clever data binding. Angular showed us just how bad an idea it is doing that the DOM.

The biggest difference however is that RedRunner's wrappers are designed to be accessible.

```js
const Counter = Component.__ex__(html`
  <div>
    <button :onClick="increment(c, p)">+</button>
    <span :="..count|updateSpan(n, w)"></span>
  </div>
`

const updateSpan(n, w) {
  w
    .text(`Clicked ${n} times`)
    .css(n > 3 ? 'danger', 'normal')
    .visible(n < 6)
}
```

This is useful for several reasons:

##### Reusable

Setting multiple properties

The particular algoritghm for setting css on a specific element may be something. With other frameworks you'

##### It declutters HTML

JSX bad

```html
<span :="..count|updateSpan(n, w)" css.counter.span ></span>
```

##### Partial updates

It makes it trivial to update parts of a component, such as a single cell in each table row, rather than rendering the whole table.

This kind of trick allows you to fix poorly performing components (which no framework is exempt from - not even Svelte) cleanly, within minutes, rather than days.



<!--



Frameworks are supposed to save time compared to not using one (i.e. jQuery).

But they can easily create so much additional work that projects actualy take *longer*, and all due to problems that don't exist in jQuery!

But returning to jQuery is not an option, as we'd loose the two other big benefits of using a framework:

##### 



### Invisible work

Using a framework *feels* a lot faster than jQuery, but analysis on real projects  often says otherwise.

Our brains treat fixing as "exceptional" compared to building, so we don't factor that fairly in our reckoning.



But updating the DOM is only one 

##### 

, and include all the invisible work like debugging and tweaking, often tells 

 account all the extra invisible work, you often find it's a false economy.



Frameworks let you develop features quicker than jQuery, and keep your code organised, but the additonal (invisible) work can easily cancel out those savings.

Many teams have reluctantly concluded that using frameworks slowed their project down.





Our brains do a bad job of assessing whether a tool is efficient.

We notice the time saved by typing less, but discard the hours spent debugging or performance tweaking.

-->







-----------





 work differently:

* Angular says: annotate the HTML and I'll keep the DOM in sync.
* React says: feed me JSX and I'll make the DOM match.
* Vue looks like Angular but works like React.

They all have the same problems.



Well, those all work by creating an abstraction over the DOM.



In my view those have major problems.

#### Cost of complexity

Magically updating the DOM when your data changes involves some trickery - even more if it works both ways.







-----------





#### Misbehaving magic

Frameworks like Angular and Vue seem to work by pure magic (if you don't understand how it works, it might as well be magic).

Magic is great until it misbehaves and you have to figure out why. It doesn't take much for a framework to nullify the time it saved.

#### Mysterious internals

We typically don't understand *how* those frameworks work - we only know *what* to type.

Unintend behaviour



#### Shackles

Depending on how a framework updates the DOM

Virtual DOM based frameworks like React and Vue



--------



Three reasons:

#### Size

For a simple app RedRunner's minified bundle is around **10%** that of React or Angular.

This means noticeably faster page loads. because the biggest cost of loading is parsing the JavaScript.

#### Simplicity

RedRunner is actually more of a cookie cutter than a framework.

#### Performance

RedRunner scores very high on the [official js framework benchmark](https://krausest.github.io/js-framework-benchmark/current.html). 

But no matter how fast a framework is, large complex DOM trees will slow things right down.

Fixing that usually involves tweaks such as:

* Partial or targeted updates
* Moving DOM elements (aka reparenting)
* Optimising DOM reuse

Most frameworks make such tweaks really difficult, leaving you to pick between poor performance or messy hacks in your code.

RedRunner make this so clean and easy you can fix slow pages in minutes, not days.

> *If you're confused by any of the above concepts, I highly recommend reading [this post on DOM](https://codeburst.io/taming-huge-collections-of-dom-nodes-bebafdba332).*


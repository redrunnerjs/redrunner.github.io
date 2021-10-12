# Tutorial

This is the full tutorial/manual. It assumes some familiarity with JavaScript and frameworks.

## Start

Clone the starter app, install the dependencies and run the dev server:

```
git clone 
npm i
npm run watch
```

Point your browser to http://127.0.0.1:8000/ and you should see a page with "Hello world".

## Components

Open up **src/main.js** which should look like this:

```js
import {Component, mount} from 'redrunner'

const Main = Component.__ex__(html`<div>Hello world</div>`)

mount('main', Main)
```

That `html` before the template string is just for [syntax highlighting and intellisense]() in IDEs, it has nothing to do with RedRunner.

This code does two things:

1. Defines a new type of component `Main` by extending `Component`.
2. Calls `mount()` which will create an instance of `Main` and attach it to the element with id `main`.

Here's what you need to know about components:

* A component builds and controls a set part of the DOM. 

* A component can nest other components, which behave the exact same way as their parent. 
* A component only updates its own DOM, not that of nested components.
* When a component updates, it also tells nested components to update.
* A component is 100% self-contained, there is no external or global mechanism which binds them.

You build your UI solely from components, which will end up nested in a tree structure representing the rough outline of your DOM.

This is exactly how you'd use React, making it easy to port applications over.

## Compiling

RedRunner uses a custom babel plugin to replace the call to `__ex__()` and its arguments with generated code, and it won't work without that (you can't just load RedRunner in a `<script>` tag).

You can always inspect the generated code by running a file through babel directly:

```
babel src/main.js
```

> You must have **babel.config.json** with [babel-plugin-redrunner] for this to work.

#### Bundler

RedRunner only requires a babel plugin, so you can use any bundler ([webpack](https://webpack.js.org/), [rollup](https://rollupjs.org/guide/en/), [parcel](https://parceljs.org/) etc...). We recommend [webpack](https://webpack.js.org/) as it seems to play nicer with map files.

#### Gotchas

The plugin reads arguments to `__ex__()` and transforms them to something else. It's important to remember that Babel only *parses* your code, it does not *interpret* it.

This means the following will not work:

```js
const div = `<div>Hello world</div>`
const Main = Component.__ex__(div) // Fail
```

This fails because the plugin expects string literal with HTML which it will parse without running your code, but it finds a variable instead, which could be defined anywhere and built in any way.

For that same reason, you can't use placeholders or concatenation in this string:

```js
const x = 'world'
const Main = Component.__ex__(`<div>Hello ${x}</div>`)
const Main = Component.__ex__('<div>Hello' + 'world' + '</div>')
```

The only reason we use a template string is because it allows multi-line text.

The above only applies to the HTML string in the call to `Component.__ex__()` all other strings are normal.

## Directives

The HTML string we pass into `__ex__()` is standard compliant HTML. 

RedRunner has no template language (`if`, `else` `for`, `endif`, `endfor` etc...) and doesn't use JSX (see [design](/design) for why we steer clear of those).

The only special thing allowed inside the HTML are *directives*, of which there are two kinds:

##### Inline

These are simple placeholders wrapped in `{curly braces}`. You can place them in text or inside the values of any attribute:

```html
<div class="{myCss}">Hello {name} it is {today}.</div>
```

They simply substitute the content with the value, and the value can be piped to a function to transform it.

##### Attribute

These directives are written as attributes and can do fancier things, such as control a list of nested items:

```html
<div :items="todos|TodoComponent"></div>
```

The  `|` simply separates arguments (also called *slots*) for directives which use more than one. 

Except for a shorthand convention for fields on props (which looks like this `{..name}`) that's us covered all of RedRunner's syntax.

#### Your first directive

Let's change the component to use a directive which looks at a module scoped variable:

```js
const name = 'RedRunner'
const Main = Component.__ex__(html`<div>Hello {name}</div>`)
```

Your page should now display "Hello RedRunner". If it doesn't then check the dev console in the browser as well as the output in the terminal for error messages.

It might not look like it, but `name` is actually JavaScript:

```js
const Main = Component.__ex__(html`<div>Hello {name.toUpperCase()}</div>`)
```

## Transformers

As we just saw, you can use a value and transform it in one stroke. However you might want to separate those two things, either because the transformation is to be reusable, it is expensive, or just for clarity.

In this case we give our directive two slots, which we call the *watch* and the *transformer*:

```html
<div>{watch|transformer}</div>
```

Both slots expect raw JavaScript. The value generated by the watch will be fed to the transformer, and the value which comes out of that will be used to update the DOM. You can think of the `|` symbol as feeding the data from left to right.

The new value of the watch is made available to the transformer as the variable `n`.

Let's try using it:

```js
const Main = Component.__ex__(html`<div>{4|n*2}</div>`)
```

Run that and you will simply see `8`.

A transformer only runs if the watched value has *changed*. And the component only checks that when it is told to *update*.

To demonstrate this, let's call functions from our slots:

* The watch calls a function which randomly generates 1 or 2. 
* The transformer calls a function which multiplies it.

Both log to the console. We'll also add a button which updates the component.

```js
const Main = Component.__ex__(html`
  <div>
    <div>{getRandomNumber()|multiplyBy2(n)}</div>
    <button :onClick="c.update()"/>GO</button>
  </div>
`)
const getRandomNumber = () => {
  const rand = Math.floor(Math.random() * 2) + 1 // Random 1-2
  console.log('Generated: ' + rand)
  return rand
}
const multiplyBy2 = (n) => {
  console.log('Changed!')
  return n * 2
}
```

Open the dev console and observe what happens as you click on the button. 

When you click the button, the component calls `getRandomNumber()`. If the number is not the same as last time, it feeds it to `multiplyBy2`.

## Updates

RedRunner has no magic reactive data binding (see [design](/design) for why we don't do that).

Nothing happens to the DOM until you tell a component to update. 

The component will then run through all the elements with directives, read the new value from the watch slot, compare it to a saved copy of the last value using a simple `!==` check, and if it has changed then it calls a callback passing the new value.

That callback might use the value directly in the DOM, or it might pass it to a transformer first.

If there are any nested components, they get updated too, thus cascading the update down the tree.

It's all very mechanical, but in practice, you typically update the a very highly nested component, so it feels no different to having reactive data binding (except that things are updating when you don't want them to).







the transformer (or applies the value directly).

Therefore you must only watch primitive values. That's not an issue in the directives we've used so far as they are very text oriented.



, or use the `*` notation to always update:

```html
<div>{*|generateNewWordList()}</div>
```

The `*` is redun





So if you "watch" an object or an array, it always 

When we say it "watches" a value, it simply keeps a copy of it, and 

Nothing updates unless you tell it to.



It simply compares the new value to the previous value using



There is no magic reactive data binding in RedRunner, you must explicitly tell a component to update:

```js
const Main = Component.__ex__(html`<div>Hello {name}</div>`)
let name = 'foo'
const root = mount('main', Main)
name = 'bar'
// Nothing happens, util we:
root.update()
```

The unidirectional flow makes everything very clear, predictable and easy to follow. 

This might feel crude next to frameworks which react automatically to data changes. Magic reactive behaviour is very cool, but the reality is that it only saves time in a handful of scenarios, and can very easily end up costing more time by updating when you don't want it to.

RedRunner deliberately avoids all magic for that very reason (see [design](/design) for more on this).

## Arguments



Have a look at the generated code:

```
babel src/main.js
```





 transformer will only be run if the watched value changes, and it receives the 

 which will copied into code inside functions. Those functions receive arguments which you can use. 

The transformer receives an argument `n` (as well as several others) which is the new value of the watch:

If you took a peek at the generated code, you'll have seen something like this:

```js
function a(n, o, w, p, c) {
  w.text(shout(n));
}
```

This is the actual function which gets called if the first argument changes, and explains why `n` was available to the JavaScript expression in the *transformer* argument. As you can see, there is nothing magic about it at all.

The same thing happens to most directive arguments, although they may include different configurations, for example

| Letter | Purpose                      |
| ------ | ---------------------------- |
| n      | New value.                   |
| o      | Old value.                   |
| w      | The wrapper (covered later). |
| e      | The DOM event.               |
| p      | The props (covered later).   |
| c      | The component.               |

You simply use which ones you want, in whatever order makes sense for your callback.

This is extremely convenient for three reasons:

1. Your callbacks don't have to accept arguments they won't use just because the framework sends them out in a set order.
2. You don't have to bind or use intermediate functions to access things you need (like props in a button click handler) so its less mess.
3. You don't have to remember the order of arguments.

This is best illustrated with an example:

```js
const keyUp = (e, w) => {
  e.preventDefault()
  console.log(w.getValue())  // w is a "wrapper" around the input element
}
const btnClick = (p) => {
  console.log(p) // p is the component's props (data passed to it)
}
const Main = Component.__ex__(html`
  <div>
    <button :onClick="btnClick(p)"/>
    <input :onKeyUp="keyUp(w, e)"/>
  </div>
`)
mount('main', Main, {name: 'RedRunner', age: 1})
```

Not all are arguments are available to all callbacks:

* Events like `onClick` have `w, e, p, c` but not `n` or `o`, because there is no value involved.
* Transformers have `n, o, w, p, c` but not `e`, because there is no DOM event involved.

If it makes sense for the callback to have an argument, it will be available.

## Props

So far our directives have only used module scoped variables. 

Let's change it to use props instead, which is just a fancy term for the data passed into a component:

```js
const Main = Component.__ex__(html`<div>Hello {..name}</div>`)
mount('main', Main, {name: 'foo'})
```

#### Lookup notation

Wherever you are required to provide a property in a directive, you may prefix it with:

1. No dots  `{name}` - which means look in module scope.
2. One dot `{.name}` - which means look on the component (think `this.name`)
3. Two dots `{..name}` - which means look on the component's props (think `this.props.name`)

This convention applies to the watch as well as the transformer:

```js
const Main = Component.__ex__(html`<div>Hello {..name|..shout(n)}</div>`)
mount('main', Main, {name: 'foo', shout: n => n.toUpperCase() + '!'})
```

And both the watch and the transformer can be on module scope, on the props, or on the component (or its prototype).

#### Updating props

This works the exact same way as module scope fields:

```js
const Main = Component.__ex__(html`<div>Hello {..name}</div>`)
const props = {name: 'foo'}
const root = mount('main', Main, props)
props.name = 'bar'
// Nothing happens, util we:
root.update()
```

A component keeps a reference to the same props object until you pass it a new object using  `setProps()`:

```js
root.setProps({name: 'bar'})
```

Which is basically the same as this:

```js
root.props = {name: 'bar'}
root.update()
```

Again, there is no magic here. These are normal objects, which also means they are mutable, so be careful.  React's props are *immutable*, which might provide a safety net, but can also be obstructive at times, so we don't do that.

If you really do need immutability, you are free to pick the library of your choice.

## Attribute directives

These are instructions written as normal attributes in the HTML which the babel plugin will interpret. The arguments are placed directly in the attribute value and separated by `|`:

```html
<div :my-directive="arg|arg2"></div>
```

Here is `:show` `:hide` and `:onClick` which all take just one argument, and whose purpose should be evident:

```js
const Main = Component.__ex__(html`
  <div>
    <div>Clicks {..clickCount}</div>
    <div :show="allDone(p)">All done!</div>
    <button :hide="allDone(p)" :onClick="btnClick(c, p)">Click me<button>
  </div>
`)
const btnClick = (c, p) => {
  p.clickCount ++
  c.update()
}
const allDone = (p) => p.clickCount > 2   
mount('main', Main, {clickCount: 0})
```

What a directive does and what arguments it takes is determined by the directive's definition (and yes, you can define your own). 

#### Arguments

Notice how we get to chose the arguments for the click callback, just like we did with inline directives. This is nice as we don't need to bind our `btnClick` function, or make it take argument we're not going to use just to get to the ones we do need.

The  `:show` and `:hide` directives can take a function call, variable, or field, and may use the arguments defined previously, and may use the prefixes:

```html
<div :show="moduleVariable"></div>
<div :show="moduleFunction(c, p)"></div>
<div :show="..fieldOnProps"></div>
<div :show="..functionOnProps()"></div>
```

You can also write raw JavaScript:

```html
<div :show="p.clickCount > 2"></div>
```

In fact, you can also do all of the above inside the watch and converter argument of inline directives too:

```html
<div>{..getFullName()|n.toUpperCase()}</div>
```

This also works for DOM event directives `:onMouseDown`, `:onKeyUp` etc...

```html
<button :onClick="moduleFunction()">Click me<button> 
<button :onClick="..funtionOnProps()">Click me<button>
<button :onClick="p.ClickCount ++">Click me<button> 
```

The same rules apply to *both* arguments of inline directives, and to arguments of attribute directives which use lookup notation.

Not all attribute directive arguments use lookup notation, as some do different things.

How do you know which arguments do what?

## Help

If you forget how to use a directive, or what arguments it takes, simply put a `?` in front of it:

```html
<div ? :items="todos|ToDoItem"></div>
```

This will load an interactive help page in your browser, and works even if you're offline.

(img)

This works for built in directives as well as any custom directives you define (more on that later)

You can also place `?` anywhere that an attribute is allowed to get more general help:

```html
<div ?>{..name}</div>
```

Both options ultimately display the same help page, the first simply jumps to where you need to go.

Remember to remove the `?` when you're done.

## Nested Components

Here is the `:items` directive whose first argument is a lookup (which should be or return an array of objects to be used as props) and whose second argument is a component type:

```js
const ToDoList = Component.__ex__(html`<ul :items="todos|ToDoItem"></ul>`)
const ToDoItem = Component.__ex__(html`<li>{..task}</li>`)
const todos = [
  {task: 'Learn RedRunner'},
  {task: 'Build awesome apps'},
]
mount('main', ToDoList)
```

## 

## Watches

The `:watch` attribute directive is one you probably won't use much, but it is central to understanding RedRunner.

```js
const Main = Component.__ex__(html`
  <div :watch="..name|shout(n)|text"></div>
`)
const shout = (str) => str.toUpperCase() + '!'
mount('main', Main, {name: 'foo'})
```

The effect of this watch is that when a component updates, it will:

1. Read the value from argument **1** (in this case the field `props.name`) 
2. Compare it to a saved copy of what it was before. 

If the value has changed, then it:

1. Reads the value from argument **2** (in this case a function `shout(n)` where `n` will be the new value from the first argument)
2. Sends that value to argument **3** (`text` which we'll look at in a bit)

The first argument is called the *watch*, and the second is the *transformer*. As you may have guessed, this is exactly the same as an inline directive:

```js
const Main = Component.__ex__(html`<div>{..name|shout(n)}</div>`)
```

The third argument is the name of a method on the *wrapper* for that element.

## Wrappers

A wrapper is a simple object which encloses a DOM element and exposes methods for manipulating it. 

Not that you'd ever do this, but let's create a wrapper manually and see what we can do with it:

```js
import {Wrapper} from 'redrunner'
const e = document.getElementById('#main')
const w = new Wrapper(e)
w.text('Hello')
w.visible(false)
w.visible(true)
w.css('alert-danger')
w.att('id': 'new-id')
w.on('click', (w, e) => alert('Hi!'))
```

There is no magic here, they are just wrappers around native DOM elements and their properties and methods:

```js
Wrapper.prototype.text = function(value) {
  this.e.textContent = value
  return this
}
```

You can do wonderful things with wrappers, but we'll look into that more later.

#### How components use wrappers

As soon as a component builds its DOM, it find those elements which had a directive declared on them, and creates wrapper around those elements only.

For example, the following component will create exactly two wrappers:

```js
const Main = Component.__ex__(html`
  <div>
	<h1>Welcome</h1>
    <div>
      <h3>Products</h3>
      <table :items="..products|Product"></table>
    <div>
    <footer>
      Copyright <span>{companyName}</span>.
    </footer>
  </div>
`)
```

The component keeps saves those two wrappers, and will never look at or touch the DOM again, except by calling methods on those wrappers.

If you were to jumble the elements around to different locations, the component wouldn't know or care, and will keep updating the elements which it wrapped, wherever they may now be attached.

## Watches Revisited

Most directives (excluding those which event handlers like `:onClick` and one or two special cases) are just specialised versions of the `:watch` directive.

Here are pairs of div elements which are equivalent to each other:

```html
<div>{..name}</div>
<div :watch="..name||text"></div>

<div class="{..style}"></div>
<div :watch="..style||css"></div>

<div>{..name|formatName(n)}</div>
<div :watch="..name|formatName(n)|text"></div>

<div :show="..isActive"></div>
<div :watch="..isActive||visible"></div>

<div :hide="..isActive"></div>
<div :watch="..isActive|!n|visible"></div>

<!-- requires an extra piece, but same principle  -->
<div :items="todos|ToDoItem"></div>
<div :watch="todos||items"></div>
```

Essentially everything becomes a watch which calls a method on a wrapper if some value has changed.

And here's the crunch:

1. That's how ***all*** DOM updates happen.
2. That's ***all*** that happens to the DOM.

RedRunner has very expressive syntax with lots of sugar, but its run-time operation is very crude, simple and direct.

This has two major advantages.

#### Transparency

You can tell exactly which DOM elements will be updated when, as well as how, mostly just by looking at your code.

In most other frameworks this is not the case. You might know what to do to achieve the desired behaviour, but you don't know *how* it does it internally. At least not in sufficient detail to be able to fix inexplicable behaviour in a minute instead of an hour.

#### Power

RedRunner decouples these three responsibilities:

* Deciding *whether* to update an element.
* Deciding *what* data to update it with.
* Deciding *how* to update it.

These are all accessible, so you can take control of any one of those if you you need it, without impacting the other two aspects. And this level of control can be applied to individual elements.

And because it all works with normal JavaScript functions, but with programmable arguments, you can very easily reuse strategies for any of those aspects across otherwise unrelated components.

That's a already a load of things you in a can't do in most other frameworks. And we haven't even looked at stubs, custom directives, or what you can do with wrappers.

## Wrappers Revisited





## Workers

Here is the `ToDoList` we saw earlier: 

```js
const ToDoList = Component.__ex__(html`<ul :items="todos|ToDoItem"></ul>`)
const ToDoItem = Component.__ex__(html`<li>{..task}</li>`)
const todos = [
  {task: 'Learn RedRunner'},
  {task: 'Build awesome apps'},
]
mount('main', ToDoList)
```

The `:items` directive does two things. 

Firstly it creates an object whose job is to populate the child elements of a DOM node with 



creates a watch which feeds a value to the `items` method of the wrapper, much the same as if we did this:

```html
`<ul :watch="*|todos|items"></ul>`
```

The `items` method of a wrapper accepts an array whose items will be used as props for the nested components. However, this is quite a complex operation which involves a zipping algorithm, and a pool of reusable components. So the `items` method hands that task over to a worker.

The second thing it does is set a `worker` on the wrapper.

That value must be an array  of `ToDoItem` in this case.

 A worker is simply an object which does some work for the wrapper.

Except that this form is missing the argument 



####Bubble

Both these things are unfeasible in a virtual-dom framework.



For example, using a generic sort by key function which

```js
const sort = (items, key, direction) => {...}
const Main = Component.__ex__(html`
  <div :items-w="..items|sort(n, p.sortKey, p.sortDirection)|ToDoItem">
  </div>
`)

mount('main', Main, {
  items: [],
  sortKey: 'dueDate',
  sortDirection: 'DESC'
})
```





swiss

of any one of those aspects with









 most of the time it just works, but you don't actually know how. That only becomes apparent, and a problem, when things don't work well.



 you only know *what* to do. That's fine so long as things as going your way, but 

There will never be a devtools extension for RedRunner because it simply doesn't need one.







 --. If you're unsure, it's pretty easy to intercept and inspect.



can tell exactly how and when the DOM is being updated most just by looking at your own code. 

And simple is good, because you'll spend a lot less time being stuck, and when working with a JavaScript framework, that can 





#### Why so simple?

Simple things are hard to break, and easy to fix.

With most frameworks you don't know how the DOM is being updated. You probably have a vague idea, but you generally get things working by figuring out *what* to do, without necessarily understanding *how* it works. And who can blame you, when *how* is such a complicated process, and one you can't change anyway.



The problem with that is

With RedRunner That's not something you can do in most other frameworks. You typically have a vague idea of what's happening.



, but if it gets really bad, you can llok. Not just have a vague idea

#### 

Whether we're setting text or styles on a `<span>` element, or sorting 1000 rows in a `<table>`, it all works the same way.



This might seem like an implementation detail, but it actually has 

This is very different to a virtual-dom based framework.



several advantages 





 One major advantage (there are several) is that you can tell





 and has several advantages which will become apparent as we go. For now, the obvious advantage is that you can tell 

And that, in a nutshell, is how RedRunner works.





This has has several major advantages for you, the developer. But before we go onto those let's look at how we sort 1000 rows in a `<table>`.



#### swap

#### items

## Simplicity

There are several really nice advantages to this system which will become apparent as we go. But the most important one is simplicity, because this impacts your deadline more than anything else.



Setting a CSS class on a `<span>` element, and sorting 1000 rows in a `<table>` might be very different operations, but to the component they are exactly the same. In both cases it watches a value, and calls a method on a wrapper.



Nothing happens to the DOM outside of the process just described. No querying, no diffing, and no updates, unless you're doing them some other way, like using jQuery.

Of course I

This is very different to virtual dom based frameworks.

This has several advantages.

#### Simplicity



Keeping things simple means fewer surprises.

#### Performance

This process ensure we make the bare minimum changes to the DOM. And there is of course no querying of the DOM either.

It also reduces the amount of calculation involved in determining whether the DOM should be updated. RedRunner will only compare `name` to decide 

```js
const Main = Component.__ex__(html`<div>Hello {name|shout(n)}</div>`)
```







makes it easy to really slash the amount of data checking

 reduces data checking to the bare minimum, which is not  as you might think.



This is





 in its DOM which may need to update in some way (pretty much all directives cause a wrapper to be created). 

It does this right after build its DOM and it doesn't 



There might be a lot of DOM but the component doesn't care

It doesn't touch any of the other elements. , and doesn't care that the div with the items will contain 





















--------



The only difference is that you have to specify an extra argument like `text` which 





What's important to note is that both will result in the *exact* same generated code.

You can leave the second argument blank if you don't need to transform the value:

```js
const Main = Component.__ex__(html`<div :watch="..name||text"></div>`)
```

Which is the same as this:

```js
const Main = Component.__ex__(html`<div>{..name}</div>`)
```

That extra argument `text` is the name of a method on a wrapper around that element. 

Here are some more methods:

```html
<div :watch="..selected|getCss|css"></div>
<div :watch="..selected||visible"></div>
<div :watch="todos||items"></div>
```

This might remind you of jQuery, however these wrappers are solely for updating elements, not querying them and except for `getValue()` they always return themselves, which allows us to chain the calls:

```js
w.text('Hello').visible(true).css('alert-danger')
```

You might see this if you inspect the generated code.

#### How RedRunner uses wrappers

When we instantiate a component, it will:

1. Create its initial DOM.
2. Create a wrapper around each element which has a directive - it saves it for later.

When a component updates, it will:

1. Check all its watch values (from inline directives, `:watch` or any other ) and for those which have changed:
   1. Call a callback (which returns a value (either directly, or by calling a transformer first)
   2. Pass that value to a method on the wrapper (like `text()`)
2. Updates any directly nested components, thereby cascading the update down the tree.

All reactivity in RedRunner happens this way. 



Yes, *all of it*.

#### How you can use wrappers

You can access the wrapper using the `w` argument of a callback:

```js
const SquareIt = Component.__ex__(html`
  <div>
    <input :onKeyUp="textChanged(w, p, c)"/>
    <div :watch="..userInput|displayResult(w, n)"><div>
  </div>
`)
const textChanged = (w, p) => {
  p.userInput = w.getValue()
  c.update()
}
const displayResult = (w, n) => {
  const value = parseInt(n)
  const color = isNaN(value) ? 'red' : 'black'
  const text = isNaN(value) ? 
    'Enter an integer!' :
    `Square of ${value} is ${value * value}`
  w.text(text).style('color', color)
}
mount('main', SquareIt, {userInput: ''})
```

We used the `:watch` directive with 2 arguments instead of 3, meaning the return value from the transformer (`displayResult`) has nowhere to go. That's fine as the whole point is for the transformer to update the wrapper directly.

Of course, this is direct DOM manipulation, and that's very much frowned upon, so let's have a quick look at paradigms before we carry on.

## Coding styles

#### Declarative vs direct

Here is a declarative equivalent of `SquareIt` component:

```js
const SquareIt = Component.__ex__(html`
  <div>
    <input :onKeyUp="textChanged(w, p, c)"/>
    <div :watch="..userInput|isNaN(n) ? 'red' : 'black'|style:color">
	  {..userInput|isNaN(n) ? 'Enter an integer!' : squareMessage(n)}
	<div>
  </div>
`)
const textChanged = (w, p, c) => {
  p.userInput = parseInt(w.getValue())
  c.update()
}
const squareMessage = (n) => `Square of ${value} is ${value * value}`
mount('main', SquareIt, {userInput: ''})
```

We are no longer updating elements directly, and the code is more compact. The downside is that our HTML is messier, and will get messier still if our logic gets more complex.

You can currently enter `4.2` or `4 x 7` and the result will be `16`, so let's add some validation on that string.

As you can imagine, this will get pretty ugly now we've moved our logic into the directive. The s

```js
const SquareIt = Component.__ex__(html`
  <div>
    <input :onKeyUp="textChanged(w, p, c)"/>
    <div :color="..userInput|displayColor(n)">
	  {..userInput|displayText(n)}
	<div>
  </div>
`)
const displayColor = (n) => isNaN(n) ? 'red' : 'black'
const displayText = (n) => {
  // Do your stuff here....
}
```

#### Color



We could use  we decide that's not allowed?



Purists may object to that last example, saying it's too close to direct DOM manipulation, not declarative,  enough, or too verbose.





There are several other ways too. Here is the opposite end of the spectrum:

```js
const SquareIt = Component.__ex__(html`
  <div>
    <input :el="input" :onKeyUp="textChanged(p, c)"/>
    <div :el="display"><div>
  </div>
`)
const textChanged = (c) => {
  const {input, display} = c.el
  const value = parseInt(input.getValue())
  const color = isNaN(value) ? 'red' : 'black'
  const text = isNaN(value) ? 
    'Enter an integer!' :
  	`Square of ${value} is ${value * value}`
  display.text(text).style('color', color)
}
mount('main', SquareIt)
```

The `:el` directive saves the wrapper with the specified name so you can access it from the component. 

That last example is clearly not a very declarative approach, but being able to do this opens up a huge range of possibilities. For example you might have a function in a 

```js
const setTimes = (c, elNames, formatter) => { 
  const date = new Date()
  date.setTime(this.getTime() + (offset*60*60*1000))
  elNames.forEach(e => c.el[e].text(date))
}
```



Pick whichever you're most comfortable with. RedRunner simply provides the tools for all, and 



We advise leaning towards 



## Enlightenment

That last sentence is the key to understanding RedRunner:

> That's *all* that happens. That's how *everything* happens.

Let's look at these more closely.

##### That's *all* that happens

We emphasise this is because many of us are so so used to magic frameworks which take full control of the DOM, that we assume that something similar must be happening, and 



##### That's how *everything* happens.



All reactivity in RedRunner 









For every element which has a directive, 



Components create a wrapper for every element in their HTML which has a directive. A wrapper is a very simple object which wraps a DOM element, and exposes methods for manipulating it.







You can access wrappers via the the `w` argument of a callback:

```js
const Main = Component.__ex__(html`
  <div>
    <button :onClick="btnClick(w)">Click me<button>
  </div>
`)

const btnClick = (w) => {
  w.text('You clicked me')
}
```

This will directly change the button's text to 'You clicked me'. We didn't have to call `update()`.

You can also name wrappers to work with them:

```js
const Main = Component.__ex__(html`
  <div>
    <div :el="display"></div>
    <button :onClick="btnClick(c)">Click me<button>
  </div>
`)

const btnClick = (c) => {
  const displa = c.el.display
  display.text('You clicked the button').css('danger')
}
```

Of course this is direct DOM manipulation, which is highly frowned upon, but it occasionally has its uses.



Note how we wrapper method calls can be chained.



#### 

## Moving Elements

Moving elements to a different location is not something you have to do very often. But when you do, it is an absolute pain if your framework doesn't allow it (react issue).

The reason we're covering it here is to hammer home 



## Lookup notation revisited

We've seen lookup notation used in three places:

* The watch arguments of inline directives
* The transform argument of inline directives
* Some attribute directive arguments

We've also seen how you can specify arguments for callbacks.

These are actually all part of the same rule set, which is as follows.

#### Lookup rules

In any directive argument which uses the lookup format, you may:

* Supply either:
  * A variable or property like `name` or `person.name`
  * A function call like `person.getName()`
  * Raw JavaScript like `(n > 0 ? 'danger' : '')`
* Within those you have access to variable `n, o, w, e, p, c` (subject to availability as defined previously) and can use them as you please: `c.getName(p)`
* For all bar the raw JavaScript, you may use the prefixes `.` or `..` as previously described.

This may sound complex because there's so many permutations, but it's actually very simple. 

Here's several ways of doing the same thing, see if you can follow what is going on in each:

```js
const shout = n => n.toUpperCase()
const shoutName = p => p.name.toUpperCase()
const shoutName2 = c => c.props.name.toUpperCase()
const getName = c => c.props.name

const Main = Component.__ex__(html`
  <div>
    <div>Hello {..name|shout(n)}</div>
    <div>Hello {p.name|shout(n)}</div>
    <div>Hello {..name|(n.toUpperCase())}</div>
    <div>Hello {p.name|(n.toUpperCase())}</div>
    <div>Hello {c.props.name|shout(n)}</div>
    <div>Hello {shoutName(p)}</div>
    <div>Hello {shoutName2(c)}</div>
    <div>Hello {getName(c)|shout(n)}</div>
  </div>
`)
mount('main', Main, {name: 'foo'})
```

As you can see, we sometimes call a function in the watch argument, which is perfectly allowed. 

In fact these rules allow both watch and transformer arguments to be a field or a function:

```js
const Main = Component.__ex__(html`
  <div>
    <div>{foo|bar()}</div>
    <div>{foo()|bar()}</div>
    <div>{foo()|bar}</div>
    <div>{foo|bar}</div>
    <div>{foo|(n.toUpperCase())}</div>
    <div>{(foo > 3)|bar}</div>
  </div>
`)
```

You might be wondering why you'd ever use some of these, and the answer.





You can also leave the first argument blank, which tells the component to populate it only once and not compare it on every update.

```js
const Main = Component.__ex__(html`<div :watch="|..name|text"></div>`)
```

Which is the same as this:

```js
const Main = Component.__ex__(html`<div>{|..name}</div>`)
```

And you can also tell it to always update:

```js
const Main = Component.__ex__(html`<div :watch="*|..name|text"></div>`)
```

Which makes more sense later.

Note how the second argument can be a field rather than a function. In fact both the watch and the converter can be fields, or functions, or raw JavaScript (best placed in brackets):

```js
const getName = (c) => c.props.name
const Main = Component.__ex__(html`<div>{getName(c)|(n.toUpperCase())}</div>`)
```



If there is just one argument, that is what is 





Inline directives work by creating a watcher on the first argument (which, and passing th

is usually a function which transforms the value before it gets used in the DOM.





The rule for inline directives 



Another thing which is perfectly allowed 

```js
const shoutName2 = c => c.props.name.toUpperCase()
const Main = Component.__ex__(html`<div>Hello {c|shoutName2(c)}</div>`)
```





 only seen part of what you can do.





## Inheritance 





#### Class syntax

#### stubs

#### prototype inheritance

Components tend not to have data, but it is common to define functions on the prototype.

```js
const Main = Component.__ex__(html`<div>Hello {..name|.shout(n)}</div>`)
Main.prototype.shout = function(str) {
  str.toUpperCase() + '!'
}
mount('main', Main, {name: 'Foo'})
```

As you can see `Main` is in fact a normal function with a prototype which you can add to like any other. 

There is a neater way to add to a component's prototype:

```js
const methods = {
  shout: (n) => n.toUpperCase() + '!'
}
const Main = Component.__ex__(html`<div>Hello {..name|.shout(n)}</div>`, methods)
```

Note that we *are* allowed to use a variable for this argument, as there is nothing that we need to transform.



## Router

## Modals

## Configuration



RedRunner's built in directives start with `:` but you can create aliases for them, and even define your own. Like inline directives these will stripped from the final HTML.



#### bubble



## 
# Overview

This is probably a good place to start.



```
Purpose: convince reader that RedRunner is asolutely awesome/other frameworks are shit.

Rename this to The tour. The tutorial is more complex and showcases all angles.

Cover size, performance and productivity as concisely as possible at the start, then show the click counter.



```

### What is RedRunner?

RedRunner is a front end framework which you can use in place of React, Angular, Vue etc... Some reasons you might prefer it over those include:

1. Your bundles will be far ***smaller***.
2. DOM updates are a lot ***faster***.
3. It makes you a lot more ***productive***.

Before we take a closer look at RedRunner, let's touch briefly on the above points as the rest will make more sense.

### About size

Keeping your bundle size low is vital to keep page loading time down. This is true even when it is already cached in the browser, because it takes time to read, parse and convert JavaScript into bytecode. 

(Show graph with bundle sizes and time to load on various devices)

This means you can do pretty cool things, such as building a [PWA which is not a SPA]().

### About performance

Each framework performs differently across various tasks:

(show table)





The aim is not to make fast pages even faster, but to avoid slow pages becoming unacceptably slow. That usually happens when you are doing something complex which require a smarter approach to DOM management, but because you're using a framework you're stuck with whatever you can eek out of it.

, in which case the solution typically calls for a smarter approach to DOM management.



Scoring highly on these does ***not*** prevent performance issues. That's because those usually hit when you are doing something complex, and the solution typically calls for a smarter approach to DOM management.

Few frameworks offer much control over how they update the DOM, and if you do hit a performance issue (and you never know if you will) then your options are limited. In the worse case scenario you need to bypass the framework and work with the DOM directly.

RedRunner is unique in that you can gradually take more direct control over every aspect of its operations.



#### What causes performance issues?

There are many **do's** an **dont's** when it comes to performance in DOM manipulation (here in an excellent [article](https://codeburst.io/taming-huge-collections-of-dom-nodes-bebafdba332?gi=e91720c8d0d5) on the subject). The problem with frameworks is two-fold:

1. In certain scenarios they do some of the **don'ts**.
2. They can make it very hard to implement some of the **do's**.

If you can't get the required performance while staying inside the framework (which is entirely possible) your only option is to bypass the framework and do direct DOM manipulation, which gets very messy.

RedRunner solves this problem very elegantly, Rather than use a runtime DOM engine, a babel plugin converts your code into direct DOM manipulation instructions, which use wrappers.



### About productivity

State-driven frameworks generally save time over vanilla/jQuery, but can also cause additional work in insidious ways:

**Unexpected behaviour**: As with any automation system, it's easy to end up with behaviour which doesn't initially make sense. You can spend a lot of time trying to understand why something is (or isn't) happening. This is particularly bad in reactive frameworks.

**Getting in your way**: Simple things are more difficult. You waste time trying to find a way to do it within the framework, then more time figuring out how to bypass the framework without making a mess. Moving an element to another parent in a virtual DOM framework is a classic example.

**Performance issues**: Large scale DOM manipulation can get very slow if you're not careful, forcing you to think outside the box to make performance acceptable. In addition to causing performance issues, some frameworks also make it really difficult to implement solutions which would resolve it.

Given we often spend more time on snags than we do building features, it follows that framework productivity is driven by 

 not how slick its syntax is, but how

We can't predict what snags a given project will get hit with.



 makes sense that the most productive framework is not the one 



It's perfectly possible for the time wasted on these to exceed the time saved by using the framework.



RedRunner was purposefully designed to simultaneously reduce the odds of hitting these issues, and give you more power to deal with them.

Try to remember that as you 





RedRunner's clever yet crude design means you are not just far less likely to hit all of those issues, but also have more power deal with them.



RedRunner doesn't really have an engine. It's just nested components, which update their DOM in a very direct and predictable manner. 

1. Not much can go wrong.
2. You can do anything you want. Plus you get support.
3. Syntax cheat sheet on tap





Rather than rely on a sophisticated engine, RedRunner *compiles* declarative syntax into very crude instructions which can't go wrong.



```javascript
import {Component, mount} from 'redrunner'

const Example = Component.__ex__(html`
  <div>I like {fruit}</div>
`)

let fruit = 'apple'
const component = mount('main', Example)
fruit = 'pear'
setTimeout(component.update, 2000)
```









A framework is essentially an engine which automates DOM changes according to rules typically defined in a declarative syntax.









------



The question is really why are other frameworks so unproductive. The gist of it is that if you want state-driven DOM updates (which all modern frameworks do) then you need some kind of engine.

>  You now work on the DOM solely *through* that engine, and while it mostly saves time, it can also waste time in several ways:

1. There's a lot of scope for confusing behaviour.
2. They can perform poorly.
3. 

RedRunner has no such engine. Instead it *compiles* your declarative code into instructions which update specific DOM elements when data changes.

##### Is it like Svelte?

It is similar to svelte (which is even smaller and faster than RedRunner in most scenarios) except that svelte generates an opaque blob of code which you are not expected to understand or look into. So in a sense you have the same problems as having an engine.

RedRunner updates DOM elements by calling methods on ***wrappers***. The instructions it generates simply match data changes to methods:

```javascript
wrapper = new Wrapper(document.createElement('span'))
if (newValue != oldValue) {
  wrapper.text(newValue)
}
```





's instructions consist of watch



: you can't intercept, interact with or extend them; which means you're back at square one.



Another difference is that Svelte is reactive (like Angular) whereas RedRunner chooses to be manual (like React) and that's because reactive behaviour is incredibly prone to 

### A simple example

The code below creates a basic click counter which attaches to an existing element with id `main` in the document (here are equivalents in [React](https://codepen.io/trnkat96/pen/KqPOoX), [Vue](https://paulund.co.uk/vuejs-click-counter) and [Angular](https://codepen.io/NickCelaya/pen/qXjPbB)).

```javascript
import {Component, mount} from 'redrunner'

const ClickCounter = Component.__ex__(html`
  <div>
    <h2>Click Counter</h2>
	<button :onClick="addOne(p, c)">Click me</button>
    <span>Clicked {..count} times</span>
  </div>
`)

const addOne = (p, c) => {
  p.count += 1
  c.update()
}

mount('main', ClickCounter, {count: 0})
```

##### Explanation

We define a component called `ClickCounter` which includes a multi-line string with HTML inside it, which contains ***directives***. These come in two kinds:

* **Inline** directives (like `{..count}`) which do exactly what you'd expect.
* **Attribute** directives (like `:onClick="..."`) which do many different things.

The `..` means `count` is a field in the `props`. A single `.` means a field in the `component`, and no prefix means a variable in outer scope (module or global). 

The arguments `p` and `c` refer to `props` and `component` respectively. These are some of the variables available in the scope, which you can pass to callbacks in whatever order suits you. The callback increments the `count` field on the props, and tells the component to `update`.

The syntax is exceedingly simple yet powerful, and you don't need to memorise it as you can simply launch a ***cheat sheet*** by placing a `?` anywhere inside a tag:

```html
<span ? >
```

The cheat sheet displays in the browser (instantly if you have hot reload) and lists all the attribute directives available (including custom ones you define in the project) and covers the syntax rules.

### How does it compare to React?

The basic set up is very similar to React: 

1. You define components which control their own DOM and can be nested.
2. You tell the the component when to update, and it updates its nested components.
3. You work entirely in ES6 modules, rather than annotate existing HTML or use special template files.

There are significant advantages to this set up:

1. It is ***not reactive***, so you avoid the mayhem that causes.
2. Your code is ***entirely in ES6***, which makes it easier to organise, reuse and refactor.

Where it differs from React is in how components update their DOM. React uses virtual DOM returned by your component to patch the real DOM. RedRunner ***compiles*** the directives into ***watchers and wrappers*** which update the DOM ***directly***, so there is no virtual DOM.

### Why compile?

High level framework syntax must be translated into low level DOM operations somewhere along the line. RedRunner does this at compilation rather than at run time like most other frameworks, which means:

* The page loads faster, as the translation is already done.
* The bundle is a lot smaller, as the translating code doesn't need to be included.
* The generated instructions can be optimised, making bundles even smaller and faster.
* We are free to create the best possible syntax, without worrying about the cost of parsing it, rather than having to compromise by finding a half-way point.

[Svelte](https://svelte.dev/) is another framework famous for compiling code, and it is actually a bit faster and smaller than RedRunner. However it uses **reactive** data binding, and you must write code in special **.svelte** files.

### So how does RedRunner work?

RedRunner uses two pieces which work together: ***wrappers*** and ***watches***.

#### Wrappers

A ***wrapper*** is an object which wraps a DOM element and exposes methods for manipulating it. You can create one from scratch:

```javascript
import {Wrapper} from 'redrunner'

element = document.createElement('div')
wrapper = new Wrapper(element)
wrapper.text('Hello')
wrapper.css('danger')
wrapper.visible(false)
setTimeout(() => wrapper.visible(true), 2000)
```

It's pretty simple.

#### Watches

A ***watch*** tells a component to remember a value and call a function if it has changed. Let's create a watch by replacing the following line:

```html
<span>Clicked {..count} times</span>
```

With this:

```html
<span :watch="..count|foo(n, w)"></span>
```

This watches `count` on the props, and calls `foo(n, w)` if the value of `count` has changed. The variables `n` and `w` are available in the scope which the callback is called from and correspond to the `newValue` and the `wrapper` which RedRunner will create around the element which the watch is declared on.

Now we implement `foo` as follows:

```javascript
const foo (n, w) => w.text(`Clicked ${n} times`)
```

This code is identical to what got generated from the original inline directive. 

#### Repeat items



```javascript
const Parent = Component.__ex__(html`
  <ul :items="..|Child"></ul>
`)

const Child = Component.__ex__(html`
  <li>{..}</li>
`)

mount('main', Parent, ['apple', 'orange', 'banana'])
```









You now understand RedRunner's internal workings, congratulations.



If all you're doing is changing the text then you're best sticking with an inline directive. But if you're doing more stuff like conditional logic, then it's maybe better to do it all in a callback.


```html
<span :watch="..count|foo(n, w)"></span>
```
s

```javascript
const foo (n, w) => w.text(`Clicked ${n} times`)
```







```javascript
const foo () => alert('Count has changed')
```

This will launch an alert every time whene

not on update.

dd



The `:watch` directive creates a ***watcher*** which is just an object which calls a callback if a value has changed since the last call to `update()`. The callback (in this case `foo`



Most of the time that doesn't matter: you just put directives in the HTML and the DOM updates as expected just like any other framework. However it is worth understanding because:

1. It explains why RedRunner encounters fewer problems than other frameworks.
2. You can hack into it to do clever things.

#### Wrappers and watchers

The best way to explain these is to create them manually. So let's replace this line in the HTML:

```html
<span>Clicked {..count} times</span>
```

With the following:

```html
<span :watch="..count|foo(n, w)"></span>
```

The `:watch` directive creates a ***watcher*** which is just an object which calls a callback if a value has changed since the last call to `update()`. The callback (in this case `foo`) gets called from a scope which has several variables available to use as arguments. We will be using `n` which refers to the new value, and `w` which refers to the wrapper.

 create `foo` as follows:

```javascript
const foo (n, w) => w.text(`Clicked ${n} times`)
```

The code does exactly the same as before, but we've ex

### The generated code

Note that the code in this section is an approximation of what is really generated, to help you understand.

The HTML string is stripped of all directives and what's left gets used to create the initial DOM:


```javascript
e = document.CreateElement()
e.innerHTML = '<div><h2>Click Counter</h2><span></span><button>Click me</button></div>'
```

Next it generates code which creates ***wrappers*** around the elements which had directives, like so:

```javascript
wrapper1 = new Wrapper(e.childNodes[0].childNodes[1]) // the span
wrapper2 = new Wrapper(e.childNodes[0].childNodes[2]) // the button
```

The button had an `:onClick` directive, which creates an event handler: 

```javascript
wrapper2.on('click', function(e) {
  addOne(p, c);
})
```

This code will be run within a function where `p` and `c` are already in scope. Next it creates a ***watcher*** against `this.props.count` and generates a function which calls a method on the ***wrapper*** for the `span` element:

```javascript
component.watch('props.count', function(n, o) {
  wrapper1.text('Clicked ' + n + ' times.')
})
```

We'll explain what this does in the next section.

### Watchers and wrappers

A watcher is just a pair of functions:

* One to read a value.
* One to call if the value has changed.

When you call a component's `update()` method, it loops over its watchers.

A watcher simply remembers the value of a field, the function to call if it has changed during an. This is only triggered when a 

```html
<span :watch="..count|foo(n, o, w)"></span>
```

a
```javascript
const foo = (n, o, w) => {
  
}

```



Watchers do nothing until you tell a component to `update()` at which point it loops over its watcher



### Why no virtual DOM?

A virtual DOM component only works if nothing else touches its DOM. This means DOM manipulations *must* go through that mechanism, and that causes problems:

##### You can easily run into performance issues

Of course, you won't know in advance whether your app will suffer from performance issues, so starting a project with virtual DOM based framework a bit of a gamble (although the same can be said of other frameworks).

##### Some things are overly complicated.

Simple things like moving an element to a different parent are not possible (actually, more recent versions of React support this with "portals").

So the virtual DOM simultaneously causes performance issues, and prevents you from addressing them cleanly. The code required to work around this is usually complex, ugly and a source of further bugs.

The gist of it is as follows:

1. Components build the initial DOM from the HTML string *once* (this is actually a very fast way to do it)
2. Thereafter they only update *specific* DOM elements (the rest of the DOM is ignored)
3. Elements are updated by *watchers* calling methods on *wrappers* (which have pointers to their elements, so there's no DOM traversal)
4. Watchers only fire if the watched data has changed since the last update (checking data is quicker than patching DOM)
5. Components only update when you tell them to (no data binding)

This system has three major advantages over other frameworks:

1. It avoids *all* unnecessary DOM operations (which is why it's so fast)
2. It has no "engine" - just direct DOM updates.
3. You can hook into the system to elegantly take progressive control.

# JUNK



### Why another framework?

jQuery was hell, because all your code could access all your DOM and there was no structure to it.

Modern frameworks promised to fix jQuery hell, which they did, but in the process they introduced another hell.



The running joke among developers is that a new JavaScript framework is born every 5 minutes. The truth however is that only a fraction of them mature into something which is actually usable, hence why only perhaps a dozen are widely used.





But each of those has a serious design flaw, which is usually one of the following:

##### Reactive

Reactive frameworks automatically update the DOM when data changes (and sometimes vice versa). This looks like a great time-saver in the demos, but in a real project where things are more complex and change over time, it is very easy to introduce bugs.

If the time spent fixing these bugs exceeds the time saved by automating the updates (which is a very real possibility) then the framework has delayed you.

##### Virtual DOM

The virtual DOM pattern











### Framework productivity

Frameworks occasionally *decrease* productivity instead of increasing it.

This phenomenon is best explained using the OWF metric, which compares how much time you spend in each of the following three states:

* **OK** - You are programming, it works as expected.
* **WTF** -  Something is not working, and you don't understand why.
* **FFS** -  Extraneous work resulting from using the framework (e.g. reclaiming performance).

Frameworks reduce standard dev time (OK state) but things like reactive behaviour, virtual DOM and other mechanisms can quickly increase WTF and FFS time, which means you end up with something like this:

|           | jQuery | Angular | React  | RedRunner |
| --------- | ------ | ------- | ------ | --------- |
| OK        | 20     | 15      | 15     | 15        |
| WTF       | 10     | 15      | 5      | 3         |
| FFS       | 0      | 5       | 10     | -2        |
| **Total** | **30** | **35**  | **30** | **18**    |

Those numbers are imaginary and obviously biased, but they illustrate the point.

If you're 









Here's what you need to know:

1. You work entirely with ES6 code (no special template files, or annotating existing HTML).
2. You define "components" which control their own DOM, and can be nested.
3. You manually update components (no reactive data binding).
4. The html is not JSX, it is a string which contains ***directives***.
5. The directives gets converted to instructions ***during compilation***.
6. Putting `html` in front of the string tells editors to treat the text like HTML, with syntax highlighting and auto-completion.

Points 1-3 show how similar it is to React, and points 4-5 hint at how different it is. We'll cover the differences and implications further down, but first a quick tour of the syntax.

### Directives

There are ways to inherit and extend, but we'll show you the...

There are two types of directive.

***Inline*** directives use curly braces and insert the value in the DOM and should look familiar:

```html
<span>Hello {..name}</span>
<span>Hello {..name|n.toUpperCase()}</span>
<span class="{.getClass()}">Hello</span>
```

***Attribute*** directives look like HTML attributes:

```html
<div :show=".isUserOnline(p)">Online</div>
<button :onClick="addOne(p, c)">+</button>
```

The key thing to understand is that the text slots mostly get dumped into the generated code, meaning you can do things like this:

```html
<span>{..count|n*2}</span>              <!-- (0, 2, 4, 8) -->
<span>{..count|Math.pow(n, o)}</span>   <!-- (NaN, 1, 2, 9) -->
```

The dot prefixes `.` and `..` are just shorthand to save typing:

* `.count` becomes `this.count` (where `this` refers to the component)
* `..count` becomes `this.props.count`
* `count` without prefix is just `count` (so it better exist in module or global scope).

The letters (`n`, `o`, `p` and `c` and others) are variables available in the scope where the code will run.

* `n` is the new value
* `o` is the old value
* `p` are the props
* `c` is the component

Different variables are available in different scopes (e.g. `n` and `o` only make sense in inline directive modifiers). This allows you to choose which arguments your callbacks receive, which helps you write clean code.

If you forget any of this, just place a `?` wherever an HTML attribute is expected:

```html
<span ? ></span>
```

This will launch the help system in the browser (it's currently just a cheat sheet, but I plan to include things like the ability to play with your components etc).

### Pick section name

Message: directives are powerful, but that's not what makes them pro

The simple yet powerful syntax and accessible help system certainly speed you along, but that's not what makes RedRunner productive. 

What really makes RedRunner productive is that it doesn't cause the mind bending bugs.



So far we have seen what its like *using* RedRunner, but 



### Compiling

Any framework which uses an HTML mini-syntax (like Vue, Angular and RedRunner) must parse and convert the syntax into instructions to update the DOM. 

Most frameworks do this at run time, which means:

* The code which handles that (which can run into many kB) must be loaded on each page.
* The parsing and interpreting delays the page loading.

RedRunner does all this during the compile step, meaning:

* The code which handles that is not loaded onto the page.
* Page loading is faster.
* The generated instructions can be optimised (making bundles even smaller and faster)

We can focus on making the mini-syntax powerful and intuitive, and the generated code compact and fast, rather than having to compromise by finding a half-way point.

### Generated code

The click counter component:

```javascript
const Main = Component.__ex__(html`
  <div>
    <h2>Click Counter</h2>
    <span>Clicked {..count} times</span>
	<button :onClick="addOne(p, c)">Click me</button>
  </div>
`)
```

Would generate code which approximates to this (the actual code generated looks quite different, this is just for illustration):

```javascript
// Create the element from HTML string with directives stripped
e = document.CreateElement()
e.innerHTML = '<div><h2>Click Counter</h2><span></span><button>Click me</button></div>'

// Create wrappers around the DOM nodes of interest
wrapper1 = new Wrapper(e.childNodes[0].childNodes[1]) // the span
wrapper2 = new Wrapper(e.childNodes[0].childNodes[2]) // the button

// Create the callback for the button
wrapper2.on('click', function(p, c, w, e) {
  addOne(p, c);
})

// Tell the component to "watch" the props.count and call
// wrapper1's text() method if it has changed since last update.
watch1 = new Watch('props.count', function(n, o) {
  wrapper1.text('Clicked ' + n + ' times.')
})
```

The gist of it is as follows:

1. Components build the initial DOM from the HTML string *once* (this is actually a very fast way to do it)
2. Thereafter they only update *specific* DOM elements (the rest of the DOM is ignored)
3. Elements are updated by *watchers* calling methods on *wrappers* (which have pointers to their elements, so there's no DOM traversal)
4. Watchers only fire if the watched data has changed since the last update (checking data is quicker than patching DOM)
5. Components only update when you tell them to (no data binding)

This system has three major advantages over other frameworks:

1. It avoids *all* unnecessary DOM operations (which is why it's so fast)
2. It has no "engine" - just direct DOM updates.
3. You can hook into the system to elegantly take progressive control.



This crude and direct approach has two additional benefits which have far reaching implications for you, the developer:

1. It doesn't trip you up
2. It doesn't tie you up

### How frameworks trip you up

Frameworks trip you up in two big ways: reactive behaviour and opaque engines.

Reactive behaviour (i.e. data binding) saves you a bit of coding, but when things get messy (as they often do in front end) you can very easily walk into bugs or performance issues (as the DOM updates far more than is necessary).

These bugs can take hours if not days to debug, which quickly undermines the time you saved at the beginning.

Reactive behaviour can also update the DOM far more often than strictly necessary, which can cause performance issues, which also take time to fix.

What makes these issues hard (or harder) to fix is that you are programming an engine, and though you may understand what instructions to feed it, you probably don't understand how it works unless you read and understand the framework's source code, which often isn't obvious. You essentially hand over control of the DOM to an engine you *hope* will do the right thing.

RedRunner (like React) is not reactive, although in both cases you get much the same result.

RedRunner has very little in the way of engine: all the work is done by watchers, which you  

### How frameworks tie you up

Virtual DOM based frameworks have one glaring flaw, which is that you cannot modify the DOM other than by going through the framework.



### Summary

I hope this quick overview has convinced you that we can have frameworks with nice syntax, tiny bundles, and lightning fast updates *without* the pain and problems we have grows used to in other frameworks.



I hope this quick overview has convinced you that the pain and problems of working with front end frameworks are not inevitable, that we can do better, and that front end development can be fun one day.



a framework can be tiny, fast and easy to use, without the pain and problems we seem to accept as inevitable part of front end frameworks.

RedRunner is not production ready yet, but you can help speed things up by:

* Giving it a star on GitHub (as this attracts contributors).
* Playing with it.
* Using it on personal projects
* Reporting bugs, or features you think are missing.



# Old Stuff



----



 It doesn't use an engine to update the DOM, instead the compilation process converts your code into instructions which update individual elements. This means:

1. It doesn't have the overhead of other frameworks.
2. You can safely manipulate the DOM directly alongside the framework.

Manipulating the DOM directly is normally discouraged, but it is often the only way to resolve a performance issue. In most frameworks this requires special steps and makes a mess of your code (especially those which use virtual DOM). 



 is unique in that you never have to do this, because you can manipulate the DOM as you please from within.





##### How does RedRunner help performance?

RedRunner doesn't use an engine to update the DOM, instead the compilation process converts your code into instructions which update individual elements. This means:

1. It doesn't have the overhead of other frameworks.
2. You can safely manipulate the DOM directly alongside the framework.

Manipulating the DOM directly is normally discouraged, but it is often the only way to resolve a performance issue. In most frameworks this requires special steps and makes a mess of your code (especially those which use virtual DOM). 

In RedRunner this is clean, easy and elegant, as you can conveniently access the same wrapper objects it uses internally.

### 

Many frameworks rely on ***data binding***, whereby you bind data to an element, and the element automatically updates whenever you update the data. Some frameworks have ***two-way data binding*** whereby changing the element will update the value (which in turn cause other things to update).

This looks like it will save you time, but often does the ***exact opposite*** because it is so easy to cause hard to diagnose bugs or performance issues (Angular 1 was notorious for updating the DOM multiple times).

This kind of bug can easily use up far more time than you saved with declarative syntax, to the point where developing with a modern framework is often ***less productive*** than if you'd stuck with plain JavaScript.

Unfortunately you can't tell in advance whether your project will get hit with such a bug.

Frameworks like React and RedRunner don't have data-binding, and avoid this whole category of nasty bugs, however, React screws you up in a different way.

### How frameworks tie you up

Virtual DOM based frameworks have one glaring flaw, which is that you cannot modify the DOM other than by going through the framework.

Move a div.

RedRunner doesn't have this problem, because it doesn't "control" the DOM, it only updates specific elements. Those by reference, meaning you're free to do whatever you like:

* Detach, move or add elements.

```html
<div>
  <h2>Click Counter</h2>
  <span>Clicked {..count} times</span>
  <button :onClick="addOne(p, c)">Click me</button>
</div>
```

We know the DOM is only drawn once, we know which elements will be updated (the span) and we know the wrappers have a *reference* to their element. If 

The point is: you don't know. Portals

#### The final twist

RedRunner's design



 not only makes it possible to manipulate the DOM directly.

```javascript
const ClickCounter = Component.__ex__(html`
  <div>
    <h2>Click Counter</h2>
    <span :el=count></span>
	<button :onClick="addOne(p, c)">Click me</button>
  </div>
`)

const addOne = (p, c) => {
  p.count += 1;
  c.el.countSpan
    .text(`Clicked ${p.count} times`)
    .css(p.count > 5 ? 'red' : 'black')
}

mount('main', ClickCounter, {count: 0})
```



* 



 

# 





You can use denote functions by adding brackets:

```javascript
class Greeting extends Component {
  __html__ = html`
    <span class="{.getCss()}">{greeting} {..name}</span>
  `
  getCss() {
    return 'alert'
  }
}

const greeting = 'Hello'
mount('main', Greeting, {name: 'World'})
```

You can also pass the values through modifier code:

```html
<span>{..count|n * 2}</span>
<span>{..count|.getText(n, o)}</span>
```

The variables `n` and `o` will be available in the scope and refer to the new and old value of count respectively. There is no `eval` at work here, your text goes into the generated code.

##### Attribute directives

These are written as HTML attributes:

```html
<div :show=".isUserOnline(p)">Online</div>
<button :onClick="..addOne(p, c)">+</button>
<ul :items="..items|Child"></ul>
```

What 

Being correct HTML means you can get 

, and do various things

The variables `p` and `c` refer to the *props* and *component* respectively, there are several others depending on the situation (like `e` for the event).

There's a dozen attribute directives available which do different things. You can overwrite them or define your own.

Being able choose which arguments your callbacks receive is really convenient, and helps you write clean code.

#### How can simplicity speed up development?

Frameworks lure you in with slick syntax in demos, only to drag you through hell in a real life project.

### How do I use it?

Although it *works* very differently to React, you *use* in much the same way:

* You work entirely with ES6 code (no special template files, or annotating existing HTML).
* You define "components" which control their own DOM, which can be nested.
* You manually update components (no reactive data binding).

However, unlike React:

* There is no virtual DOM.
* There is no JSX.
* Props work differently.

All of these were conscious decisions, explained in [design](/design).

no engine

#### No black boxes

* There is no virtual DOM involved (a major boost).
* There is no DOM traversal (as we have pointers to the DOM elements which change).
* Elements which don't change (like the H2) are completely ignored.

* There are no magic updates firing off.

#### What are the benefits?

Aside from smaller bundles and faster performance, being simple and crude has two major advantages:

1. You always know exactly how, when and why the DOM gets updated (because run time magic is a productivity killer)
2. You can elegantly and progressively take control where needed.

#### Why is run time magic a productivity killer?

You only need to get burned a couple of times to realise just how risky it is handing control of your DOM over to a black box which you don't understand.

The only magic we do is at compile time, to create cool syntax, custom directives and in-browser help system.



#### How do I "elegantly and progressively" take control?



```javascript
const Main = Component.__ex__(html`
  <div>
    <h2>Click Counter</h2>
    <span>Clicked {..count|} time{..count|s}</span>
	<button :onClick="addOne(p, c)">Click me</button>
  </div>
`)

const addOne = (p, c) => {p.count += 1; c.update()}

mount('main', Main, {count: 0})
```

#### Why would I need such a level of control?

Do you have deadlines? I do.





1. WTF and FFS time means the likes Angular and React can be less productive than jQuery.
2. A framework can be more productive by simply cutting WTF and FFS time, even if the OK time is similar.



The main problem is that you can't tell how much WTF and FFS time a given framework will add to a given project.



from a simple demo how badly your framework will be affected

RedRunner was designed specifically to cut down WTF and FFS time that plague other frameworks, and in the process 

--





1. Reactive frameworks (like Angular) have a high WTF factor, because two-way data binding easily creates chaos, and ceding control of the DOM to a black box doesn't help matters either.
2. Virtual DOM based frameworks (like React) have a high FFS factor because the virtual DOM prevents you from doing simple things that would be trivial in jQuery, which you often want to do for performance reasons.
3. RedRunner has low WTF factor because it uses a crude watcher/wrapper system instead of being reactive or using a virtual DOM.
4. RedRunner's FFS factor is negative because it sits on top of a library for direct DOM manipulation which you can hook into.
5. lets you do whatever you could do in jQuery/vanilla in a clean and integrated way.

##### Where's the gain?

In the OK state Angular and React are more productive than jQuery, not because they automatically update the DOM, but because they provide structure which organises code and controls scope.

If you replaced React's virtual DOM with a system to update DOM elements using jQuery wrappers



RedRunner has no data binding, and no virtual DOM. Instead it uses a watcher/wrapper system, which directly updates DOM elements


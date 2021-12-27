## What is RedRunner?

RedRunner is a front end framework which you can use in place of React, Angular, Vue etc... 

Some reasons you might prefer it over those include:

1. Your bundles will be far ***smaller***.
2. DOM updates are a lot ***faster***.
3. It makes you a lot more ***productive***.

We'll quickly cover these points as RedRunner will make more sense once we do.

### About size

RedRunner produces absolutely tiny bundles compared to mainstream frameworks:

<div class="stats_div stats_tour">
  <header>Size of identical benchmark app</header>
  <div class="stats_table" id="framework_size_chart"></div>
  <footer>
    Sizes of minified and gzipped bundle of non-keyed implementations of the <a href="https://github.com/krausest/js-framework-benchmark">js-framework-benchmark</a> app.
  </footer>
</div>

Bundle size matters as:

1. It impacts loading times, especially on mobile (even when cached).
2. It forces difficult decisions on chunking and routing in larger sites.

With RedRunner these issues are just less severe.


### About speed

RedRunner beats most frameworks on most benchmarks:

<div class="stats_div stats_tour">
  <header>Results for create 10,000 rows test</header>
  <div class="stats_table" id="framework_speed_chart"></div>
  <footer>
    Geometric mean over 10 runs using non-keyed implementation of <a href="https://github.com/krausest/js-framework-benchmark">js-framework-benchmark</a> (run locally).
  </footer>
</div>

But users won't notice milliseconds here and there, all they notice is when a page is <i>slow</i>.

When a framework turns slow (which usually happens late in the project) you need to get creative, and the glass ceiling is how much <i>control</i> you have over the DOM.

RedRunner's secret weapon is letting you cleanly take control of any DOM operation, at as granular a level as you like, seamlessly interlacing with the framework's own operations. As such, it blasts all other frameworks out of the water in terms of how easily you can avoid performance issues.


### About productivity

Frameworks generally save time, but also cause additional work in two ways:

1. **Unexpected behaviour**: The more automation, the more confusing the behaviour resulting from mistakes. Reactive frameworks are particularly bad for this, and you end up wasting a lot of time.
2. **Getting in your way**: Simple things are more difficult. 

RedRunner <i>generates</i> code which manipulates the DOM directly. There is no engine to create unexpected behaviour or to get in your way.

## Why RedRunner

We'll have a quick glance at the basic structure, then explain how RedRunner actually works.

Unlike other frameworks, you will understand exactly how each DOM element is updated.

### A click counter

The code below creates a simple click counter component:

```javascript
import {Component, mount} from 'redrunner'

const Counter = Component.__ex__(html`
  <div>
    <h2>Counter</h2>
	<button :onClick="increment(p, c)">+1</button>
	<button :onClick="reset(p, c)">Reset</button>
    <span>Clicked {..count} times</span>
  </div>
`)

const increment = (p, c) => {p.count += 1; c.update()}
const reset = (p, c) => {p.count = 0; c.update()}

mount('main', ClickCounter, {count: 0})
```

Here are equivalents in [React](https://codepen.io/trnkat96/pen/KqPOoX), [Vue](https://paulund.co.uk/vuejs-click-counter) and [Angular](https://codepen.io/NickCelaya/pen/qXjPbB).

### Explanation

We defined a component class `ClickCounter` and then mounted an instance of it (herafter referred to as "the component") to an element with id `main` passing `{count: 0}` as props. 

From that point on this component will control and update the DOM underneath that element.

The function `addOne` gets called whenever we click the button, and all it does is increment the `count` field on the props object, then tell the component to `update`.

So far this is very similar to React: 

1. You define components which control their own DOM (these can be nested)
2. You must explicitly tell the component to update (no reactive data binding)
3. You work entirely in ES6 modules, rather than annotate existing HTML or use special template files

All you do in the HTML is define elements with ids:

```html
<div id="main"></div>
```

Where it differs from React is what happens to the stuff that looks like HTML inside our component. 

Rather than JSX which generates virtual DOM, our HTML is just a string which contains <i>directives</i> which get <i>compiled</i> into <i>watches</i> and <i>wrappers</i>.

### Directives

Directives are special instructions you place in a component class's HTML string, and come in two kinds:

* **Inline** directives (like `{..count}`) which can be placed inside text or inside normal attributes and do exactly what you'd expect.
* **Attribute** directives (like `:onClick="xyz()"`) which are written as attributes, but get stripped, and do many different things.

We'll explain what the `..`, `p` and `c` mean a bit further down. Don't worry, it's all very simple, and if you ever forget just place a `?` anywhere inside a tag:

```html
<span ? >
```

And a cheat sheet will magically appear in the browser!

### Watches

A watch simply watches a value (such as a field on the props) and runs code if it has changed, which usually updates a DOM element by calling a method on a wrapper.

You don't normally deal with watches directly

Let's add a second `<span>` element and define a watch on it like so:

```html
<span :watch="this.props.count|foo()"></span>
```

The `:watch` directive has two <i>slots</i>, separated by `|` the first of which specifies the value to watch, the second of which is the code to run. 

In this case we are calling a function `foo` so let's add that somewhere in module scope:

```javascript
const foo = () => {
  alert('Count has changed!')
}
```

One important point to note it that callback will only be called if the watched value has changed, so clicking the reset button will only show the alert if the value of `count` is not `0`. This helps RedRunner minimise DOM updates.

### Shorthand

The shorthand notation lets you replace `this.` with `.` so the following are equivalent:

```html
<span>Hello {this.name}</span>
<span>Hello {.name}</span>
```

You can also shorten `this.props` to `..` so the following are all equivalent:

```html
<span>Hello {this.props.name}</span>
<span>Hello {.props.name}</span>
<span>Hello {..name}</span>
```

If there is no prefix then it is assumed that you are referring to module/global scope, like we did with the onClick directive.

```html
<span :onClick="addOne(p, c)"></span>
```

These rules apply to most slots. If in doubt, place a `?` to bring up the cheat sheet:

```html
<span ? :onClick="addOne(p, c)"></span>
```

### Scope variables

RedRunner makes variables available to the code in slots. 

Let's use `n` which refers to the new value of whatever is being watched:

```html
<span :watch="..count|foo(n)"></span>
```

And modify the callback as follows:

```javascript
const foo = (n) => {
  alert(`Count has changed to ${n}!`)
}
```

We can also use `o` which refers to the old value:

```html
<span :watch="..count|foo(n, o)"></span>
```

You can use these in whatever order you like, just make sure it matches the callback's signature. And of course you can call them whatever you like in the callback:

```javascript
const foo = (newValue, oldValue) => {
  alert(`Count has changed from ${oldValue} to ${newValue}!`)
}
```

It's really nice when the framework doesn't dictate which arguments your callbacks take.

Other commonly used variables include `p` for the props, and `c` for the component, and these are available in attribute directive slots too.

The following line should now make sense:

```html
<button :onClick="addOne(p, c)">Increment</button>
```

### Wrappers

So far we're just showing alerts, so let's change our code to make the second `<span>` element show the old value.

To do this we'll use variable called `w` which refers to the <i>wrapper</i>. 

```html
<span :watch="..count|foo(n, o, w)"></span>
```

RedRunner automatically creates a wrapper around every element with a directive. 

A wrapper is just an object with methods which manipulate the element it wraps, such as `text()` which sets the element's text:

```javascript
const foo = (n, o, w) => {
  w.text(`Previous count was ${o}`)
}
```

Of course this is very verbose way of setting an element's text, and you'd normally use an inline directive like the first `<span>` we saw.

Before we revisit inline directives, let's look at one more way we can use the `:watch` directive, where we use a third slot to specify the method we wish to call on the wrapper, in this case `text` : 

```html
<span :watch="..count|foo(o)|text"></span>
```

Now the watch will use the return value of `foo(o)`, and pass that to `text()` rather than `foo` doing it, so let's modify `foo` to do just that:

```javascript
const foo = (o) => `Previous count was ${o}`
```

When viewed this way, the syntax of a `:watch` directive can be expressed as:

`"valueToWatch | formatter | targetMethod"`

### Inline directives

Inline directives take an optional second slot, which you can think of as a <i>formatter</i> and it has access to the expected variables:

```html
<span>Hello {..name|n.toUpperCase()}</span>
<span>Hello {..name|formatName(n, o)}</span>
```

If you don't specify the second slot it assumes you just want to use the new value as is, so the following are equivalent:

```html
<span>Hello {..name|n}</span>
<span>Hello {..name}</span>
```

So the syntax of an inline directive can be expressed as:

`{valueToWatch | formatter}`

Which is  identical to the watch, except the `targetMethod` is inferred from the location of the inline directive, as you can also place them in normal attributes:

```html
<span id="user-name-{..id}">{..id}</span>
```

As you might have guessed, inline directives are just syntactic sugar around the `:watch` directive, and both compile to identical watches and wrappers.

So the above could be written like this:

```html
<span :watch="..id|'user-name-' + n|id">{..id}</span>
```

Don't worry if this is confusing, 99% of the time you just write declarative code without even thinking about watches and wrappers.



So we could have written the second `<span>` as an inline, which feels a lot more declarative:

```html
<span>Previous count was {..count|o}</span>
```

Now you might be wondering why we went through this whole tanger when we could just write simple code like the above.

The answer is that you now understand 90% of RedRunner's internals

### Transparency

In fact, 99% of the time you'll be writing neat declarative code and never even have to think about watchers and wrappers:

```javascript
const CustomerDetails = Component.__ex__(html`
  <div>
    <div class="customer-name">
      <span>{..firstName}</span>
	  <span>{..lastName}</span>
	  <span :visible="..maidenName">
	     (nee {..maidenName})
      </span>
    </div>
	<imd src="{getImgUrl(p.id)}">
	<div :items={..creditCards|CardInfo}></div>
  </div>
`)

const CardInfo = Component.__ex__(html`
  <div>
	<img src="{..type|getCardLogo(n)}">
	<span>{..number|lastFourDigits(n)}</span>
  </div>
`)
```

You 

```javascript
const CustomerDetails = Component.__ex__(html`
  <div>
    <div class="customer-name">
      <span>{..firstName}</span>
	  <span>{..lastName}</span>
	  <span :visible="..maidenNames.length == 1">
	     (nee {..maidenName[0]})
      </span>
	  <span :visible="..maidenNames.length > 1">
	     (previous names: {..maidenNames| n.join(', ')})
      </span>
    </div>
	<imd src="{getImgUrl(p.id)}">
	<div :items={..creditCards|CardInfo}></div>
  </div>
`)

const CustomerDetails = Component.__ex__(html`
  <div>
    <div class="customer-name">
      <span>{..firstName}</span>
	  <span>{..lastName}</span>
	  <span :watch="..id|listMaidenNames(p, w)"></span>
    </div>
	<imd src="{getImgUrl(p.id)}">
	<div :items={..creditCards|CardInfo}></div>
  </div>
`)

const listMaidenNames = (p, w) => {
  const len = p.maidenNames.length
  w.text(len == 1 ? 
     :
         )
}
```







The answer to that is that you now know how DOM updates happen 





And that's it!

You will now be able to tell exactly how, when and why every single DOM element gets updated in RedRunner, which is more than most developers can say about their favourite framework.





Now you might be wondering why I dragged you through this tangent about watches and wrappers when you could 





Now you might be wondering why 

### Everything the same



```javascript
const ClickCounter = Component.__ex__(html`
  <div>
    <h2>Click Counter</h2>
	<button :onClick="addOne(p, c)">Increment</button>
	<button :onClick="reset(p, c)">Reset</button>
    <span>Clicked {..count} times</span>
    <span>Previous count was {..count|o}</span>
  </div>
`)
```







### Slots are code

Except for expanding shorthand notation, the text you place in slots is mostly <i>copied</i> directly into the final source code during compilation.

So you could have written this:

```html
<span :watch="..count|alert('Count has changed!')"></span>
```

You can directive:

```html
<span>Clicked {..count * 2} times</span>
```

 which

```html
<span>Clicked {..count|n * 2} times</span>
```





, and we could also have done it this way:

```html
<span :watch="..count|w.text('Previous count was ' + o)"></span>
```



```html
<span :watch="..count|w.text('Previous count was ' + o)"></span>
```



: you can take control of just about all incrementally and seamlessly.



you have to get creative and take control of operations

The <i>real bottleneck</i> is how much freedom you have to get creative and take control of operations, and most frameworks really suck in this respect.

Your best protection against performance issues is not to pick the fastest framework, but the one which gives you most control over its operations.

Most frameworks give you virtually no control whatsoever. RedRunner gives it to you on a silver plate


<script type="text/javascript">
  drawChart(frameworkStats, "createRows", "framework_speed_chart", "ms");
  drawChart(frameworkStats, "size", "framework_size_chart", " kB");
</script>
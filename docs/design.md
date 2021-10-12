# Design

RedRunner differs from the other big frameworks in several subtle ways. We'll start with fundamentals and cover finer points as we go.

##### The two paths

A reactive frontend framework's most obvious task is to provide a way to define dynamic DOM, and there are two main approaches to this:

1. Usennotations in or around the HTML which get interpreted by an engine (Angular, Vue and template languages). 
2. Use functions which output virtual DOM, which is used to update the real DOM (React & co). 

It doesn't matter that Vue uses a virtual DOM under the hood, it is the paradigm (as the user sees it) we are interested in for now.

RedRunner uses annotations, but in a such a way that it avoids the problems of that approach.

##### The problem with annotations

Annotations work great when the content is generated once (server-side, static site etc). Template syntax which supports that can be simple yet powerful. But when it comes to dynamic behaviour, this approach encounters several problems:

1. The syntax needs to be richer, which involves learning and looking things up more.
2. The syntax is more complex, so more error-prone.
3. It is much harder to pick up on errors in a dynamic environment.
4. The syntax can't do everything, and the logic often ends up split between HTML annotations and JavaScript functions.
5. An engine is required to interpret the syntax, and those:
   1. Sometimes don't behave the way you expect it to.
   2. Can't always give you meaningful error messages.
   3. Will perform well in some situations, but abysmally in others.
   4. Can add a sizeable chunk to your bundle.

RedRunner has a very minimal system with just two types of annotation:

* *Placeholders* which you can place in text or attribute values (self-explanatory).
* *Directives* which are attributes that do more fancy stuff.

```html
<div class="{placeholder}" :items="todos|Todo"></div>
```

You don't write any logic (for, if while etc) inside directives, you only ever tell the directive which functions and data to use as slots separated by the `|` symbol. This arrangement keeps your HTML very clean compared to a fully fledged mini-syntax (or the mess of JSX) and makes errors far less likely, as well as facilitating code reuse.

You don't have to memorise directives or the slots they accept as you can display help in your browser by putting a `?` in front of a directive (or anywhere inside a tag):

```html
<div ? :items=""></div>
```

The help also lists the other directives available, and other useful bits of information. 

This approach elegantly solves points 1, 2, 3 and 4 in the above list of problems. 

To see how it solves point 5 let's first take a closer look at engines.

##### The problem with DOM engines

Updating the DOM *efficiently* according to your high level instructions is difficult, and the engines which do this end up being obscure and complex to the point where most of us won't actually know how they work. We just learn *what* to do, and the gotchas.

There are two dangers to this, the first is that erratic behaviour can be very time consuming to pin down. The second is that its very easy to over-update, or to repeat calculations, which are things you don't notice until performance becomes an issue.

Even without over-updating, lack of understanding about how and when things get updated can make it hard to tweak for performance.

RedRunner's internal operation is extremely simple. You break up your UI into components. 

When a component is mounted it:

1. Creates its initial DOM
2. Creates a "wrapper" around every nodes which has dynamic content
3. Creates watchers linking fields (e.g. `person.name`) to methods on the wrapper (e.g. `w.text()`)

When a component updates it iterates through watchers, and:

1. Determines if the watched value has changed
2. Convert the value (optional)
3. Passes that value to a method call on the wrapper

And that's basically it, the same process applies whether you're setting a css class, sorting 1000 table rows, or swapping an element for another.



##### The problem with virtual DOM

##### The problem with large bundles







 template languages lack temporal understanding and therefore struggle with dynamic pages.





In this article I'll discuss the design constraints I deemed important.

1. No magic
2. No black box
3. No template language
4. No mini-syntax
5. No DOM monopoly
6. Small bundle size
7. Use a compiler

### ES6 modules

In Angular you place directives in your HTML, and complement that with JavaScript code in other files. That's a mess as you need to match things up and are constantly flicking between HTML and JavaScript.

With RedRunner you set the anchor point for your app in the HTML, then do all your work in JavaScript ES6 modules.

### No template logic

Templates languages like jinja, handlebars and so on are great for back-end frameworks or static site generators where the content is generated once. But template languages lack temporal understanding and therefore struggle with dynamic pages.

The two solutions frameworks have come up with are:

1. Make the template language smarter (Angular, Vue etc...)
2. Render to virtual DOM (React & co)

Both these approaches have serious downsides.



template languages lack the capability 

are ill suited to handling this (unless you are generating virtual DOM)

### No magic

Frameworks like Angular "magically" update the DOM when data changes, and vice versa. Even though we understand how the underlying mechanics work, we generally don't keep track of how and when updates are triggered, meaning we're essentially treating is a magic that just works. While this lets you build functionality very quickly with very little code, it also makes for very complicated debugging when things don't work, as you need to untangle a web of multi-directional updates just to understand what is happening, as well as being a source of potential bugs in its own right.

Saving time on typing only to add double that time back in debugging is a false economy.

Magic is really cool to play with, but for real world projects we can't risk using technology which could unexpectedly add hours or days to the development schedule at any time.

### No black box









also introduces a lot of complexity into your app (the observer mechanism) as well as automatic updates which trigger when you don't necessarily want them to.







1. 

### Simplicity

Frameworks like Angular magically update the DOM when data changes. While this lets you create functionality very quickly with very little code, it also introduces a lot of complexity into your app (the observer mechanism) as well as automatic updates which trigger when you don't necessarily want them to.

Although those usually stay hidden, 







Web apps draw and redraw the UI according to data and state, which can be affected by user interaction and responses from servers.



handle requests to and from servers, user interaction, and DOM updates (including transitions etc...) 





### No data binding

Data binding requires using the observable pattern, which introduced an extra level of complexity into your code. Alternatively you don't deal with it and just treat it as "magic" which is just as bad.



### No magic

Many frameworks automatically update the DOM when data changes, and many allow the other way too.





AngularJS uses the observer pattern for data binding

When I first used AngularJS, I was blown away by how quickly and easily I could build up functionality thanks to its sleek syntax and magic two-way data binding. I call it "magic" because it relies on a slightly less-used language feature (the observer pattern) which

 even though we might understand the underlying mechanisms, it generally doesn't affect how we use angular: you use it and don't think of it, it essentially feels like magic.

The time I saved was impressive, but always seemed to be swallowed up by long frustrating debugging sessions on what often turned out to be ridiculous bugs. The bugs were not all caused by issues with magic data binding, but that certainly makes a lot harder to follow what is going on, and give extra places to check for bugs even when they lay elsewhere. Coupled with a few other aspects of Angular (black box, mini-syntax) several sessions turned truly Kafkaesque.

I eventually had to admit that Angular likely cost more time than it saved on many projects, solely due to the time taken to debug totally unanticipated bugs. And of course, it was very hard to predict which projects would get hit by those.

The lesson is 



Frameworks such as Angular, Vue and Svelte automatically update the DOM when data changes, and vice versa,Frameworks such as Angular, Vue and Svelte automatically update the DOM when data changes, and vice versa,

, usually caused by an oversight of how and when two-way data binding.





I also soon realised that the declarative code and  were a double-edged sword. A very simple mistake or oversight could create a debugging nightmare as you try to untangle the mess of bi-directional updates.



### No data-binding

The whole point of a reactive JavaScript framework is to have the DOM reflect your data, but there are different ways of doing this.

By "data-binding" I mean having the DOM automatically update when data changes (by using the observer patter)









My first requirement for a framework is that is should have no magic. Automatically updating the DOM when data changes (or vice versa) using the observer pattern is "magic": you tend not to care or understand exactly how and when it works - it just does, and you use it.

I agree that it is very impressive, and was hooked on the idea myself, but have concluded that it 



 proposal and can be used to build complex functionality very succinctly and quickly, 





Frameworks such as Angular, Vue and Svelte automatically update the DOM when data changes, and vice versa, which is just asking for trouble.

I 





 and by that I mean DOM being automatically updated when data changes



This is a very seductive tool: it lets you build reasonably complex functionality very succinctly and quickly, without knowing or caring about how and when updates happen, and everything seems sweet.

But as your UI grows in complexity, so does the probability of hitting a bug which actually requires you to understand what is being updated when. Magic two-way data bindings can make it hellishly difficult to follow the updates (which could even be circular) as well as being a large source of unintended behaviour (which may only cause a detectable "malfunction" in combination with other erroneous behaviour) in the first place.

It's tempting to think the primary benefit of a framework is automatic DOM updates, but structure and scope management.

It just takes one or two of bad bugs to easily negate the time saved by automation, and you soon reach the point at which it would have been better not using a framework at all.

Frameworks like React and RedRunner work differently. You need to explicitly tell components to update after the data has changed. The slight inconvenience of an extra function call here and there is a very small price to pay for avoiding insane debugging black holes caused by two-way data binding.

RedRunner does have something which comes close two-way data binding, but there's no magic to it.

### No black box







--------



That's when you realise that relying on "magic" updates was a very dangerous gambit. 



I call this "magic" because you mostly don't know or care about how it works - it just does. 

The more complex a UI gets, the more things can potentially misbehave, the harder it is to understand why, more chance of spill over, the more change of fixes causing new breakages. That is true regardless of how the UI is built, but magic updates *amplify* that problem ten fold. Angular is notorious for this.

If your UI misbave

The first issue is that you are neither aware nor in control over how and when the DOM updates, which is not a problem most of the time, as it all just works. The problem is what happen





and it's hard *not* to be seduced by this. All you need to do is update the data, and the DOM will "magically" update.

 I call this "magic" because you are not supposed to worry how it works - it just does.

 a framework which updates the DOM for you.

DOM updating automatically in response to an array being updated, and it is easy to picture how much typing this will save you. What is less easy to picture is just how much potential  for trouble this creates. This is the major problem with Angular: you can build impressive functionality really quickly, but if/when the UI starts to behave in unexpected ways, then you're in for a rough ride as you try to figure out which data updates trigger DOM updates and vice versa (often in a circular loop).

The time wasted trying to debug faulty behaviour can very easily negate any time saved from being able to build functionality quicker thanks to the automation. Magic automation can quickly prove to be a false economy, and nowhere more so than in a front end framework.

The more insidious problem is that you don't know at the outset of a project how many such glitches you will get hit by, and how long they will take to fix.

That is not to say automation is not a desirable tool, but it needs to be easy

### 





# OLD

--------------



 automation, and that's because fixing problems takes far longer than writing code. Beware of frameworks which claim to save you time by automating boring parts.



The question any sane developer asks themselves once they've been through this a few times is whether the total time saved by having this automation is worth the 







It was so easy to end up in an infinite update cycle that Angular's only option was cap the number of update cycles (to 20) which is tantamount to an admission that two-way data binding is a fundamentally broken concept.





without quite understanding how it works (it just does) until you realise you introduced a bug somewhere, and then you need to 



These can create very convenient automation like the DOM updating 

 this kind of magic. Upon seeing it in action you can picture exactly how you can use it to define functionality with minimal code. And right enough, you can often express complex UI behaviour far more succinctly, and far more quickly, than you could otherwise. But there's a catch...

The more complex a UI gets, the more things can potentially misbehave, the harder it is to understand why, more chance of spill over, the more change of fixes causing new breakages. That is true regardless of how the UI is built, but magic updates *amplify* that problem ten fold. Angular is notorious for this.



there are to be circular effects, the





and the longer it takes to figure out what went wrong.



But sooner or later something inevitably goes wrong: the UI now behaves in an unexpected way, and you have no idea what change caused it. You were coasting on magic, but now you need to understand what the magic does, because its not doing what you want it to.





As anyone who used Angular on a serious project knows, you eventually end up wasting hours trying to figure out the sequence of update triggers in order to understand why on earth the UI is behaving in an unexpected way.

You only need this to happen once or twice on a project or sprint to 

### 

may seem like "React without virtual DOM"





RedRunner is a rather loose and open framework, but the design certainly comes across as very opinionated. In this article I will explain some of the decisions which made RedRunner is the way it is.

----

RedRunner was built out of frustration at existing solutions, observations the world seemed to be ignoring, and the lure of untapped technologies, but the same can probably be said of most frameworks.

In no particular order

## No magic data binding

ng

yes its cool

economy

## No mini syntax

Elm is OK.

## No black boxes



## Keep it simple



## DOM access

It is only normal that certain framework strategies, in particular blanket update strategies such as diffing to a virtual DOM, require total monopoly on the DOM they control in order to function.

But the DOM can be slow and occasionally a bit fiddly, and there are many situations where the simplest and cleanest way to achieve something is by working directly with the elements involved. Therefore, a framework should make it relatively easy for you to do so, on the few occasions you need to.

This is where virtual DOM based frameworks fall apart. You have to really jump through hoops to get to the DOM without messing up the whole system, and to me that is a deal breaker.

Consider the case of needing to move an element from one part of the DOM to another. This is a really useful trick in certain situations, such as a table where each row has the same drop down box with 300 options.

The React team took over 4 years to finally enable this despite it being in a highly requested feature. And the solution involves using "portals" - which essentially voids the accolade of being a simple framework. 

That's the difficulty with simple: if you're *too* simple, then certain features require far more complicated steps to achieve than they do in a slightly less simple framework. This is true in many places.

RedRunner hopefully has the right amount of simple. As for DOM access, it doesn't make it "easy" but rather supports it on a golden plate while feeding you grapes.



## Use a compiler









outright supports it by letting you do it:

* In response to framework events, thereby staying deterministic.
* Without touching elements directly, thanks to wrappers.
* Without having to fetch elements from the DOM, because the wrappers are supplied to the callback
* Without fear of spilling over, because you're working in callbacks with a single element each time, though you can do it with more if you feel it's safe.
* Without negating or interfering with the framework's own update mechanism, because that works in the same isolated, direct, granular fashion.

In fact, it's perfectly possible to manually control one aspect (like styles, text, visibility) while letting the framework control another without the code getting messy.



-------------



The quickest way to cover those is by running through 4 frameworks I have attempted to use.

## AngularJS

AngularJS was love at first sight. The syntax was beautiful and the philosophy made sense. I had used data-binding a lot while developing desktop applications, and it seemed the most logical way of developing a GUI.

It jumped in with both feet, and got productive rather quickly, but I also lost many hours and even days pulling my hair out at things like:

* The DOM being updated several times over with no way of controlling it.
* Certain mistakes in the `ng-repeat` mini-syntax not throwing warnings.
* The plethora of concepts and options for structuring reusable parts.

It was often impossible to tell what the hell was going on, and on several occasions I had no choice but to look at the source code. I was dumbfounded at how complex and convoluted it was. My own code (and I felt I had built some reasonably complex tools) looked nothing like that.

I didn't know if this was the inherent complexity of a reactive frameworks, if angular had simply gone overboard with complexity, or if that's just how things were done in JavaScript.

What I did know was that I probably wouldn't invest the days needed to understand it enough to be able to use that knowledge to help solve issues in my day to day dev life. And that meant it was essentially a black box.

Despite all that, I persevered and built several commercial apps with it, including one for the [WHO](https://www.who.int/). 

But it eventually dawned on my how absurd it was that the whole world had accepted the AngularJS contract, which is essentially:

> If you want the sleek syntax and magic updates, you have to accept that you will never understand, or have any control over what we do with the DOM. We may well update it several times more than is necessary. You will sometimes won't have a clue what's going on, which will take days off your schedule - but that's a fair price for `ng-repeat`.

And of course, you need to go through a rather steep learning curve before you find this out.

Lessons:

* No mini syntax
* No black boxes
* No magic data binding

## Ionic

Ionic is not a JavaScript framework.



My love story with AngularJS came to an end when they announced it was being replaced with Angular which was supposed to be pretty different, and I had no desire to learn something that complex all over again.

The second nail in the coffin was my shift in focus towards mobile apps. I had designed an app using Angular, Ionic and PouchDb.

, and the realisation that 90% of your page (or hybrid app) loading time is down to the kilobytes of the JavaScript.



was built on the back of a totally different framework (called Pillbug, which never saw light of day) and 





JSX bad

Templates bad

Magic bad
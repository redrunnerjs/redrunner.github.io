This page is just to generate code screeshots for the home page.
Best zoom in to get high res.

Screenshot from border radius edge to get a full black square. Rounded borders will be applied on the page.

<style>
  pre code.hljs {
    padding: 15px;
    width: 350px;
  }
</style>

```js
import {Component, mount} from 'redrunner'

const increment = (props, comp) => {
  props.count += 1
  comp.update()
}

const Counter = Component(html`
  <div ? >
    <button :onClick="increment(p, c)">+</button> 
    <span>Clicked {..count} times</span>
  </div>
`)

mount('click-div', Counter, {count: 0})
```



```js
const Counter = Component(html`
  <div css.counter.div >
    <button :onClick="increment(c, p)">+</button>
    <span :="..count|updateSpan(n, w)"></span>
  </div>
`

const updateSpan(newVal, wrapper) {
  wrapper.text(`Clicked ${newVal} times`)
    .css(newVal > 3 ? 'danger', 'normal')
    .visible(newVal < 5)
}
```


Old stuff

```js
import {Component} from 'redrunner'

const Row = Component(html`
  <tr>
    <tr>{..userName}</tr>
    <tr>{..country}</tr>
    <tr :el="status">{..status}</tr>
  </tr>
`)

const Table = Component(html`
  <table :use="Row" :items="users"></table>
`)

const updateStatus = (c, p) => c.el.status.text(p.status)
```


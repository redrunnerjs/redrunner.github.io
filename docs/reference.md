# Reference

## Installation

RedRunner isn't a library you can just load into a page with a `<script>` tag. It compiles code using a special Babel plugin, so you need a tool such as [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org/guide/en/) or [parcel](https://parceljs.org/).

The easiest way to get started is simply to clone the demo project and figure your way from there:

```bash
git clone git@github.com:redrunnerjs/demo.git
```

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

## Mounting

## Components

## Wrappers

## Inline directives

## Attribute directives

## Nesting

## Inheritance

## Stubs




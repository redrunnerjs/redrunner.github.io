# Installation

RedRunner is not a library you can simply load onto a page with a `<script>` tag. Instead you produce a bundle using a tool such as [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org/guide/en/) or [parcel](https://parceljs.org/) and load that in your page.

You can use any bundler you like so long as it handles babel. Simply configure it to load redrunner's babel plugin, which you must install alongside redrunner:

```
npm i -D redrunner babel-plugin-redrunner
```

> You must ensure minor versions match.

Here are some starter files for:

* webpack
* rollup
* parcel

Or configure your **babel.config.json**, or your tool's config file to look like this:

```json
{
  "plugins": [
      "babel-plugin-redrunner",
      "@babel/plugin-proposal-class-properties" // if using RedRunner class syntax
  ]
}
```

> Note, the order is important.


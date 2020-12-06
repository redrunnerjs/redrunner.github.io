# RedRunner Website

This repository contains the files for the RedRunner Website hosted at https://redrunner.js.org

### Tooling

The website is implemented as a [GitHub Pages](https://pages.github.com/) repository, kindly hosted by the https://js.org project.

We use [mkdocs](https://www.mkdocs.org/) as the static site builder.

### Installation

Create a Python (3.5 or above) virtual environment, and install [mkdocs](https://www.mkdocs.org/):

```
pip install mkdocs
```

### Running locally

Run a local server with:

```sh
mkdocs serve
```

### Building

The following command will build the site on the branch `gh-pages` and push to gitgub.

```
mkdocs gh-deploy
```

Leave that branch alone, and read the [docs](https://www.mkdocs.org/user-guide/deploying-your-docs/).

### Fixing broken links

```sh
# Install broken-link checker
npm install -g broken-link-checker

# Run broken-link checker while mkdocs is running
blc -egorv http://localhost:8000
```

### Contributions

Just raise a PR. 

### Licence

MIT


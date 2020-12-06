# RedRunner Website

This is repository contains the RedRunner Website hosted at https://redrunner.js.org

### About

The website is implemented as a [GitHyb Pages](https://pages.github.com/) repository, built on [mkdocs](https://www.mkdocs.org/) and kindly hosted by the https://js.org project.

### Running the site locally

Create a virtualenv, install [mkdocs](https://www.mkdocs.org/) and run with:

```sh
mkdocs serve
```

### Fixing broken links

```sh
# Install broken-link checker
npm install -g broken-link-checker

# Run broken-link checker while mkdocs is running
blc -egorv http://localhost:8000
```

### Contributions

Just raise a PR. 
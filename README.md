<p align="center">
  <img src="img/logo.png" alt="lirouter">
</p>

# About <a href="https://www.ecma-international.org/publications/standards/Ecma-006.htm"><img align="right" src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript" alt="JavaScript ES6" /></a>

_Lirouter_ is a lightweight JavaScript routing library used for building static Single Page Applications (SPA).

This library has no dependencies and was made to be light and fast.

# Getting started

This is a guide on how to get started with _lirouter_. For the documentation, see below _Documentation_.

## index.html

First, create an HTML file and import the _lirouter_ script.

>Make sure it is imported with `type="module`.

```html
<script type="module" src="/scripts/lirouter.js"></script>
```

Next, create a script (usually called _routes.js_) and import it after _lirouter.js_.

>Make sure it is also imported with `type="module`.

```html
<script type="module" src="/scripts/lirouter.js"></script>
<script type="module" src="/scripts/routes.js"></script>
```

Now, add some buttons with unique IDs.

```html
<button id="home">Home</button>
<button id="about">About</button>
<button id="contact">Contact</button>
```

Finally, add a container.

```html
<div id="contentDiv"></div>
```

The file should look like this:

```html
<html>
  <head>
    <title>Getting started</title>
  </head>
  <body>
    <button id="home">Home</button>
    <button id="about">About</button>
    <button id="contact">Contact</button>

    <div id="contentDiv"></div>
  </body>
  <script type="module" src="scripts/lirouter.js"></script>
  <script type="module" src="scripts/routes.js"></script>
</html>
```

## routes.js

Import `route`, `render` and `navigate` from _lirouter.js_.

```js
import { route, render, navigate } from "./lirouter.js";
```

Add routes to your liking. Let's stick with just a few for now.

```js
route("/", params => {
  document.getElementById("contentDiv").innerHTML = "<h1>This is the root path.</h1>";
});
route("/about", params => {
  document.getElementById("contentDiv").innerHTML = "<h1>about</h1>";
});
route("/contact", params => {
  document.getElementById("contentDiv").innerHTML = "<h1>contact</h1>";
});
route("*", params => {
  document.getElementById("contentDiv").innerHTML = "<h1>There is no route for this. 404</h1>";
});
```

Now, render the page when the document first loads.

```js
render();
```

Finally, add events to the buttons that you previously created.

```js
document.getElementById("home").addEventListener("click", () => navigate("/"));
document.getElementById("about").addEventListener("click", () => navigate("/about"));
document.getElementById("contact").addEventListener("click", () => navigate("/contact"));
```

The file should look like this:

```js
import { route, render, navigate } from "./lirouter.js";

route("/", params => {
  document.getElementById("contentDiv").innerHTML = "<h1>This is the root path.</h1>";
});
route("/about", params => {
  document.getElementById("contentDiv").innerHTML = "<h1>about</h1>";
});
route("/contact", params => {
  document.getElementById("contentDiv").innerHTML = "<h1>contact</h1>";
});
route("*", params => {
  document.getElementById("contentDiv").innerHTML = "<h1>There is no route for this. 404</h1>";
});

render();

document.getElementById("home").addEventListener("click", () => navigate("/"));
document.getElementById("about").addEventListener("click", () => navigate("/about"));
document.getElementById("contact").addEventListener("click", () => navigate("/contact"));
```

## Local development

You'll need something like [live-server](https://www.npmjs.com/package/live-server).

Make sure you have [Node.js](https://nodejs.org/en/) installed. Then, install [live-server](https://www.npmjs.com/package/live-server).

```
npm install -g live-server
```

Next, go to the folder that contains your project, and open the server.

```
live-server --port=3000 --entry-file="index.html"
```

You can choose any port, such as `3000`.

>The `--entry-file` argument is important, as it tells the server to replace all missing files with `index.html`.

The local server should work now.

# Documentation

Lirouter contains 4 important functions:

* *route*: adds a new route
* *render*: renders the page by using the current path
* *navigate*: navigates to another path
* *option*: changes an option

>You must manually call the `render` function, once, after adding all the routes.
>If you don't, the page won't render when it's first loaded.
>
>After that, the `navigate` function renders the page automatically.

## Routes

To add a route, use the `route` method.

>All routes, except for the "*" wildcard, must start with `/`.

```js
route("/route/goes/here", (params) => {
  // params - the route parameters (see below the /:param wildcard).
});
```

### Wildcards

Lirouter supports routes with the following wildcards:

* \* - any route (this should be added last)
* /\* - anything
* /\*text - anything ending with _text_
* /text\* - anything starting with _text_
* /:param - anything, stores the subroute as a parameter (see below _Examples_)

### Examples

```
* will match anything
```

```
/* will match:
- /12345
- /hello
- /foo

but not:
- /
- /1234/5678
- /hello/world
- /foo/bar
```

```
/path/* will match:
- /path/1234
- /path/foo
- /path/hello

but not:
- /path
- /path/1234/5678
- /path/foo/bar
- /path/hello/world
```

```
/path/*/something will match:
- /path/12345/something
- /path/foo/something
- /path/hello/something

but not:
-/path/12345
-/path/foo/something/bar
```

```
/path/*st/t* will match:
- /path/best/thing
- /path/fast/test

but not:
- /path/best/foo
- /path/bar/test
```

```
/path/:param1/foo/:param2 will match:
- /path/hello/foo/world (sets the params object to { param1: "hello", param2: "world" })
- /path/foo/foo/bar (sets the params object to { param1: "foo", param2: "bar" })

but not:
- /path/hello/bar/world
- /p/foo/foo/bar
```

## Navigation

You can navigate through your page with the `navigate` function.

>Always use the `navigate` function instead of `href` when navigating through your page.
>
>If you navigate to the current path (_eg. from /about to /about_), the page will not re-render. If you want to override this behavior, use the `forceRedraw` option (see below).

```js
navigate("/path/to/navigate");
```

You can also navigate to a relative path.

>Notice that the first character of the path is not `/`.

```js
navigate("path/to/navigate");
```

By default, `navigate` function will also update the URL. If you don't want the URL to change, you can `false` for the `updateUrl` parameter (by default, it's `true`).

```js
navigate("/path/to/navigate", false)
```

## Options

You can set options by using the `option` function (don't forget to import it).

```js
import { route, render, navigate, option } from "./lirouter.js";

option('key', 'value');
```

Currently, there is only one option:

* **forceRedraw**: whether or not to re-render the page even if the `navigate` function is called on the same path as the current one (*default:* `false`)

Here's an example:

```js
option('forceRedraw', true);
```

# Releases

> Note: versions with the suffix **R** are considered stable releases, while those with the suffix **D** are considered unstable.

[v2.2R](https://github.com/exom-dev/lirouter/releases/tag/v2.2R) - December 23, 2020

[v2.1R](https://github.com/exom-dev/lirouter/releases/tag/v2.1R) - July 02, 2019

[v2.0R](https://github.com/exom-dev/lirouter/releases/tag/v2.0R) - June 20, 2019

[v1.0R](https://github.com/exom-dev/lirouter/releases/tag/v1.0R) - June 20, 2019

# License <a href="https://github.com/exom-dev/lirouter/blob/master/LICENSE"><img align="right" src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>

Lirouter was created by [The Exom Developers](https://github.com/exom-dev). It is licensed under the [MIT](https://github.com/exom-dev/lirouter/blob/master/LICENSE) license.
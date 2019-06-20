<p align="center">
  <img src="img/logo.png" alt="lirouter">
</p>

# About

_Lirouter_ is a lightweight JavaScript routing library used for building static Single Page Applications (SPA).

The library has no dependencies.

# License

Lirouter was created by [UnexomWid](http://unexomwid.me). It is licensed under the [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html) license.

# Releases

> Note: versions with the suffix **R** are considered stable releases, while those with the suffix **D** are considered unstable.

None.

# Getting started

This is a guide on how to get started with _lirouter_. For proper documentation, see below _Documentation_.

## index.html

First, create an HTML file and import the _lirouter_ script. Make sure it is imported with `type="module`.

```html
<script type="module" src="scripts/lirouter.js"></script>
```

Next, create a script (usually called _routes.js_) and import it after _lirouter.js_. Make sure it is also imported with `type="module`.

```html
<script type="module" src="scripts/lirouter.js"></script>
<script type="module" src="scripts/routes.js"></script>
```

Now, add some buttons with unique IDs.

```html
<button id="home">Home</button>
<button id="about">About</button>
<button id="contact">Contact</button>
```

Finally, add a container which will change its content based on the route.

```html
<div id="contentDiv"></div>
```

The file should look like this:

```html
<html>
  <head>
    <script type="module" src="scripts/lirouter.js"></script>
    <script type="module" src="scripts/routes.js"></script>
  </head>
  <body>
    <button id="home">Home</button>
    <button id="about">About</button>
    <button id="contact">Contact</button>

    <div id="contentDiv"></div>
  </body>
</html>
```

## routes.js

Import `Section` and `addNavigator` from _lirouter.js_.

```js
import { Section, addNavigator } from "./lirouter.js";
```

Create a new section.

A section is an element that changes its contents based on the route.

```js
let content = new Section("contentDiv");
```

Now, add routes to your liking. Let's stick with just a few for now.

```js
content.route("/", container => {
  container.innerHTML = "<h1>This is the root path.</h1>";
});
content.route("/about", container => {
  container.innerHTML = "<h1>hello</h1>";
});
content.route("/contact", container => {
  container.innerHTML = "<h1>world</h1>";
});
content.route("*", container => {
  container.innerHTML = "<h1>There is no route for this. 404</h1>";
});
```

After adding the routes, activate the section;

```js
content.activate();
```

Finally, add events to the buttons that you previously created.

```js
addNavigator("home", "/");
addNavigator("about", "/about");
addNavigator("contact", "/contact");
```

The file should look like this:

```js
import { Section, addNavigator } from "./lirouter.js";

let content = new Section("contentDiv");

content.route("/", container => {
  container.innerHTML = "<h1>This is the root path.</h1>";
});
content.route("/about", container => {
  container.innerHTML = "<h1>hello</h1>";
});
content.route("/contact", container => {
  container.innerHTML = "<h1>world</h1>";
});
content.route("*", container => {
  container.innerHTML = "<h1>There is no route for this. 404</h1>";
});

content.activate();

addNavigator("home", "/");
addNavigator("about", "/about");
addNavigator("contact", "/contact");
```

## Setting up the server

In order for your SPA to work as expected, your server should replace all missing files with `index.html`.

In other words, every request should be routed to `index.html`.

### Local development

If you want to develop an application locally, you'll need something like [live-server](https://www.npmjs.com/package/live-server).

Make sure you have [Node.js](https://nodejs.org/en/) installed. Then, install [live-server](https://www.npmjs.com/package/live-server).

```
npm install -g live-server
```

Next, go to the folder that contains your project, and open the server.

```
live-server --port=3000 --entry-file="index.html"
```

You can choose any port, but I'll stick with `3000`.

The `--entry-file` argument is important, as it tells the server to replace all missing files with `index.html`.

The local server should work now.

### Hosting

If you want to host your SPA, you should choose a hosting service that supports SPAs, or supports replacing all missing files with a single file.

I recommend GitHub Pages. Though it doesn't officially support SPAs, you can still make it work with them.

[Here](https://github.com/rafrex/spa-github-pages) is a guide for SPA GitHub Pages.

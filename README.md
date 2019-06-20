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

First, create an HTML file and import the _lirouter_ script.

>Make sure it is imported with `type="module`.

```html
<script type="module" src="scripts/lirouter.js"></script>
```

Next, create a script (usually called _routes.js_) and import it after _lirouter.js_.

>Make sure it is also imported with `type="module`.

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

>A section is an element that changes its contents based on the route.

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

>In other words, every request should be routed to `index.html`.

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

>The `--entry-file` argument is important, as it tells the server to replace all missing files with `index.html`.

The local server should work now.

### Hosting

If you want to host your SPA, you should choose a hosting service that supports SPAs.

I recommend GitHub Pages. Though it doesn't officially support SPAs, you can still make it work with them.

>[Here](https://github.com/rafrex/spa-github-pages) is a guide for SPA GitHub Pages.

# Documentation

Lirouter is made up of 3 things: sections, routes and navigators.

## Sections

A section is an HTML element that changes its content based on the route. You can have multiple sections at the same time.

To initialize a new section, use the constructor of the class.

```js
let section = new Section("element_id");
```

A section can have a `root`. Say, for example, you create a section that has the following routes:

* /work/project/web
* /work/projects/desktop
* /work/projects/mobile

You can set the `root` of the Section to `/work/projects`, and the routes to:

* /web
* /desktop
* /mobile

To set the `root` of a section, use the second argument of the constructor.

> Make sure the root does not end with `/`

```js
let section = new Section("element_id", "/root/goes/here");
```

## Routes

To add a route to a section, use the `route` method.

```js
section.route("route/goes/here", (container, params) => {
  // container - the HTML element of this section.
  // params - the route parameters.
});
```

### Wildcards

Lirouter supports routes with the following wildcards:

* \* - any route (this should be added last)
* /\* - anything
* /\*text - anything ending with _text_
* /text\* - anything starting with _text_
* /:param - anything, stores the subroute as a parameter (see below _Route Wildcard Examples_)

#### Examples

```
* will match anything
```

```
/* will match:
- /12345
- /hello
- /foo

/* will not match:
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

/path/* will not match:
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

/path/*/something will not match:
-/path/12345
-/path/foo/something/bar
```

```
/path/*st/t* will match:
- /path/best/thing
- /path/fast/test

/path/*st/t* will not match:
- /path/best/foo
- /path/bar/test
```

```
/path/:param1/foo/:param2 will match:
- /path/hello/foo/world (sets the params object to { param1: hello, param2: world })
- /path/foo/foo/bar (sets the params object to { param1: foo, param2: bar })

/path/:param1/foo/:param2 will not match:
- /path/hello/bar/world
- /p/foo/foo/bar
```

## Section Activation

In order for a section to work as expected, you need to activate it.

Only active sections will change their contents based on the route.

>Always activate a section only after adding the routes.

```js
section.activate();
```

You can also deactivate a section.

>You can re-activate it later by using activate().

```js
section.deactivate();
```

## Navigators

A navigator is an HTML element that can trigger the `navigate` function.

>In other words, a navigator changes the path and causes active sections to re-render.
>Always use navigators and the `navigate` function instead of `href`.

```js
addNavigator("element_id", "/path/to/navigate/on/click");
```

A navigator can also append to the path.

>Notice that the first character of the path is not `/`.

```js
addNavigator("element_id", "path/to/nagivate/on/click");
```



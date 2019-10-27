/**
 * lirouter (https://github.com/UnexomWid/timerh)
 *
 * This project is licensed under the MIT license.
 * Copyright (c) 2019 UnexomWid (https://uw.exom.dev)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Contains the last path that was rendered.
 */
let lastPath = "";

/**
 * Contains the routes.
 */
let routes = [];

/**
  * Defines a new route.
  * 
  * @param {string} path The path of the route.
  * @param {function} render The render method of the route.
  */
function route(path, render) {
  routes.push({ path: path.length > 1 && (path.endsWith("/") || path.endsWith("\\")) ? path.substring(0, path.length - 1) : path, render: render });
}

/**
 * Renders the page at the current path.
 */
function render() {
  if(window.location.pathname.length > 1 && (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("\\")))
    history.replaceState({}, "", window.location.pathname.substring(0,window.location.pathname.length-1));
  if(lastPath !== window.location.pathname) {
    lastPath = window.location.pathname;

    for (let u = 0; u < routes.length; ++u) {
      let route_match = match(window.location.pathname, routes[u].path);

      if (route_match === undefined)
        continue;

      routes[u].render(route_match.params);
      return;
    }
  }
}

/**
 * Navigates to a path.
 * 
 * @param {string} path The path to navigate to.
 */
function navigate(path) {
  if(path.length > 1 && (path.endsWith("/") || path.endsWith("\\")))
    path = path.substring(0, path.length - 1);
    
  window.history.pushState(
      {},
      "",
      path
  );

  render();
}

/**
 * Checks whether or not a path matches a route.
 * 
 * @param {string} path The path to check.
 * @param {string} route The route to check against.
 * 
 * @return {object} An object with a 'params' property, if the path matches the route. Otherwise, undefined.
 */
function match(path, route) {
  let data = { params: {} };

  // Equal, or the route is a wildcard.
  if (path == route || route == "*")
    return data;

  let subpaths = path.split("/");
  let subroutes = route.split("/");

  if (subpaths.length != subroutes.length)
    return undefined;

  for (let u = 0; u < subpaths.length; ++u) {
    // Empty or equal.
    if (
      (subpaths[u].length === 0 && subroutes[u] === 0) ||
      (subpaths[u] == subroutes[u])
    )
      continue;

    // Parameter.
    if (subroutes[u].startsWith(":")) {
      data.params[subroutes[u].substring(1)] = subpaths[u];
      continue;
    }

    // Wildcard.
    if (subroutes[u].startsWith("*")) {
      // Simple wildcard.
      if (subroutes[u].length == 1) continue;

      // Start wildcard.
      if (subpaths[u].endsWith(subroutes[u].substring(1))) continue;
      return undefined;
    }

    // End wildcard.
    if (subroutes[u].endsWith("*")) {
      if (
        subpaths[u].startsWith(
          subroutes[u].substring(0, subroutes[u].length - 1)
        )
      )
        continue;
      return undefined;
    }

    // No match.
    return undefined;
  }

  return data;
}

// Re-renders the page when the back() event is fired.
window.onpopstate = render;

// Exports the necessary stuff.
export { route, render, navigate };
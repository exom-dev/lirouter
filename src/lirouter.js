/*
 * lirouter - A lightweight JavaScript routing library, used for building static Single Page Applications (SPA).
 * Copyright (C) 2019  UnexomWid

 * lirouter.js - Contains the code of the library.

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
      (path.startsWith("/")
      ? window.location.origin + path
      : window.location.href + (window.location.href.endsWith("/") ? "" : "/") + path)
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
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
 * Contains all the active sections.
 */
let sections = [];

/**
 * Contains the last path that was rendered.
 */
let lastPath = "";

/**
 * Represents a section.
 */
class Section {
  /** 
   * Initializes a new instance of the Section class.
   */
  constructor(containerId, root) {
    this.containerId = containerId;
    this.root = root !== undefined ? root : "";
    this.routes = [];
  }

  /**
   * Defines a new route for this section.
   * 
   * @param {string} path The path of the route.
   * @param {function} render The render method of the route.
   */
  route(path, render) {
    this.routes.push({ path: path, render: render });
  }

  /**
   * Activates this section if it isn't already active.
   */
  activate() {
    if (sections.indexOf(this) === -1)
        sections.push(this);

    this.render(window.location.pathname);
  }

  /**
   * Deactivates this section if it is active.
   */
  deactivate() {
    let index = sections.indexOf(this);
    if (index > -1)
        sections.slice(index, 1);
  }

  /**
   * Renders the section. All routes will be checked, in order, until one matches.
   * 
   * @param {string} path The path to render.
   */
  render(path) {
    for (let u = 0; u < this.routes.length; ++u) {
      let route_match = match(path, this.root + this.routes[u].path);

      if (route_match === undefined)
        continue;

      this.routes[u].render(
        document.getElementById(this.containerId),
        route_match.params
      );
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
    window.history.pushState(
        {},
        "",
        (path.startsWith("/")
        ? window.location.origin + path
        : window.location.href + (window.location.href.endsWith("/") ? "" : "/") + path)
    );

    renderSections();
}

/**
 * Renders all active sections.
 * 
 * Every active section's 'render' method will be called.
 */
function renderSections() {
  if(lastPath !== window.location.pathname) {
    for (let u = 0; u < sections.length; ++u)
        sections[u].render(window.location.pathname);
    lastPath = window.location.pathname;
  }
}

/**
 * Adds an onClick event to an element for navigation purposes.
 * 
 * @param {string} id The ID of the element to add the event to.
 * @param {string} route The route to navigate to when the event is fired.
 */
function addNavigator(id, route) {
  document.getElementById(id).addEventListener("click", () => navigate(route));
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

// Renders the active sections when the back() event is fired.
window.onpopstate = () => {
  renderSections();
}

// Exports the necessary stuff.
export { Section, navigate, addNavigator };
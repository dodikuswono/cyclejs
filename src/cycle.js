'use strict';
let VirtualDOM = require('virtual-dom');
let Rx = require('rx');
let Stream = require('./stream');
let PropertyHook = require('./property-hook');
let CustomElements = require('./rendering/custom-elements');
let RenderingDOM = require('./rendering/render-dom');
let RenderingHTML = require('./rendering/render-html');

var Cycle = {
  /**
   * Creates a Cycle Stream defined by `definitionFn`. A Stream is a subclass of
   * Rx.Observable and implements "Injectable", so it contains the function
   * `inject(...inputs)`. This function will synchronously return the same
   * Observable as `definitionFn` returns (think IIFE: immediately-invoked
   * function expression), but will use proxy inputs created internally. You
   * should supply the real inputs later with inject(), and the proxy inputs
   * will imitate the behavior of the real inputs.
   *
   * @param {Function} definitionFn a function taking Observables as input and
   * outputting one Rx.Observable.
   * @return {Rx.Observable} a Stream as defined by the return of
   * `definitionFn`.
   * @function createStream
   */
  createStream: function createStream(definitionFn) {
    return Stream.createStream(definitionFn);
  },

  /**
   * Renders an Observable of virtual DOM elements (`vtree$`) into the DOM
   * element indicated by `container`, which can be either a CSS selector or an
   * actual element. Returns an Observable of real DOM element, with a special
   * property attached to it called `interaction$`. This `interaction$` is a
   * theoretical Observable containing all possible events happening on all
   * elements which were rendered. You must query it with
   * `interaction$.choose(selector, eventName)` in order to get an Observable of
   * interactions of type `eventName` happening on the element identified by
   * `selector`.
   * Example: `interaction$.choose('.mybutton', 'click').subscribe( ... )`
   *
   * @param {Rx.Observable} vtree$ Observable of virtual DOM elements.
   * @param {(String|HTMLElement)} container the DOM selector for the element
   * (or the element itself) to contain the rendering of the VTrees.
   * @return {Rx.Observable} an Observable emitting the root DOM element for
   * this rendering, with the property `interaction$` attached to it.
   * @function render
   */
  render: RenderingDOM.render,

  /**
   * Converts a given Observable of virtual DOM elements (`vtree$`) into an
   * Observable of corresponding HTML strings (`html$`). The provided `vtree$`
   * must complete (must call onCompleted on its observers) in finite time,
   * otherwise the output `html$` will never emit an HTML string.
   *
   * @param {Rx.Observable} vtree$ Observable of virtual DOM elements.
   * @return {Rx.Observable} an Observable emitting a string as the HTML
   * renderization of the virtual DOM element.
   * @function renderAsHTML
   */
  renderAsHTML: RenderingHTML.renderAsHTML,

  /**
   * Informs Cycle to recognize the given `tagName` as a custom element
   * implemented as `dataFlowNode` whenever `tagName` is used in VTrees in a
   * View rendered to a DOMUser.
   * The given `dataFlowNode` must export a `vtree$` Observable. If the
   * `dataFlowNode` expects Observable `foo$` as input, then the custom
   * element's attribute named `foo` will be injected automatically into `foo$`.
   *
   * @param {String} tagName a name for identifying the custom element.
   * @param {Function} definitionFn the implementation for the custom element.
   * This function takes two arguments: `User`, and `Properties`. Use `User` to
   * inject into an Intent and to be injected a View. `Properties` is a
   * DataFlowNode containing observables matching the custom element properties.
   * @function registerCustomElement
   */
  registerCustomElement: CustomElements.registerCustomElement,

  /**
   * Returns a hook for manipulating an element from the real DOM. This is a
   * helper for creating VTrees in Views. Useful for calling `focus()` on the
   * DOM element, or doing similar mutations.
   *
   * See https://github.com/Raynos/mercury/blob/master/docs/faq.md for more
   * details.
   *
   * @param {Function} fn a function with two arguments: `element`, `property`.
   * @return {PropertyHook} a hook
   */
  vdomPropHook: function vdomPropHook(fn) {
    return new PropertyHook(fn);
  },

  /**
   * A shortcut to the root object of
   * [RxJS](https://github.com/Reactive-Extensions/RxJS).
   * @name Rx
   */
  Rx: Rx,

  /**
   * A shortcut to [virtual-hyperscript](
   * https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript).
   * This is a helper for creating VTrees in Views.
   * @name h
   */
  h: VirtualDOM.h
};

module.exports = Cycle;

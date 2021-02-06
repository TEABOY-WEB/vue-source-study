import { createElement, createTextElement } from "./vdom/index";

export function renderMixin(Vue) {
  Vue.prototype._c = function (tag, data, ...children) {
    return createElement(this, ...arguments);
  };
  Vue.prototype._v = function (text) {
    return createTextElement(this, text);
  };
  Vue.prototype._s = function (value) {
    return JSON.stringify(value);
  };
  Vue.prototype._render = function () {
    const vm = this;
    let render = vm.$options.render;
    let vnode = render.call(vm);
    return vnode;
  }
}
export function isFunction(val) {
  return typeof val === 'function';
}
export function isObject(val) {
  let str = Object.prototype.toString.call(val).replace(/\[object\s|\]/g, '');
  return val !== null && str === 'Object';
}
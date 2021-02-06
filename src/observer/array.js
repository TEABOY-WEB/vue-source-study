let originArrayMethods = Array.prototype;
export let arrayMethods = Object.create(Array.prototype);// 继承数组原型上的方法；

let methods = ['push', 'shift', 'pop', 'unshift', 'reverse', 'sort', 'splice'];

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    let inserted;
    let ob = this.__ob__;// 根据当前数组获取当前实例
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) {
      ob.observerArray(inserted);
    }
    originArrayMethods[method].call(this, ...args);
  }
})
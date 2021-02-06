import { isObject } from "../utils";
import { arrayMethods } from "./array";

class Observer {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    // data.__ob__ = this;// 所有被劫持过的属性都有__ob__这个属性；直接这样的话会死循环；
    if (Array.isArray(data)) { //数组劫持的逻辑；
      // 对数组原来的方法进行改写，切片编程 告诫函数
      data.__proto__ = arrayMethods;
      this.observerArray(data);
    } else {
      this.work(data); //在这里对data中的所有数据进行劫持；
    }
  }
  observerArray(data) { // 对数组中的数组和数组中的对象中的数据执行劫持；
    data.forEach(item => {
      observer(item);
    })
  }
  work(data) {
    Object.keys(data).forEach(key => {
      // 下面的方法是将data中的所有属性的数据进行劫持；
      defineReactive(data, key, data[key]);
    })
  }
}
// vue2会对所有对象进行遍历，将每个属性使用defineProperty重新定义， 所以性能差；
function defineReactive(data, key, value) {
  observer(value);//如果data中有的数据是对象，就继续递归劫持数据；
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newVal) {
      // 如果给属性赋值的是对象的话，我们也需要劫持其中的数据；
      observer(newVal);
      value = newVal;
    }
  })
}
export function observer(data) {
  //如果是对象才观测
  if (!isObject(data)) {
    return;
  };
  if (data.__ob__) {
    return
  };
  //默认最外层的data必须是一个对象； 
  return new Observer(data);
}
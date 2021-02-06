import { observer } from "./observer/index";
import { isFunction } from "./utils";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
  // if (opts.computed) {
  //   initComputed();
  // }
  // if (opts.watch) {
  //   initWatch();
  // }
}
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    }
  })
}
function initData(vm) {
  let data = vm.$options.data;
  //vue2中会将data中的所有数据进行劫持；
  //使用_data进行关联
  data = vm._data = isFunction(data) ? data.call(vm) : data;
  //这里需要代理
  for (let key in data) {
    proxy(vm, '_data', key)//将所有数据进行代理，vm.name = vm._data.name;
  }
  observer(data);
}
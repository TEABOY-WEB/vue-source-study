import { initMixin } from "./init";

function Vue(options) {
  this._init(options);//初始化操作
}
initMixin(Vue);// 这个函数执行在原型上绑定一个函数

export default Vue;
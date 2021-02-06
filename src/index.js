import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";

function Vue(options) {
  this._init(options);//初始化操作
}
initMixin(Vue);// 这个函数执行在原型上绑定一个函数
renderMixin(Vue); //_render
lifecycleMixin(Vue);//_update

export default Vue;
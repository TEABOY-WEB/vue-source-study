import { compileToFunction } from "./compiler/index";
import { mountComponent } from "./lifecycle";
import { initState } from "./State";


export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;//后面对参数进行扩展
    //对数据进行初始化；
    initState(vm);
    //如果存在el属性，我们需要将数据挂载到模版上
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    //把模版装换成对应的渲染函数 ==> 虚拟dom概念 vnode ==> diff算法  更新虚拟节点;
    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;//这里拿到模版；
        let render = compileToFunction(template);
        options.render = render;
      }
    }
    // options.render就是渲染函数；
    // console.log(options.render);// 调用render方法  渲染成真实dom  替换掉页面中的内容
    //组件的挂载流程
    mountComponent(vm, el);//将我们的实例挂载到我们的#app上
  }
}
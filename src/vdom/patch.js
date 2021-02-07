export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType == 1) {
    //用vnode来生成真实dom，替换原本的dom元素
    const parentElement = oldVnode.parentNode
    let element = createElement(vnode)
    parentElement.insertBefore(element, oldVnode.nextSibling)
    parentElement.removeChild(oldVnode)
  }
}
function createElement(vnode) {
  let { tag, data, text, children, vm } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    children.forEach((child) => {
      vnode.el.appendChild(createElement(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

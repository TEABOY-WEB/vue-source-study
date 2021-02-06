const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function getProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let styleObj = {};
      attr.value.replace(/([^:;]+)\:([^:;]+)/g, function () {
        styleObj[arguments[1]] = arguments[2];
      })
      attr.value = styleObj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`;
}
function gen(childElement) {
  if (childElement.type === 1) {
    return generator(childElement);
  } else {
    let text = childElement.text;
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`;
    } else {
      let tokens = [];
      let lastIndex = defaultTagRE.lastIndex = 0;//由于正则的全局匹配和exec有冲突，所以治理我们徐亚重置一下
      let match;
      while (match = defaultTagRE.exec(text)) {
        let index = match.index;//开始的索引，匹配到位置时的索引
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);//这里是匹配到符合正则的内容
        lastIndex = index + match[0].length;//这里是获取偏移量
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${tokens.join('+')})`
    }
  }
}
function genChildren(el) {
  let children = el.children;
  if (children) {
    return children.map(c => gen(c)).join(',');
  }
  return false;
}
export function generator(el) {
  // 遍历树 将树拼成字符串；
  // el.attrs，就是我们生成的match数组；
  let children = genChildren(el);
  let code = `_c('${el.tag}',${el.attrs.length > 0 ? getProps(el.attrs) : 'undefined'
    }${children ? `,${children}` : ''})`;
  return code;
}
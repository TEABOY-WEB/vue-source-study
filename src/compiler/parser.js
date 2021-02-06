const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;//标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //用来获取标签名，match后索引为1
const startTagOpen = new RegExp(`^<${qnameCapture}`);//匹配开始标签
// const endTag = new RegExp((`^<\\${qnameCapture}[^>]*>`));//匹配闭合标签
const endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;//匹配属性
const startTagClose = /^\s*(\/?)>/;//标签结束
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 我们需要将解析之后的结果，组装成一个树结构 栈
function createAstElement(tagName, attrs) {
  return {
    tag: tagName,
    type: 1,
    children: [],
    parent: null,
    attrs
  }
}
let root = null;
let stack = [];
function start(tagName, attribute) {
  let parent = stack[stack.length - 1];//开始的时候parent不存在
  let element = createAstElement(tagName, attribute);
  if (!root) {
    root = element
  }
  element.parent = parent;
  if (parent) {
    parent.children.push(element);
  }
  stack.push(element);//在这里我们将新进来的元素放在最后一位，我们每次取到的最后一位的元素就是我们刚刚放进去的新元素
  // 这样可以保证层级关系
}
function end(tagName) {
  let last = stack.pop();// 这里是取出上次放进去的元素的tag
  if (last.tag != tagName) {
    throw new Error('标签错误')
  }

}
function chars(text) {
  text = text.replace(/\s/g, '');
  let parent = stack[stack.length - 1];
  if (text) {
    parent.children.push({
      type: 3,
      text
    })
  }
}
export function parserHTML(html) {
  function advance(len) { //将已经匹配到的内容删除掉
    html = html.substring(len);
  }
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      };
      advance(start[0].length);
      let end;
      let attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {//这里是匹配结束标签 >
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] });
        advance(attr[0].length);
      };
      if (end) {
        advance(end[0].length);
      };
      return match;
    }
    return false;
  }
  while (html) { //匹配开始标签的逻辑和结束标签的逻辑有点不一样
    let textEnd = html.indexOf('<');//获取开始标签的索引位置；
    if (textEnd == 0) {
      const startTagMatch = parseStartTag(html);//这里获取匹配之后的内容也就是match数组；
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      };
      const endTagMatch = html.match(endTag);//这里匹配结束标签
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
      };
    }
    let text;
    if (textEnd > 0) { //这里的索引大于0，标示这里的位置是结束标签的开始符 <
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      chars(text);
    }
  }
  return root;
}
import { generator } from "./generator";
import { parserHTML } from "./parser";

// compileToFunction函数返回的是一个render
export function compileToFunction(template) {
  let root = parserHTML(template);// 这里对模版进行解析
  let code = generator(root);
  let render = new Function(`with(this){return ${code}}`);
  return render;
  //html -> ast(只能描述语法，语法不存在的属性无法描述) -> render函数 -> 虚拟dom
  //(增加额外的属性) -> 生成真实的dom
}
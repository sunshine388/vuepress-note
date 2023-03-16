---
title: （十三）包装with生成render函数
---

生成 render 函数 - 函数生成

<!-- more -->

# 包装 with 并生成 render 函数

```js
export function compileToFunction(template) {
  console.log("***** 进入 compileToFunction：将 template 编译为 render 函数 *****")
  // 1，将模板变成 AST 语法树
  let ast = parserHTML(template);
  // 2，使用 AST 生成 render 函数
  let code = generate(ast);
  let render = new Function(`with(this){return ${code}}`);
  console.log("包装 with 生成 render 函数："+ render.toString())

  return render
}
```

将生成的 render 函数保存到 options 选项：

```js
Vue.prototype.$mount = function (el) {
    const vm = this;
    const opts = vm.$options;
    el = document.querySelector(el);
    vm.$el = el;
    if (!opts.render) {
      let template = opts.template;
      if (!template) {
        template = el.outerHTML;
      }

      let render = compileToFunction(template);
      opts.render = render;	// 保存生成的 render 函数
      console.log("打印 compileToFunction 返回的 render = " + JSON.stringify(render))
    }

  	// 后续工作：
  	// 1）根据 render 函数，生成虚拟 dom...
  	// 2）虚拟 dom + 真实数据 => 生成真实 dom...
  }
```

测试 render 函数生成：

![](/images/手写vue2源码/（十三）包装with生成render函数/打印输出1.png)

# 生成 render 函数的大致流程：

从 html 模板到生成 render 函数的大致流程：

> html 模板编译称为 ast 语法树；
> ast 语法树生成并拼接 code
> 使用 with 对生成的 code 进行一次包装
> 将包装后的完整 code 字符串，通过 new Function 输出为 render 函数

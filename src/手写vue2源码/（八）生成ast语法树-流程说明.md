---
title: （八）生成ast语法树-流程说明
order: 8
---

生成 ast 语法树-流程说明

<!-- more -->

## vue 提供的方式

### 三种模板写法及优先级

```js
<body>
  <!-- 第一种 -->
  <div id=app>{{message}}</div>
  <script src="/dist/vue.js"></script>
  <script>
    debugger;
    let vm = new Vue({
      el: '#app',
      data() {
      },
      // 第二种
      template:'',
      // 第三种
      render(){}
    });
  </script>
</body>
```

三种写法的优先级【由高到低】：

> 使用 render
> 使用 template
> 使用元素中的内容

### 两种数据挂载方式

在 Vue2.x 中，提供了两种挂载方式：

```js
let vm = new Vue({
  // el: '#app',		// 挂载方式一
  data() {
  },
}).$mount('#app');	// 挂载方式 2
```

当挂载点 vm.$options.el 存在，或直接调用了 Vue 的原型方法 $mount 时，
就会通过 Vue 上的原型方法 $mount 对数据进行挂载操作

## Vue 的原型方法 $mount

在 $mount 中，拿到 el 挂载点指向的真实 dom 元素，并使用新内容将它替换掉

```js
// src/init.js#initMixin

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    initState(vm);

    if (vm.$options.el) {
      // 将数据挂载到页面上（此时数据已被观测）
      vm.$mount(vm.$options.el)
    }
  }

  // 支持 new Vue({el}) 和 new Vue().$mount 两种情况
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const opts = vm.$options;
    el = document.querySelector(el);
    vm.$el = el;
    // 默认会查找有没有render，没有就template，没有template就采用el中的内容
    if (!opts.render) {
      let template = opts.template;
      if (!template && el) {
        template = el.outerHTML;
      }
    }
  }
}
```

## 将模板编译为 ast 语法树

### compileToFunction

在 vue 中，编译阶段的最终结果是输出 render 函数：

> parserHTML：将模板内容编译为 ast 语法树
> generate：再根据 ast 语法树生成为 render 函数；

```js
//  src/compiler/index.js

export function compileToFunction(template) {
  // 1，将模板变成 AST 语法树
  let ast = parserHTML(template);
  // 2，使用 AST 生成 render 函数
  let code = generate(ast);
}

function parserHTML(template) {
  console.log("parserHTML-template : " + template)
}

function generate(ast) {
  console.log("parserHTML-ast : " + ast)
}
```

在 Vue 中，compileToFunction 方法是 Vue 编译的入口，
完成了以上两个操作，最终将模板编译成为 render 函数；

### parserHTML

parserHTML 方法：将 HTML 模板编译成为 ast 语法树

compileToFunction(template) 方法，对 html 模板进行处理，需要传入 html 模板：

```js
<body>
  <div id=app>{{message}}</div>
  <script>
    let vm = new Vue({
      el: '#app',
      data() {
        return { message:"Hello Vue" }
      },
      template:'<div id="app">{{message}}</div>'
    });
  </script>
</body>
```

在 Vue 初始化时:
如果 options 选项中设置了 template，将优先使用 template 内容作为模板
如果 options 选项没有设置 template，将采用元素内容作为 Html 模板

代码实现

```js
Vue.prototype.$mount = function (el) {
  const vm = this;
  const opts = vm.$options;
  el = document.querySelector(el); // 获取真实的元素
  vm.$el = el; // vm.$el 表示当前页面上的真实元素

  // 如果没有 render, 看 template
  if (!opts.render) {
    // 如果没有 template, 采用元素内容
    let template = opts.template;
    console.log("template = " + template)
    if (!template && el) {
      // 将模板编译为 render 函数
      template = el.outerHTML;
    }else{
      console.log("有template = " + template)
    }
    let render = compileToFunction(template);
    opts.render = render;
  }
}
```

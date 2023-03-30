---
title: （十四）根据render函数生成虚拟节点vnode
order: 14
---

根据 render 函数，生成虚拟节点 vnode

<!-- more -->

## mountComponent

render 函数执行后，最终会生成一个虚拟节点 vnode

虚拟节点 vnode + 真实数据 => 真实节点

所以，下一个步骤就是进行组件渲染并完成挂

mountComponent 方法：将组件挂载到 vm.$el 上

创建 src/lifecycle.js

```js
// src/lifecycle.js#mountComponent

export function mountComponent(vm) {
  render(); // 调用 render 方法
}
```

引入 mountComponent 并调用：

```js
// src/init.js

import { mountComponent } from "./lifecycle"; // 引入 mountComponent

Vue.prototype.$mount = function (el) {
  const vm = this;
  const opts = vm.$options;
  el = document.querySelector(el);
  vm.$el = el; // 真实节点

  if (!opts.render) {
    let template = opts.template;
    if (!template) template = el.outerHTML;
    let render = compileToFunction(template);
    opts.render = render;
  }

  // 将当前 render 渲染到 el 元素上
  mountComponent(vm);
};
```

## 封装 vm.\_render

mountComponent 方法：主要完成组件的挂载工作

而 render 渲染只是其一，还有其他工作需要处理；

继续考虑 render 方法的复用性；需要将渲染方法 render 进行独立封装

创建 src/render.js

```js
// src/render.js#renderMixin

export function renderMixin(Vue) {
  // 在 vue 上进行方法扩展
  Vue.prototype._render = function () {
    // todo...
  };
}
```

src/index.js 入口，调用 renderMixin 做 render 方法的混合：

```js
// src/index.js

import { initMixin } from "./init";
import { renderMixin } from "./render";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
renderMixin(Vue); // 混合 render 方法

export default Vue;
```

src/lifecycle.js 中 mountComponent 调用 render 函数的方式发生改变：

```js
export function mountComponent(vm) {
  // render();
  vm._render();
}
```

当 vm.render 被调用时，内部将会调用 \_c，\_v，\_s 三个方法

所以这三个方法都是和 render 相关的，可以封装到一起；

所以，vm.\_render 方法中需要做以下几件事：

1. 调用 render 函数
2. 提供\_c，\_v，\_s 三个方法

```js
// src/render.js#renderMixin

export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    // createElement 创建元素型的节点
    console.log(arguments);
  };
  Vue.prototype._v = function () {
    // 创建文本的虚拟节点
    console.log(arguments);
  };
  Vue.prototype._s = function () {
    // JSON.stringify
    console.log(arguments);
  };
  Vue.prototype._render = function () {
    const vm = this; // vm 中有所有数据  vm.xxx => vm._data.xxx
    let { render } = vm.$options;
    let vnode = render.call(vm); // 此时内部会调用_c,_v,_s方法，执行完成返回虚拟节点
    console.log(vnode);
    return vnode; // 返回虚拟节点
  };
}
```

## 代码调试

demo 示例：

```html
<body>
  <div id="app">aaa {{name}} bbb {{age}} ccc</div>
  <script src="/dist/vue.js"></script>
  <script>
    let vm = new Vue({
      el: "#app",
      data() {
        return { name: "Brave", age: 123 };
      },
    });
  </script>
</body>
```

设置断点并进行调试：

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出1.png)

这里，mountComponent 方法入参 vm，包含了 render 函数及所有数据

继续，调用 vm.render 方法：

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出2.png)

vm.render 方法中，会调用 render 方法：

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出3.png)

当 render 方法被调用时，将执行：

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出4.png)

由于函数会从内向外执行，即执行顺序为\_s(name)，\_s(age)，\_v()，\_c()；

执行 \_s(name)：

先从 \_data 取 name 值

当进入 \_s 时，传入 name 的值

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出5.png)

取值代理

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出6.png)

数据劫持

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出7.png)

进入 \_s(name)：

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出8.png)

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出9.png)

同理，进入\_s(age)：

先从 \_data 取 age 值

当进入 \_s 时，传入 age 的值

（略）

继续，进入 \_v：

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出10.png)

由于当前的 \_s 没有返回值，所以字符串拼接结果中包含 2 个 undefined；

继续，进入 \_c：

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出11.png)

参数包含：标签名，属性，孩子

## 实现 \_s

\_s 方法：将对象转成字符串，并返回

```js
// _s 相当于 JSON.stringify
Vue.prototype._s = function (val) {
  if (isObject(val)) {
    // 是对象，转成字符串
    return JSON.stringify(val);
  } else {
    // 不是对象，直接返回
    return val;
  }
};
```

调试：

在 \_v 中设置断点，查看 \_s 处理后返回的字符串

先调用两个 \_s，并将拼接结果传递给 \_v :

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出12.png)

打印 render 函数：

```js
Vue.prototype._render = function () {
  const vm = this;
  let { render } = vm.$options;
  console.log(render.toString()); // 打印 render 函数结果
  let vnode = render.call(vm);
  return vnode;
};
```

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出13.png)

观察 render 函数：

两个 \_s 执行后，将拼接后的字符串传递给了 \_v，

\_v 接收文本 text，文本创建完成将结果传递给 \_c

所以，需要先创造文本的虚拟节点，再创造元素的虚拟节点

创建目录：src/vdom

包含两个方法：创建元素虚拟节点，创建文本虚拟节点

备注：\_v，\_c 两个方法都与虚拟节点有关，所以将两个方法放到虚拟 dom 包中

```js
// src/vdom/index.js

export function createElement() {
  // 返回元素虚拟节点
}
export function createText() {
  // 返回文本虚拟节点
}
```

renderMixin 只负责渲染逻辑，而具体如何创建 vdom，需要 vdom 考虑，所以这两部分逻辑需要拆分开

renderMixin 只返回虚拟节点，但不关心虚拟节点如何产生

## 实现 \_v 和 \_c

\_v 方法：创建并返回文本的虚拟节点

```js
Vue.prototype._c = function (...args) {
  // createElement 创建元素型的节点
  const vm = this;
  return createElement(vm, ...args); // vm作用：确定虚拟节点所属实例
};
Vue.prototype._v = function (text) {
  // 创建文本的虚拟节点
  const vm = this;
  return createText(vm, text); // vm作用：确定虚拟节点所属实例
};
```

vm 作用：确定虚拟节点所属实例

如何创建文本虚拟节点，交给 createText 来完成

createText 生成 vnode：vnode 是一个用来描述节点的对象

```js
export function createElement(vm, tag, data = {}, ...children) {
  // 返回虚拟节点
  // _c('标签', {属性}, ...儿子)
  return {
    vm, // 是谁的虚拟节点
    tag, // 标签
    children, // 儿子
    data, // 数字
    // ...    // 其他
  };
}
export function createText(vm, text) {
  // 返回虚拟节点
  return {
    vm,
    tag: undefined, // 文本没有 tag
    children,
    data,
    // ...
  };
}
```

提取 vnode 方法：通过函数返回对象

```js
// 通过函数返回vnode对象
// 后续元素需要做 diff 算法，需要 key 标识
function vnode(vm, tag, data, children, key, text) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text,
  };
}
```

重构代码：

```js
// 参数：_c('标签', {属性}, ...儿子)
export function createElement(vm, tag, data = {}, ...children) {
  // 返回元素的虚拟节点（元素是没有文本的）
  return vnode(vm, tag, data, children, data.key, undefined);
}
export function createText(vm, text) {
  // 返回文本的虚拟节点（文本没有标签、数据、儿子、key）
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

// 通过函数返回vnode对象
// 后续元素需要做 diff 算法，需要 key 标识
function vnode(vm, tag, data, children, key, text) {
  return {
    vm, // 谁的实例
    tag, // 标签
    data, // 数据
    children, // 儿子
    key, // 标识
    text, // 文本
  };
}
```

测试：

```js
aaa{{name}}bbb{{age}}ccc
```

![](/images/手写vue2源码/（十四）根据render函数生成虚拟节点vnode/打印输出14.png)

这样就完成了根据 render 函数，生成了虚拟节点 vnode

接下来，再根据虚拟节点渲染成为真实节点

当更新时，通过调用 render 生成虚拟节点，并完成真实节点的更新

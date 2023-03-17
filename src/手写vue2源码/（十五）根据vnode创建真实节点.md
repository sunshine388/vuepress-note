---
title: （十五）根据vnode创建真实节点
order: 15
---

根据 vnode 创建真实节点

<!-- more -->

## 前情回顾

mountComponent 方法：将组件挂载到 vm.$el 上
在 mountComponent 中，通过调用 vm 实例方法 vm.\_render 生成了 vnode

vm.\_render 方法：在 Vue 初始化时，通过 renderMixin 被扩展到 Vue 原型上
在 \_render 中，执行了 render 函数【render 的生成：1，拼接 code；2，with + new Function】
render 的执行过程中，将会调用\_s，\_v，\_c 方法，最终返回了 vnode

```js
// src/lifecycle.js
export function mountComponent(vm) {
  vm._render();	// 调用 render 函数，内部触发_s,_v,_c...
}

// src/render.js
export function renderMixin(Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    let { render } = vm.$options;
    let vnode = render.call(vm); // 内部会调用_c,_v,_s方法
    return vnode; // 返回虚拟节点
  }
  Vue.prototype._c = function () {/* 创建元素虚拟节点 */}
  Vue.prototype._v = function () {/* 创建文本虚拟节点 */}
  Vue.prototype._s = function () {/* JSON.stringify */}
}
```

vm.\_render 执行完成后，就得到了虚拟节点 vnode
接下来，需要再将 vnode 更新到页面上

这里，需要 vm.\_update 方法：负责完成将虚拟节点更新到页面上

## vm.\_update 方法

```js
// src/lifecycle.js

export function mountComponent(vm) {
  // vm._render()：调用 render 方法
  // vm._update：将虚拟节点更新到页面上
  vm._update(vm._render());
}
```

在 Vue 原型上扩展 \_update 方法：

```js
export function mountComponent(vm) {
  vm._update(vm._render());
}

export function lifeCycleMixin(Vue){
  Vue.prototype._update = function (vnode) {
    console.log("_update-vnode", vnode)
  }
}
```

并在 Vue 初始化时，通过调用 lifeCycleMixin 方法，完成 \_update 在 Vue 原型上的扩展：

```js
import { initMixin } from "./init";
import { lifeCycleMixin } from "./lifecycle";
import { renderMixin } from "./render";

function Vue(options){
    this._init(options);
}

initMixin(Vue)
renderMixin(Vue)
lifeCycleMixin(Vue)	// 在 Vue 原型上扩展 _update 方法

export default Vue;
```

测试：

```js
<body>
  <div id="app">
    <li>{{name}}</li>
    <li>{{age}}</li>
  </div>
  <script src="./vue.js"></script>
  <script>
    let vm = new Vue({
      el: '#app',
      data() {
        return { name:  "Brave" , age : 123}
      }
    });
  </script>
</body>
```

前面的 vm.\_render 方法执行完成后，就返回了 vnode
接下来，继续进入 vm.\_update，打印输出当前 vnode 正常：
![](/images/手写vue2源码/（十五）根据vnode创建真实节点/打印输出1.png)

TODO：\_update 为什么选择在 Vue 原型上进行扩展？

## patch 方法

vnode 是一个描述了节点关系的对象
要根据虚拟节点渲染出真实节点，就需要将 vnode 对象递归进行渲染（先序深度遍历创建节点）

备注：由于 vue 的更新特性是组件级别的，因此合理进行组件化拆分，能够有效避免递归产生的性能问题

patch 方法：将虚拟节点转为真实节点后插入到元素中
patch 方法所属 vdom 模块，创建 src/vdom/patch.js

备注：后续的 diff 算法也是在 patch 方法中进行

```js
// src/vdom/patch.js

/**
 * 将虚拟节点转为真实节点后插入到元素中
 * @param {*} el    当前真实元素 id#app
 * @param {*} vnode 虚拟节点
 * @returns         新的真实元素
 */
export function patch(el, vnode) {
  console.log(el, vnode)
  // 根据虚拟节点创造真实节点,替换为真实元素并返回
}
```

在 vm.\_update 中使用 patch 方法：

```js
// src/lifeCycle.js#lifeCycleMixin

export function lifeCycleMixin(Vue){
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 传入当前真实元素vm.$el，虚拟节点vnode，返回新的真实元素
    vm.$el = patch(vm.$el, vnode);
  }
}
```

测试：
![](/images/手写vue2源码/（十五）根据vnode创建真实节点/打印输出2.png)

后面继续要做的事： 1.根据 vnode 创建真实节点 2.使用真实节点替换掉左侧老节点 id#app

备注：
目前只考虑 patch 方法初始化流程，
后续的更新算法，删除算法及组件更新也会在 patch 中实现
而这部分主要的难点就是组件更新

## createElm 根据虚拟节点创建真实节点

createElm 方法：根据虚拟节点创建真实节点

```js
// src/vdom/patch.js

// 将虚拟节点转为真实节点后插入到元素中
export function patch(el, vnode) {
  // 1,根据虚拟节点创建真实节点
  const elm = createElm(vnode);
	// 2,使用真实节点替换老节点
  return elm;
}
```

createElm 递归创建真实节点

```js
// src/vdom/patch.js

function createElm(vnode) {
  let el；
  let{tag, data, children, text, vm} = vnode;
  // 通过 tag 判断当前节点是元素 or 文本,判断逻辑：文本 tag 是 undefined
  if(typeof tag === 'string'){
    el = document.createElement(tag) 		// 创建元素的真实节点
    // 继续处理元素的儿子：递归创建真实节点并添加到对应的父亲上
    children.forEach(child => { // 若不存在儿子，children为空数组，循环终止
      el.appendChild(createElm(child))
    });
  } else {
    el = document.createTextNode(text)  // 创建文本的真实节点
  }
  return el;
}
```

测试：
![](/images/手写vue2源码/（十五）根据vnode创建真实节点/打印输出3.png)

当前生成的真实节点还缺少了 id#app

## 处理 data 属性

在生成元素时如果有 data 属性，需要将 data 设置到元素上，否则会丢失 id#app

```js
// src/vdom/patch.js

function createElm(vnode) {
  let{tag, data, children, text, vm} = vnode;
  if(typeof tag === 'string'){
    vnode.el = document.createElement(tag)
    // 处理 data 属性
    updateProperties(vnode.el, data)
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    });
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el;
}

// 循环 data 添加到 el 的属性上
function updateProperties(el, props = {} ) {
  // todo 当前实现没有考虑样式属性
  for(let key in props){
    el.setAttribute(key, props[key])
  }
}
```

测试：
![](/images/手写vue2源码/（十五）根据vnode创建真实节点/打印输出4.png)

至此，就实现了根据虚拟节点创建真实节点，
下一步，使用真实节点替换原始节点

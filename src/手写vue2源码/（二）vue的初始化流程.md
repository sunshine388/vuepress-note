---
title: （二）vue的初始化流程
order: 2
---

Vue 是一套用于构建用户界面的渐进式框架，Vue 并没有完全支持 MVVM 模型，但 Vue 的设计受到了它的启发，变量名 vm 是 vue model 的缩写，表示 vue 实例

<!-- more -->

## Vue 简介

以两个概念性问题做简单介绍

### 问题：Vue 是 MVVM 框架吗？

在 Vue 官网上是这样说的：

Vue 是一套用于构建用户界面的渐进式框架，Vue 并没有完全支持 MVVM 模型，但 Vue 的设计受到了它的启发，变量名 vm 是 vue model 的缩写，表示 vue 实例

所以，严格说 Vue 并不是一个 MVVM 框架

MVVM 模式是仅能够通过视图更改数据，通过数据来更改视图的，但 Vue 是可以通过 ref 获取 dom 进行操作的

### 问题：Vue 的双向绑定和单向数据流矛盾吗？

当然不矛盾，这是一个理解问题

双向绑定是指数据变了视图会更新；视图变了会影响数据；
单向数据说的是响应式数据，即数据变化后会更新视图；

## 使用 Vue

### Vue Demo

以一个简单的 Vue Demo 为例:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <!-- 模板 -->
    <div id="app">{{message}}</div>
    <!-- 引入 vue -->
    <script src="./vue.js"></script>
    <script>
      <!-- 初始化 Vue，传入 options 对象 -->
      let vm = new Vue({
        el: "#app",
        // 1，data 是对象
        data: {
          message: "Hello Vue",
        },
        // 2，data 是函数，返回一个对象
        // data() {
        //   return { message: 'Hello Vue' }
        // }
      });
    </script>
  </body>
</html>
```

Vue 初始化时，传入 el 挂载点，data 数据；

初始化完成后，message 成为响应式数据，数据变化更新视图，视图变化影响数据；

### 问题：响应式数据原理

Object.defineProperty 数据劫持（这里也正是 vue2 的性能瓶颈）

### 问题：Vue 中的数据可以是对象吗？

根组件不会被共享，可以是对象也可以是函数

非根组件必须为函数，否则 data 状态会多组件共享

## vue 的初始化操作

### 原型方法 \_init

在 Vue 原型上扩展一个 \_init 方法（原型方法），用于 Vue 的初始化操作

```js
// src/index.js
import { initMixin } from "./init"; // 引入initMixin模块

function Vue(options) {
  this._init(options); // 这里调用的是Vue的原型方法
}

// 调用 initMixin 进行 Vue 初始化操作
initMixin(Vue);

export default Vue;
```

在 new Vue() 时会执行 this.\_init(options)；这个 \_init() 从原型上获取，定义在 initMixin()中；
将用于初始化操作的原型方法 \_init 单独抽离形成一个独立模块 initMixin

```js
// src/init.js
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    console.log(options);
    console.log(vm);
  };
}
```

### 修改 html 文件

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script src="vue.js"></script>
  <script>
    let vm = new Vue({
      el: '#app',
      data() {
        return { message: 'Hello Vue' }
      }
    });
  </script>
</body>
</html>
```

Vue 初始化时，传入 el 挂载点，data 数据；

初始化完成后，message 成为响应式数据，数据变化更新视图，视图变化影响数据；

### 打印输出

![](/images/手写vue2源码/（二）vue的初始化流程/打印输出1.png)
打印原型方法 \_init 的 this，this 指向 vm 实例

## vm.$options

为了后续让 vue 中的其他方法也能够轻松获取到外部 new Vue 实例化时传入的 options 对象

干脆将 options 选项挂到 vm 实例上，即 vm.$options

```js
// src/init.js
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this; // this 指向当前 vue 实例
    vm.$options = options; // 将 Vue 实例化时用户传入的 options 暴露到 vm 实例上
  };
}
```

## initState 方法：状态的初始化

在实际使用中，数据不仅来源于传入的 data，还可能来自 props、watch、computed...

所以，最好能够统一在一个地方，集中进行数据的初始化处理：initState 方法

```js
// src/state.js
export function initState(vm) {
  // 获取options：_init 中已将 options 挂载到 vm.$options
  const opts = vm.$options;

  if (opts.data) {
    initData(vm); // data数据的初始化
  }
  // props 数据的初始化
  // watch 数据的初始化
  // computed 数据的初始化
}

function initData(vm) {
  console.log("进入 state.js - initData，数据初始化操作");
}
```

引入并使用 initState

```js
// src/init.js
import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    // new Vue 时，传入 options 选项,包含 el 和 data
    initState(vm); // 状态的初始化

    if (vm.$options.el) {
      console.log("有el,需要挂载");
    }
  };
}
```

![](/images/手写vue2源码/（二）vue的初始化流程/打印输出2.png)

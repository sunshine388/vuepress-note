---
title: （二十七）组件部分-Vue.component实现
order: 27
---

Vue.component 的实现

<!-- more -->

## 组件初始化流程简介

### Vue.component API

Vue.component 是全局 API；

Vue 初始化时的 initGlobalAPI 方法，会集中处理 Vue Global API

```js
// 方法定义
Vue.component = function (id, definition) {};
```

### Vue.extend

在 Vue.component 中，当第二个参数 definition 为对象时，会默认调用 Vue.extend 进行处理；

Vue.extend：使用基础 Vue 构造器，创造一个子类；即组件的构造函数；

### 保存组件构造函数

将组件名与构造函数的映射关系，保存到全局对象 Vue.options.components 中；

备注：全局组件中需要使用全局属性，同时便于后续的组件合并；

### 组件合并

在 Vue 初始化时，\_init 方法会进行 mergeOptions 合并选项；

内部通过组件合并策略，完成“全局组件”和“局部组件”的合并；

备注：此时的 vm.constructor.options 中包含了 Vue.options.components

组件的查找规则：优先找自己，找不到通过链上去找父亲；

### 组件合并的策略

模板编译流程：html 模板 -> AST 语法树 -> render 函数；

在 render 函数中，会通过 \_c 即 createElm 处理标签和组件；

createComponent 方法：创造组件虚拟节点 componentVnode

### 组件的初渲染和更新

根据组件的虚拟节点，创建出组件的真实节点；并将组件插入到父元素中；

组件初始化时，会为每个组件创建一个 watcher；

依赖收集:属性收集对应组件渲染的 watcher 记录到 dep 中；

当组件更新时，遍历通知 dep 数组中对应的 watcher 进行组件更新；

## Vue.component 实现

### Vue.component 如何加载

Vue.component 是全局 API；

在 Vue 初始化 init 时，会对全局 API 做集中处理：

```js
// src/index.js

/**
 * 在vue 中所有的功能都通过原型扩展（原型模式）的方式来添加
 * @param {*} options vue 实例化传入的配置对象
 */
function Vue(options) {
  this._init(options); // 调用Vue原型上的方法_init
}

initMixin(Vue);
renderMixin(Vue);
lifeCycleMixin(Vue);
initGlobalAPI(Vue); // 初始化 global Api

export default Vue;
```

initGlobalAPI 方法，处理全局 API：

```js
// src/global-api/index.js

export function initGlobalAPI(Vue) {
  // 全局属性：Vue.options
  // 功能：存放 mixin, component, filte, directive 属性
  Vue.options = {};

  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options);
    return this; // 返回this,提供链式调用
  };

  /**
   * Vue.component API
   * @param {*} id          组件名
   * @param {*} definition  组件定义
   */
  Vue.component = function (id, definition) {};
}
```

### Vue.component 如何定义

```js
// 方法定义
Vue.component = function (id, definition) {};

// 使用方式
Vue.component("my-button", {
  name: "my-button",
  template: "<button>全局组件</button>",
});
```

#### 组件名 name

每个组件都有一个自己的名字，即组件的唯一标识；

默认组件名是：id，即 Vue.component 的第一个参数；

若 definition 中有 name，使用 name 值作为组件名；

```js
/**
 * Vue.component
 * @param {*} id          组件名
 * @param {*} definition  组件定义
 */
Vue.component = function (id, definition) {
  definition.name = definition.name || id;
};
```

#### 组件定义 definition

Vue.component 的第二个参数 definition，即组件定义；

组件定义 definition 即可以是函数，也可以是对象：

Vue.extend({ /_ ... _/ })

```js
// 写法 1：注册组件，传入一个扩展过的构造器
Vue.component(
  "my-component",
  Vue.extend({
    /* ... */
  })
);

// 写法 2：注册组件，传入一个选项对象 (自动调用 Vue.extend)
Vue.component("my-component", {
  /* ... */
});

// 获取注册的组件 (始终返回构造器)
var MyComponent = Vue.component("my-component");
```

若入参 definition 为对象，则在 Vue.component 方法内部会使用 Vue.extend 进行一次处理：

```js
// src/global-api/index.js

/**
 * 使用基础的 Vue 构造器，创造一个子类
 * @param {*} definition
 */
Vue.extend = function (definition) {};

/**
 * Vue.component
 * @param {*} id          组件名
 * @param {*} definition  组件定义：对象或函数
 */
Vue.component = function (id, definition) {
  // 获取组件名 name:优先使用definition.name，默认使用 id
  let name = definition.name || id;
  definition.name = name;

  // 如果传入的 definition 是对象，需要用 Vue.extend 包裹
  if (isObject(definition)) {
    definition = Vue.extend(definition);
  }
};
```

Vue.extend：使用基础的 Vue 构造器，创建一个子类；

### 组件构造函数的全局保存

在 initGlobalAPI 方法中，Vue.options 用于存放全局属性；而在全局组件中，也会使用全局属性；所以，全局组件也要注册到 Vue.options 上；

所以，扩展 Vue.options 对象 Vue.options.components 用于存放全局组件：

```js
// src/global-api/index.js

export function initGlobalAPI(Vue) {
  // 全局属性：Vue.options
  // 功能：存放 mixin, component, filte, directive 属性
  Vue.options = {}; // 每个组件初始化时，将这些属性放入组件
  // 用于存放全局组件
  Vue.options.components = {};

  /**
   * 使用基础的 Vue 构造器，创造一个子类
   * @param {*} definition
   */
  Vue.extend = function (definition) {};

  /**
   * Vue.component
   * @param {*} id          组件名（默认）
   * @param {*} definition  组件定义：可能是对象或函数
   */
  Vue.component = function (id, definition) {
    // 获取组件名 name:优先使用definition.name，默认使用 id
    let name = definition.name || id;
    definition.name = name;

    // 如果传入的 definition 是对象，需要用 Vue.extend 包裹
    if (isObject(definition)) {
      definition = Vue.extend(definition);
    }

    // 将 definition 对象保存到全局：Vue.options.components
    Vue.options.components[name] = definition;
  };
}
```

Vue.options.components 就相当于在全局维护了一个组件名与组件构造函数的映射关系；

这样做的目的和作用：

> 便于后续通过全局上的 vm.constructor.options 进行全局、局部组件的合并；
>
> 便于后续根据组件虚拟节点的 tag 标签，能够直接查找到该组件的构造函数并进行组件的实例化；

### Vue.component 总结

> Vue.component 是 Vue Global API；
>
> 通过调用 Vue.component 进行全局组件声明；
>
> 在 Vue 初始化时，Vue.component 内部通过 Vue.extend 生成子类，即组件的构造函数；
>
> 维护组件名与组件构造函数的映射关系到 Vue.options.components 供后续组件合并与组件实例化使用；

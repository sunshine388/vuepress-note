---
title: （二十八）组件部分-Vue.extend实现
order: 28
---

Vue.extend 实现

<!-- more -->

## Vue.extend 简介

### 前文回顾

上篇，在 Vue.component 的实现中，通过 Vue.component 创建组件时：

两种方式：既可以传入函数，也可以传入对象

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

若入参 definition 组件定义是一个对象：在 Vue.component 内部将使用 Vue.extend 进行处理，结果会产生一个组件的构造函数，并保存到全局 Vue.options.components 上备用；

### Vue.extend 简介

Vue.extend:使用基础 Vue 构造器，创建一个“子类”。

options 参数是一个包含组件选项的对象。

data 选项是特例，需要注意 - 在 Vue.extend() 中它必须是函数

示例：

```html
<div id="mount-point"></div>
```

```js
// 创建构造器
var Profile = Vue.extend({
  template: "<p>{{firstName}} {{lastName}} aka {{alias}}</p>",
  data: function () {
    // data 必须是函数
    return {
      firstName: "Walter",
      lastName: "White",
      alias: "Heisenberg",
    };
  },
});
// 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount("#mount-point");
```

结果如下：

```html
<p>Walter White aka Heisenberg</p>
```

## Vue.extend 实现

### 当前代码

```js
// src/global-api/index.js

export function initGlobalAPI(Vue) {
  Vue.options = {}; // 全局属性：Vue.options
  Vue.options.components = {}; // 存放全局组件

  /**
   * 使用基础的 Vue 构造器，创造一个子类
   * @param {*} definition
   */
  Vue.extend = function (definition) {
    // todo...
  };

  /**
   * Vue.component
   * @param {*} id          组件名（默认）
   * @param {*} definition  组件定义：可能是对象或函数
   */
  Vue.component = function (id, definition) {
    // 获取组件名 name:优先使用definition.name，默认使用 id
    let name = definition.name || id;
    definition.name = name;

    // 如果传入的 definition 是对象，需要用 Vue.extend 处理
    if (isObject(definition)) {
      definition = Vue.extend(definition);
    }

    // 将 definition 对象保存到全局：Vue.options.components
    Vue.options.components[name] = definition;
  };
}
```

### Vue.extend 内部逻辑

Vue.extend 会使用基础 Vue 构造器，生成一个子类；

所以，Vue.extend 内部需要生成一个继承 Vue 的子类 Sub：

父类 Vue 即当前 this;

子类继承自父类，即子类 Sub 继承 Vue 的原型方法；

```js
// src/global-api/index.js#initGlobalAPI

Vue.extend = function (definition) {
  // 父类 Vue 即当前 this;
  const Super = this;
  // 创建子类 Sub
  const Sub = function (options) {};
};
```

### 组件的初始化

创造一个组件，实际就是 new 这个组件的类；

在前面的组件初始化过程中，当执行 new Vue 时会调用 Vue 原型方法 \_init：

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
renderMixin(Vue); // 混合一个 render 方法
lifeCycleMixin(Vue);
initGlobalAPI(Vue); // 初始化 global Api
```

Vue 原型方法 \_init：

```js
// src/init.js#initMixin

Vue.prototype._init = function (options) {
  const vm = this; // this 指向当前 vue 实例
  // vm.$options = options; // 将 Vue 实例化时用户传入的options暴露到vm实例上
  // 此时需使用 options 与 mixin 合并后的全局 options 再进行一次合并
  vm.$options = mergeOptions(vm.constructor.options, options);
  // 目前在 vue 实例化时，传入的 options 只有 el 和 data 两个参数
  initState(vm); // 状态的初始化

  if (vm.$options.el) {
    // 将数据挂在到页面上（此时,数据已经被劫持）
    vm.$mount(vm.$options.el);
  }
};
```

所以，当 new 组件时，就会进行组件的初始化：也会执行 Vue 初始化时的 \_init 方法：

```js
Vue.extend = function (definition) {
  // 父类 Vue 即当前 this;
  const Super = this;
  // 创建子类 Sub
  const Sub = function (options) {
    // 当 new 组件时，执行组件初始化
    this._init(options);
  };
};
```

所以，当 new sub 时，也会调用初始化方法：

```js
function Vue(options) {
  this._init(options);
}
```

### 子类继承父类

那么，子类如何继承于父类？

子类 Sub 继承于父类，即继承 Vue 的原型方法：

```js
Vue.extend = function (definition) {
  // 父类 Vue 即当前 this;
  const Super = this;

  // 创建子类 Sub
  const Sub = function (options) {
    // new 组件时，执行组件初始化；
    // 由于 Sub 继承于 Vue，会执行 Vue._init 方法
    this._init(options);
  };

  // 继承 Vue 的原型方法:Sub.prototype.__proto__ = Supper.prototype（父类的原型）
  Sub.prototype = Object.create(Super.prototype);
};
```

备注：还可以使用 ES6 方式 Object.setPrototypeOf；能够通过链拿到父类上的所有属性

**面试题**

问：组件中的 data 为什么必须是一个函数，而不能是对象？

> 如果 data 是对象，由于对象是引用类型，指向同一个引用地址，new Component 后 data 是共用的；
>
> data 是函数，每次 new Component 时组件内部都是一个独立的对象；

### 修复 constructor 指向问题

**问题分析**

Object.create 实现原理：

```js
// Object.create：会生成一个具有父类原型的新实例
function create(parentPrototype) {
  // 声明空函数 Fn
  const Fn = function () {};
  // 将 Fn 的 prototype 赋值为父类原型
  Fn.prototype = parentPrototype;
  // 返回 Fn 的实例 fn
  return new Fn();
}
```

当调用 Object.create 时，内部会构建一个具有父类原型的新实例;

```js
// 通过 new Fn 产生的实例 fn，fn 的原型指向父类的原型；
let fn = Object.create(Super.prototype);
// Sub.prototype 指向 fn
Sub.prototype = fn;
```

这样，子类就可以通过链拿到父类上的方法了；

但是，这种写法也产生了一个严重的问题：

- Sub.prototype 是 fn，但 fn.constructor 指向的还是 Fn！
- 此时 fn.constructor 应该指向当前的子类 Sub；

**问题解决**

经以上分析可知：由于 Object.create 内部会产生一个新的实例作为子类的原型，这会导致子类的 constructor 指向错误；

修复 constructor 指向问题：

```js
// src/global-api/index.js

export function initGlobalAPI(Vue) {
  /**
   * 使用基础的 Vue 构造器，创造一个子类
   *  new 子类时，执行组件的初始化 _init
   * @param {*} definition
   */
  Vue.extend = function (definition) {
    const Super = this;
    const Sub = function (options) {
      this._init(options);
    };

    Sub.prototype = Object.create(Super.prototype);
    // 修复 constructor 指向问题：Object.create 会产生一个新的实例作为子类的原型，导致constructor指向错误
    Sub.prototype.constructor = Sub;
  };
}
```

这样，就通过 Vue.extend 生成了子类，即组件的构造函数；

接下来，再将组件的构造函数保存到全局 Vue.options.components 上备用即可；

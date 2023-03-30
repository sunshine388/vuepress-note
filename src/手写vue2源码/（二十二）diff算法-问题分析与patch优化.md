---
title: （二十二）diff算法-问题分析与patch优化
order: 22
---

Vue2 源码的 diff 算法部分

<!-- more -->

## 当前版本存在的问题

### 初始化与更新流程分析

Vue 初始化，会在挂载时调用 mountComponent 方法

```js
// src/init.js

Vue.prototype.$mount = function (el) {
  const vm = this;
  const opts = vm.$options;
  el = document.querySelector(el); // 获取真实的元素
  vm.$el = el; // vm.$el 表示当前页面上的真实元素

  // 如果没有 render, 看 template
  if (!opts.render) {
    // 如果没有 template, 采用元素内容
    let template = opts.template;
    if (!template) {
      // 拿到整个元素标签,将模板编译为 render 函数
      template = el.outerHTML;
    }
    let render = compileToFunction(template);
    opts.render = render;
  }

  mountComponent(vm);
};
```

在 mountComponent 方法中，会创建一个 watcher

```js
// src/lifeCycle.js

export function mountComponent(vm) {
  let updateComponent = () => {
    vm._update(vm._render());
  };
  // 当视图渲染前，调用钩子: beforeCreate
  callHook(vm, "beforeCreate");

  // 渲染 watcher ：每个组件都有一个 watcher
  new Watcher(
    vm,
    updateComponent,
    () => {
      // 视图更新后，调用钩子: created
      callHook(vm, "created");
    },
    true
  );

  // 当视图挂载完成，调用钩子: mounted
  callHook(vm, "mounted");
}
```

数据更新时，会进入 set 方法

```js
// src/observe/index.js

function defineReactive(obj, key, value) {
  // childOb 是数据组进行观测后返回的结果，内部 new Observe 只处理数组或对象类型
  let childOb = observe(value); // 递归实现深层观测
  let dep = new Dep(); // 为每个属性添加一个 dep
  Object.defineProperty(obj, key, {
    // get方法构成闭包：取obj属性时需返回原值value，
    // value会查找上层作用域的value，所以defineReactive函数不能被释放销毁
    get() {
      if (Dep.target) {
        // 对象属性的依赖收集
        dep.depend();
        // 数组或对象本身的依赖收集
        if (childOb) {
          // 如果 childOb 有值，说明数据是数组或对象类型
          // observe 方法中，会通过 new Observe 为数组或对象本身添加 dep 属性
          childOb.dep.depend(); // 让数组和对象本身的 dep 记住当前 watcher
          if (Array.isArray(value)) {
            // 如果当前数据是数组类型
            // 可能数组中继续嵌套数组，需递归处理
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newValue) {
      // 确保新对象为响应式数据：如果新设置的值为对象，需要再次进行劫持
      console.log(
        "修改了被观测属性 key = " +
          key +
          ", newValue = " +
          JSON.stringify(newValue)
      );
      if (newValue === value) return;
      observe(newValue); // observe方法：如果是对象，会 new Observer 深层观测
      value = newValue;
      dep.notify(); // 通知当前 dep 中收集的所有 watcher 依次执行视图更新
    },
  });
}
```

此时，会调用 dep.notify() 通知对应的 watcher 调用 update 方法做更新

```js
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  // 让 watcher 记住 dep（查重），再让 dep 记住 watcher
  depend() {
    // this.subs.push(Dep.target);
    if (Dep.target) {
      // 相当于 watcher.addDep：使当前 watcher 记住 dep
      Dep.target.addDep(this);
    }
  }
  // 让 dep 记住 watcher - 在 watcher 中被调用
  addSub(watcher) {
    this.subs.push(watcher);
  }
  // dep 中收集的全部 watcher 依次执行更新方法 update
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}
```

在 Watcher 类的 update 方法中，调用了 queueWatcher 方法将 watcher 进行缓存、去重操作

```js
// src/observe/watcher.js

class Watcher {
  constructor(vm, fn, cb, options) {
    this.vm = vm;
    this.fn = fn;
    this.cb = cb;
    this.options = options;

    this.id = id++; // watcher 唯一标记
    this.depsId = new Set(); // 用于当前 watcher 保存 dep 实例的唯一id
    this.deps = []; // 用于当前 watcher 保存 dep 实例
    this.getter = fn; // fn 为页面渲染逻辑
    this.get();
  }
  addDep(dep) {
    let did = dep.id;
    // dep 查重
    if (!this.depsId.has(did)) {
      // 让 watcher 记住 dep
      this.depsId.add(did);
      this.deps.push(dep);
      // 让 dep 也记住 watcher
      dep.addSub(this);
    }
  }
  get() {
    Dep.target = this; // 在触发视图渲染前，将 watcher 记录到 Dep.target 上
    this.getter(); // 调用页面渲染逻辑
    Dep.target = null; // 渲染完成后，清除 Watcher 记录
  }
  update() {
    console.log("watcher-update", "查重并缓存需要更新的 watcher");
    queueWatcher(this);
  }
  run() {
    console.log("watcher-run", "真正执行视图更新");
    this.get();
  }
}
```

queueWatcher 方法：

```js
// src/observe/scheduler.js

/**
 * 将 watcher 进行查重并缓存，最后统一执行更新
 * @param {*} watcher 需更新的 watcher
 */
export function queueWatcher(watcher) {
  let id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    queue.push(watcher); // 缓存住watcher,后续统一处理
    if (!pending) {
      // 等效于防抖
      nextTick(flushschedulerQueue);
      pending = true; // 首次进入被置为 true，使微任务执行完成后宏任务才执行
    }
  }
}

/**
 * 刷新队列：执行所有 watcher.run 并将队列清空；
 */
function flushschedulerQueue() {
  // 更新前,执行生命周期：beforeUpdate
  queue.forEach((watcher) => watcher.run()); // 依次触发视图更新
  queue = []; // reset
  has = {}; // reset
  pending = false; // reset
  // 更新完成,执行生命周期：updated
}
```

flushschedulerQueue 方法执行时，会调用 watcher 的 run 方法

run 内部调用 watcher 的 get 方法，get 方法中记录当前 watcher 并调用 getter

this.getter 即 watcher 初始化时传入的视图更新方法 fn，

即 updateComponent 视图渲染逻辑

```js
// src/lifeCycle.js

export function mountComponent(vm) {
  let updateComponent = () => {
    vm._update(vm._render());
  };
  // 当视图渲染前，调用钩子: beforeCreate
  callHook(vm, "beforeCreate");

  // 渲染 watcher ：每个组件都有一个 watcher
  new Watcher(
    vm,
    updateComponent,
    () => {
      // 视图更新后，调用钩子: created
      callHook(vm, "created");
    },
    true
  );

  // 当视图挂载完成，调用钩子: mounted
  callHook(vm, "mounted");
}
```

这样，就会再次执行 updateComponent->vm.\_render，

会根据当前的最新数据，重新生成虚拟节点，并且再次调用 update

```js
// src/lifeCycle.js

export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 传入当前真实元素vm.$el，虚拟节点vnode，返回新的真实元素
    vm.$el = patch(vm.$el, vnode);
  };
}
```

### 问题分析与优化思路

update 方法会使用新的虚拟节点重新生成真实 dom，并替换掉原来的 dom

在 Vue 的实现中，会做一次 diff 算法优化：尽可能复用原有节点，以提升渲染性能

所以，patch 方法即为重点优化对象：

> 当前的 patch 方法，仅考虑了初始化的情况，还需要处理更新操作
>
> patch 方法需要对新老虚拟节点进行一次比对，尽可能复用原有节点，以提升渲染性能

1. 首次渲染，根据虚拟节点生成真实节点，替换掉原来的节点
2. 更新渲染，生成新的虚拟节点，并和老的虚拟节点进行对比，再渲染

## 模拟新老虚拟节点比对

模拟两个虚拟节点的比对：

1. 生成虚拟节点 1
2. 生成虚拟节点 2
3. 调用 patch 方法进行新老虚拟节点比对

### 生成第一个虚拟节点

首次，生成虚拟节点后，直接进行挂载

```js
// src/index.js

// 1,生成第一个虚拟节点
// new Vue会对数据进行劫持
let vm1 = new Vue({
  data() {
    return { name: "Brave" };
  },
});
// 将模板 render1 生成为 render 函数
let render1 = compileToFunction("<div>{{name}}</div>"); // 调用 compileToFunction，将模板生成 render 函数，会解析模板，最终包成一个 function
// 调用 render 函数，产生虚拟节点
let oldVnode = render1.call(vm1); // oldVnode:第一次的虚拟节点
// 将虚拟节点生成真实节点
let el1 = createElm(oldVnode);
// 将真实节点渲染到页面上
document.body.appendChild(el1);
```

### 生成第二个虚拟节点

```js
// src/index.js

// 2，生成第二个虚拟节点
let vm2 = new Vue({
  data() {
    return { name: "BraveWang" };
  },
});
let render2 = compileToFunction("<p>{{name}}</p>");
let newVnode = render2.call(vm2);

// 延迟看效果：初始化完成显示 el1，1 秒后移除 el1 显示 el2
setTimeout(() => {
  let el2 = createElm(newVnode);
  document.body.removeChild(el1);
  document.body.appendChild(el2);
}, 1000);

export default Vue;
```

### patch 方法比对新老虚拟节点

patch 方法：将新老虚拟节点进行一次比对，尽可能复用原有节点，以提升渲染性能

节点复用逻辑：标签名和 key 相同即判定可复用

```js
// 如果标签名一样就复用
// 3,调用 patch 方法进行比对
setTimeout(() => {
  // 比对新老虚拟节点的差异，尽可能复用原有节点，以提升渲染性能
  patch(oldVnode, newVnode);
}, 1000);
```

### 查看新老节点

```js
let vm = new Vue({
    data(){
        return {name:'Brave'}
    }
})
let render = compileToFunction('<div>{{name}}</div>');/
let oldVnode = render.call(vm)
let el = createElm(oldVnode);
document.body.appendChild(el);

// 数据更新后，再次调用 render 函数
vm.name = 'BraveWang';
let newVnode = render.call(vm);

setTimeout(()=>{
    patch(oldVnode, newVnode);
}, 1000);
```

查看生成的两个真实节点：

![](/images/手写vue2源码/（二十二）diff算法-问题分析与patch优化/打印输出1.png)

接下来开始改造 patch 方法，以实现节点对比和复用；

## patch 方法优化

### 当前的 patch 方法

当前的 patch 方法仅考虑到初始化的情况，所以每次都会直接替换掉老节点

```js
export function patch(el, vnode) {
  // 1，根据虚拟节点创建真实节点
  const elm = createElm(vnode);
  // 2，使用真实节点替换掉老节点
  // 找到元素的父亲节点
  const parentNode = el.parentNode;
  // 找到老节点的下一个兄弟节点（nextSibling 若不存在将返回 null）
  const nextSibling = el.nextSibling;
  // 将新节点elm插入到老节点el的下一个兄弟节点nextSibling的前面
  // 备注：若nextSibling为 null，insertBefore 等价与 appendChild
  parentNode.insertBefore(elm, nextSibling);
  // 删除老节点 el
  parentNode.removeChild(el);

  return elm;
}
```

### 改造 patch 方法

当前 patch 方法的两个入参分别是：元素和虚拟节点

将虚拟节点创建为真实节点，直接进行元素替换，完成数据更新

现在需要将新老虚拟节点进行比对，尽可能复用原有节点，提高渲染性能

所以 patch 方法需改造为入参是新老虚拟节点：oldVnode、vnode

当前的 patch 方法仅考虑到初始化的情况；

现在还需要支持数据更新的情况；

```js
export function patch(oldVnode, vnode) {
  const elm = createElm(vnode);
  const parentNode = oldVnode.parentNode;
  parentNode.insertBefore(elm, oldVnode.nextSibling);
  parentNode.removeChild(oldVnode);

  return elm;
}
```

问题：初渲染 OR 更新渲染？

> 通过判断 oldVnode.nodeType 节点类型是否为真实节点；
>
> 是真实节点，需要进行新老虚拟节点比对
>
> 非真实节点，即为真实 dom 时，进行初渲染逻辑

改造完成后的 patch 方法：

```js
export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 真实节点，走老逻辑
    const elm = createElm(vnode);
    const parentNode = oldVnode.parentNode;
    parentNode.insertBefore(elm, oldVnode.nextSibling);
    parentNode.removeChild(oldVnode);
    return elm;
  } else {
    // 虚拟节点：做 diff 算法，新老节点比对
    console.log(oldVnode, vnode);
  }
}
```

后边开始针对更新渲染的情况，进行新老虚拟节点的比对，即 diff 算法逻辑；

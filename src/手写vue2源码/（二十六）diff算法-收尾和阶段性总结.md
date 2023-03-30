---
title: （二十六）diff算法-收尾和阶段性总结
order: 26
---

diff 算法的阶段性梳理

<!-- more -->

## 初渲染与视图更新流程

1. Vue 初渲染时，会调用 mountComponent 方法进行挂载，在 mountComponent 方法中，会创建一个 watcher；
2. 当数据更新时，进入 Object.defineProperty 的 set 方法，在 set 方法中，会调用 dep.notify() 通知收集的 watcher 调用 update 方法做更新渲染；
3. 在 Watcher 类的 update 方法中，调用了 queueWatcher 方法将 watcher 进行缓存、去重操作
4. queueWatcher 方法中调用 flushschedulerQueue 方法，执行所有 watcher.run 并清空队列
5. Watcher 类中的 run 方法，内部调用了 Watcher 类中的 get 方法：记录当前 watcher 并调用 getter
6. this.getter 是 Watcher 类实例化时传入的视图更新方法 fn，即 updateComponent 视图渲染逻辑
7. 执行 updateComponent 中的 vm.\_render，使用最新数据重新生成虚拟节点并调用 update 更新视图

## diff 算法的外层更新

在 Vue 中，每次数据变化时，并不会对节点做全量的替换，而是会对新老虚拟节点进行 diff 比对：

> 首次渲染，根据虚拟节点生成真实节点，替换掉原来的节点
>
> 更新渲染，生成新的虚拟节点，并与老的虚拟节点比对，复用老节点进行渲染

diff 算法：

> 又叫同层比对算法；
>
> 深度优先遍历递归；
>
> 采用了“头尾指针”的处理;通过对新老虚拟节点进行比对，尽可能复用原有节点，以提升渲染性能；

节点可复用的依据：

> 标签名和 key 均相同，即判定为可复用节点；

patch 方法做节点的递归更新：通过 oldVnode.nodeType 节点类型，判断是否为真实节点；

> 非真实节点，即为真实 dom 时，进行初渲染逻辑
>
> 是真实节点，需要进行新老虚拟节点比对

新老虚拟节点比对：

> 节点不相同时，使用新的真实节点：createElm(vnode)，替换老的真实节点：oldVnode.el；oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
>
> 节点相同时，复用老节点，更新文本、样式等属性即可；

文本的处理：

> 文本节点没有标签名
>
> 文本节点没有有儿子

元素的处理：

> 新老元素都有的属性，用新值覆盖老值；
>
> 新的没有，老的有的属性，直接删除掉；

style 的处理：

> 老样式对象中有，新样式对象中没有，删掉多余样式；
>
> 新样式对象中有，覆盖到老样式对象中；

## diff 算法的比对优化

### 新老儿子节点的情况

情况 1：老的有儿子，新的没有儿子

处理方法：直接将多余的老 dom 元素删除即可；

情况 2：老的没有儿子，新的有儿子

处理方法：直接将新的儿子节点放入对应的老节点中即可；

情况 3：新老都有儿子

处理方法：进行 diff 比对；

### 新老儿子节点的 diff 比对

新老儿子节点的比对，采用了头尾双指针的方法;

新老节点都有儿子时，进行头头、尾尾、头尾、尾头对比；

头头、尾尾、头尾、尾头均没有命中时，进行乱序比对;

## diff 算法的乱序比对

根据老儿子集合创建一个节点 key 和索引 index 的映射关系 mapping；用新儿子节点依次到 mapping 中查找是否存在可复用的节点；

存在复用节点，更新可复用节点属性并移动到对应位置；（移动走的老位置要做空标记）

不存在复用节点，创建节点并添加到对应位置；

最后，再将不可复用的老节点删除；

## diff 算法收尾

### 问题分析

至此，已经完成了 diff 算法的全部逻辑编写，但一直使用模拟新老节点更新;

原因在于，每次更新时都执行 patch(vm.$el, vnode)

```js
// src/lifecycle.js

export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 传入当前真实元素vm.$el，虚拟节点vnode，返回新的真实元素
    vm.$el = patch(vm.$el, vnode);
  };
}
```

在使用两个虚拟节点模拟 diff 更新时，我们已经修改了 patch 方法：使之既能够支持初渲染，还能支持更新渲染：

```js
// src/vdom/patch.js

/**
 * 将虚拟节点转为真实节点后插入到元素中
 * @param {*} oldVnode  老的虚拟节点
 * @param {*} vnode     新的虚拟节点
 * @returns             新的真实元素
 */
export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType; // 真实节点：1，虚拟节点：无此属性
  if (isRealElement) {
    // 真实节点
    // 1，根据虚拟节点创建真实节点
    const elm = createElm(vnode);
    // 2，使用真实节点替换掉老节点
    // 找到元素的父亲节点
    const parentNode = oldVnode.parentNode;
    // 找到老节点的下一个兄弟节点（nextSibling 若不存在将返回 null）
    const nextSibling = oldVnode.nextSibling;
    // 将新节点 elm 插入到老节点el的下一个兄弟节点 nextSibling 的前面
    // 备注：若 nextSibling 为 null，insertBefore 等价于 appendChild
    parentNode.insertBefore(elm, nextSibling);
    // 删除老节点 el
    parentNode.removeChild(oldVnode);

    return elm;
  } else {
    // diff：新老虚拟节点比对
    if (!isSameVnode(oldVnode, vnode)) {
      // 同级比较，不是相同节点时，不考虑复用（放弃跨层复用），直接用新的替换旧的
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    }

    // 相同节点，就复用节点（复用老的），再更新不一样的地方（属性），注意文本要做特殊处理，文本是没有标签名的

    // 文本的处理：文本直接更新就可以，因为文本没有儿子  组件中 Vue.component（‘xxx’）这就是组件的 tag
    let el = (vnode.el = oldVnode.el); // 节点复用：将老节点el，赋值给新节点el
    if (!oldVnode.tag) {
      // 文本：没有标签名
      if (oldVnode.text !== vnode.text) {
        // 文本内容变化了，更新文本内容：用新的内容更新老的内容
        return (el.textContent = vnode.text);
      }
    }

    // 元素的处理：相同节点，且新老节点不都是文本时
    updateProperties(vnode, oldVnode.data);

    // 比较儿子节点
    let oldChildren = oldVnode.children || [];
    let newChildren = vnode.children || [];
    // 情况 1：老的有儿子，新的没有儿子；直接把老的 dom 元素干掉即
    if (oldChildren.length > 0 && newChildren.length == 0) {
      el.innerHTML = ""; //暴力写法直接清空；更好的处理是封装removeChildNodes方法：将子节点全部删掉，因为子节点可能包含组件
      // 情况 2：老的没有儿子，新的有儿子；直接将新的插入即可
    } else if (oldChildren.length == 0 && newChildren.length > 0) {
      newChildren.forEach((child) => {
        // 注意：这里的child是虚拟节点，需要变为真实节点
        let childElm = createElm(child); // 根据新的虚拟节点，创建一个真实节点
        el.appendChild(childElm); // 将生成的真实节点，放入 dom
      });
      // 情况 3：新老都有儿子
    } else {
      // 递归: updateChildren 内部调用 patch, patch, 内部还会调用 updateChildren (patch 方法是入口)
      updateChildren(el, oldChildren, newChildren);
    }

    return el; // 返回新节点
  }
}
```

### 正常使用方式

将模拟节点更新的代码全部注释掉，并修改 index.html

```html
<!-- diff算法 -->
<body>
  <!-- 场景：div标签复用，仅更新span标签中的文本 name -->
  <div id="app">
    <span>{{name}}</span>
  </div>
  <script src="/dist/vue.js"></script>
  <script>
    let vm = new Vue({
      el: "#app",
      data() {
        return { name: "Brave" };
      },
    });
    setTimeout(() => {
      vm.name = "BraveWang";
    }, 1000);
  </script>
</body>
```

### 测试修改前效果

测试 patch 方法修改前的效果：

![](/images/手写vue2源码/（二十六）diff算法-收尾+阶段性总结/img1.png)

测试结果：将 div 标签全部干掉，重新创建了一次；

原因分析：每次都执行 vm.$el = patch(vm.$el, vnode);，没有区分初渲染和更新渲染；

### 如何区分初渲染和更新渲染

如何区分初渲染和更新渲染？

> 第一次渲染时，在 vm.preVnode 上保存当前 Vnode；
>
> 第二次渲染时，先取 vm.preVnode，有值就是更新渲染；
>
> 初渲染，执行 patch(vm.$el, vnode)；
>
> 更新渲染，执行 patch(preVnode, vnode)；

### 代码实现

```js
export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 取上一次的 preVnode
    let preVnode = vm.preVnode;
    // 渲染前，先保存当前 vnode
    vm.preVnode = vnode;
    // preVnode 有值，说明已经有节点了，本次是更新渲染；没值就是初渲染
    if (!preVnode) {
      // 初渲染
      // 传入当前真实元素vm.$el，虚拟节点vnode，返回新的真实元素
      vm.$el = patch(vm.$el, vnode);
    } else {
      // 更新渲染:新老虚拟节点做 diff 比对
      vm.$el = patch(preVnode, vnode);
    }
  };
}
```

### 测试修改后的效果

测试 patch 方法修改后的效果：

![](/images/手写vue2源码/（二十六）diff算法-收尾+阶段性总结/img2.png)

测试结果：div 标签被复用，只更新了 span 中的 name；

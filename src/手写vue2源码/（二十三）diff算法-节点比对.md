---
title: （二十三）diff算法-节点比对
order: 23
---

diff 算法-节点比对

<!-- more -->

## diff 算法

上一篇，完成了 patch 方法的改造，

接下来，开始编写视图更新时新老虚拟节点比对的 diff 算法；

在这之前，先介绍一下 diff 算法：

### diff 算法的简单介绍

diff 算法也叫做同层比较算法；

首先，dom 是一个树型结构：
![](/images/手写vue2源码/（二十三）diff算法-节点比对/img1.png)

在日常开发中，很少会将 B 和 A 或是 D 和 A 的位置进行调换，即：很少将父亲和儿子节点进行交换

而且跨层的节点比对会非常麻烦，所以，diff 算法考虑到应用场景与性能，只会进行同层节点的比较；

### diff 算法的比较方式

diff 算法将新老虚拟节点，"两棵树"进行比对

从树的根节点，即 LV1 层开始比较：
![](/images/手写vue2源码/（二十三）diff算法-节点比对/img2.png)

A 比较完成后，查看 A 节点是否有儿子节点，即 B 和 C，优先比较 B：
![](/images/手写vue2源码/（二十三）diff算法-节点比对/img3.png)

B 比较完成后，查看 B 节点是否有儿子节点，即 D 和 E，优先比较 D

D 比较完成后，没有儿子；继续比较 E，当前层处理完成，返回上层处理；

继续比较 C，C 有儿子 F，继续比较 F，最后全部比较完成，结束；

所以，diff 比对是深度优先遍历的递归比对；

> 备注：递归比对是 vue2 的性能瓶颈，当组件树庞大时会有性能问题；

### diff 算法的节点复用

如何确定两个节点为复用，一般来说，相同标签的元素即可进行复用；
但也有标签相同，实际场景并不希望复用的情况，这时可使用 key 属性进行标记；
如果 key 不相同，即便标签名相同的两个元素，也不会进行复用；

所以，在编写代码时，相同节点的复用标准如下：

1. 标签名和 key 均相同，是相同节点；
2. 如果标签名和 key 不完全相同，不是相同节点；

isSameVnode 方法：用于判断是否为相同节点：

```js
// src/vdom/index.js

/**
 * 判断两个虚拟节点是否是同一个虚拟节点
 *  逻辑：标签名 和 key 都相同
 * @param {*} newVnode 新虚拟节点
 * @param {*} oldVnode 老虚拟节点
 * @returns
 */
export function isSameVnode(newVnode, oldVnode){
  return (newVnode.tag === oldVnode.tag)&&(newVnode.key === oldVnode.key);
}
```

当新老虚拟节点的标签和 key 均相同时，即 isSameVnode 返回 true，复用节点仅做属性更新即可；

## 虚拟节点比对

### 不是相同节点的情况

创建两个虚拟节点，模拟视图的更新：

```js
// 模拟初渲染
let vm1 = new Vue({
    data() {
        return { name: 'Brave' }
    }
})
let render1 = compileToFunction('<div>{{name}}</div>');
let oldVnode = render1.call(vm1)
let el1 = createElm(oldVnode);
document.body.appendChild(el1);

// 模拟新的虚拟节点 newVnode
let vm2 = new Vue({
    data() {
        return { name: 'BraveWang' }
    }
})
let render2 = compileToFunction('<p>{{name}}</p>');
let newVnode = render2.call(vm2);

// diff：新老虚拟节点对比
setTimeout(() => {
    patch(oldVnode, newVnode);
}, 1000);
```

由于新老虚拟节点的标签名 tag 不同（模拟 v-if 和 v-else 的情况），

所以不是相同节点，不考虑复用（放弃跨层复用），直接使用新的替换掉旧的真实节点

在 patch 方法中，打印新老虚拟节点：
![](/images/手写vue2源码/（二十三）diff算法-节点比对/img4.png)

![](/images/手写vue2源码/（二十三）diff算法-节点比对/img5.png)

如何替换节点

> 由于父节点的标签名不同，导致节点不复用，
> 需根据新的虚拟节点生成真实节点，并替换掉老节点

1. 使用新的虚拟节点创建真实节点：
2. createElm(vnode);
3. 替换老节点，如果获取到老的真实节点？
4. 根据 vnode 生成真实节点时，通过 vnode.el 将真实节点与虚拟节点进行了映射所以，此时可以通过 oldVnode.el 获取到老的真实节点；
5. 备注：$el 是指整棵树，这里不可用；

结论：

> 新的真实节点：createElm(vnode);
> 老的真实节点：oldVnode.el;

```js
export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if(isRealElement){// 真实节点
    const elm = createElm(vnode);
    const parentNode = oldVnode.parentNode;
    parentNode.insertBefore(elm, oldVnode.nextSibling);
    parentNode.removeChild(oldVnode);
    return elm;
  }else{ // diff：新老虚拟节点比对
    console.log(oldVnode, vnode)
    if(!isSameVnode(oldVnode, vnode)){// 不是相同节点，不考虑复用直接替换
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    }
  }
}
```

当包含子组件时，每个组件都有一个 watcher，
将会通过 diff 进行局部更新，并不会做整个树的更新
所以，只要组件拆分合理，一般不会有性能问题

### 是相同节点的情况

如果元素的标签名和 key 都相同，即判定为相同节点，即 isSameVnode 返回 true；

此时，只需要更新属性即可（文本、样式等）

#### 文本的处理

文本节点没有标签名
文本节点没有有儿子

```js
// 文本的处理：文本可以直接更新，因为文本没有儿子
// 组件中 Vue.component（‘xxx’）；xxx 就是组件的 tag
let el = vnode.el = oldVnode.el;  // 节点复用：将老节点 el 赋值给新节点 el
if(!oldVnode.tag){// 文本：没有标签名
  if(oldVnode.text !== vnode.text){// 内容变更：更新文本内容
    return el.textContent = vnode.text;// 新内容替换老内容
  } else{
    return;
  }
}
```

#### 元素的处理

相同节点且新老节点不都是文本时，会对元素进行处理
需要对 updateProperties 方法进行重构调整：
重构前：直接传入真实元素 vnode.el 和 data 属性，进行替换，仅具有渲染功能

```js
// src/vdom/patch.js

export function createElm(vnode) {
  let{tag, data, children, text, vm} = vnode;
  if(typeof tag === 'string'){
    vnode.el = document.createElement(tag)
    updateProperties(vnode.el, data)
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    });
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el;
}

function updateProperties(el, props = {} ) {
  for(let key in props){
    el.setAttribute(key, props[key])
  }
}
```

```js
updateProperties 方法的重构方式：
第一个参数是：新的虚拟节点
第二个参数是：老的数据，因为需要对新老数据做 diff 比对
```

重构后：updateProperties 方法，既有渲染功能，又有更新功能

```js
// src/vdom/patch.js

export function createElm(vnode) {
  let{tag, data, children, text, vm} = vnode;
  if(typeof tag === 'string'){
    vnode.el = document.createElement(tag)
    updateProperties(vnode, data) // 修改。。。
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    });
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el;
}

// 1,初次渲染，用oldProps给vnode的 el 赋值即可
// 2,更新逻辑，拿到老的props和vnode中的 data 进行比对
function updateProperties(vnode, oldProps = {} ) {
  let el = vnode.el; // dom上的真实节点（上边复用老节点时已经赋值了）
  let newProps = vnode.data || {};  // 拿到新的数据
  // 新旧比对：两个对象比对差异
  for(let key in newProps){ // 直接用新的盖掉老的，但还要注意：老的里面有，可能新的里面没有了
    el.setAttribute(key, newProps[key])
  }
  // 处理老的里面有，可能新的里面没有的情况，需要再删掉
  for(let key in oldProps){
    if(!newProps[key]){
      el.removeAttribute(key)
    }
  }
}
```

测试：节点元素名相同，属性不同

```js
// 调用 updateProperties 属性更新
updateProperties(vnode, oldVnode.data);
```

```js
let vm1 = new Vue({
    data() {
        return { name: 'Brave' }
    }
})
let render1 = compileToFunction('<div id="a">{{name}}</div>');
let oldVnode = render1.call(vm1)
let el1 = createElm(oldVnode);
document.body.appendChild(el1);

let vm2 = new Vue({
    data() {
        return { name: 'BraveWang' }
    }
})
let render2 = compileToFunction('<div class="b">{{name}}</div>');
let newVnode = render2.call(vm2);
setTimeout(() => {
    patch(oldVnode, newVnode);
}, 1000);
```

测试结果：
![](/images/手写vue2源码/（二十三）diff算法-节点比对/img6.png)

#### style 的处理

除了属性需要更新外，还有其他特殊属性也需要更新，如：style 样式

```js
let vm1 = new Vue({
    data() {
        return { name: 'Brave' }
    }
})
let render1 = compileToFunction('<div style="color:blue">{{name}}</div>');
let oldVnode = render1.call(vm1)
let el1 = createElm(oldVnode);
document.body.appendChild(el1);

let vm2 = new Vue({
    data() {
        return { name: 'BraveWang' }
    }
})
let render2 = compileToFunction('<div style="color:red">{{name}}</div>');
let newVnode = render2.call(vm2);
setTimeout(() => {
    patch(oldVnode, newVnode);
}, 1000);
```

新老元素都有 style，不能用当前逻辑 el.setAttribute(key, newProps[key])来处理
style 中是字符串类型，不能直接做替换，需要对样式属性进行收集，再进行比较和更新

```js
function updateProperties(vnode, oldProps = {} ) {
  let el = vnode.el;
  let newProps = vnode.data || {};

  let newStyly = newProps.style || {};  // 新样式对象
  let oldStyly = oldProps.style || {};  // 老样式对象

  // 老样式对象中有，新样式对象中没有，删掉多余样式
  for(let key in oldStyly){
    if(!newStyly[key]){
      el.style[key] = ''
    }
  }

  // 新样式对象中有，覆盖到老样式对象中
  for(let key in newProps){
    if(key == 'style'){ // 处理style样式
      for(let key in newStyly){
          el.style[key] = newStyly[key]
      }
    }else{
      el.setAttribute(key, newProps[key])
    }
  }

  for(let key in oldProps){
    if(!newProps[key]){
      el.removeAttribute(key)
    }
  }
}
```

更新前：
![](/images/手写vue2源码/（二十三）diff算法-节点比对/img7.png)

更新后：
![](/images/手写vue2源码/（二十三）diff算法-节点比对/img8.png)

至此，外层的 div 已经实现了 diff 更新，但内层 name 属性还并没有更新

接下来继续对比儿子节点

---
title: （二十四）diff算法-比对优化
order: 24
---

diff 算法 - 比对优化

<!-- more -->

## 比对儿子节点

### 前文回顾

上篇，通过构建两个虚拟节点来模拟 v-if 的效果，通过 patch 方法比对实现了外层节点的复用

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

执行结果：
初始化时为蓝色文本
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img1.png)

更新后变为红色文本
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img2.png)

发现问题：

仅更新了外层 div 的 style，但 name 并没有更新为 BraveWang，
即只做了第一层节点的比对和属性更新，没有进行深层的 diff 比对

### 如何比对儿子节点

把“新的儿子节点”和“老的儿子节点”都拿出来，依次进行比对

```js
//src/vdom/patch.js

/**
 * 将虚拟节点转为真实节点后插入到元素中
 * @param {*} el    当前真实元素 id#app
 * @param {*} vnode 虚拟节点
 * @returns         新的真实元素
 */
export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if(isRealElement){
    // 1，根据虚拟节点创建真实节点
    const elm = createElm(vnode);
    // 2，使用真实节点替换掉老节点
    const parentNode = oldVnode.parentNode;
    parentNode.insertBefore(elm, oldVnode.nextSibling);
    parentNode.removeChild(oldVnode);
    return elm;
  }else{// diff：新老虚拟节点比对
    if(!isSameVnode(oldVnode, vnode)){
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    }
    let el = vnode.el = oldVnode.el;
    if(!oldVnode.tag){
      if(oldVnode.text !== vnode.text){
        return el.textContent = vnode.text;
      }else{
        return;
      }
    }
    updateProperties(vnode, oldVnode.data);

    // TODO:比较儿子节点...
    let oldChildren = oldVnode.children || {};
    let newChildren = vnode.children || {};
  }
}
```

### 新老儿子节点的几种情况

> 情况 1：老的有儿子，新的没有儿子
> 情况 2：老的没有儿子，新的有儿子
> 情况 3：新老都有儿子

#### 情况 1：老的有儿子，新的没有儿子

处理方法：直接将多余的老 dom 元素删除即可

```js
// src/vdom/patch.js#patch

...
// 比较儿子节点
let oldChildren = oldVnode.children || {};
let newChildren = vnode.children || {};

// 情况 1：老的有儿子，新的没有儿子；直接将多余的老 dom 元素删除即可；
if(oldChildren.length > 0 && newChildren.length == 0){
  // 更好的处理：由于子节点中可能包含组件，需要封装removeChildNodes方法，将子节点全部删掉
  el.innerHTML = '';// 暴力写法直接清空；
}
```

备注：这里直接清空 innerHTML 是暴力写法；由于子节点中可能包含组件，所以更好的处理方式是封装一个 removeChildNodes 方法，用于删掉全部子节点

测试方法：

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
let render2 = compileToFunction('<div style="color:red"></div>');
let newVnode = render2.call(vm2);

setTimeout(() => {
    patch(oldVnode, newVnode);
}, 1000);
```

#### 情况 2：老的没有儿子，新的有儿子

处理方法：直接将新的儿子节点放入对应的老节点中即可；

```js
//src/vdom/patch.js#patch

...
// 比较儿子节点
let oldChildren = oldVnode.children || {};
let newChildren = vnode.children || {};

// 情况 1：老的有儿子，新的没有儿子；直接将多余的老 dom 元素删除即可；
if(oldChildren.length > 0 && newChildren.length == 0){
  el.innerHTML = '';
// 情况 2：老的没有儿子，新的有儿子；直接将新的儿子节点放入对应的老节点中即可
}else if(oldChildren.length == 0 && newChildren.length > 0){
  newChildren.forEach((child)=>{// 注意：这里的child是虚拟节点，需要变为真实节点
    let childElm = createElm(child); // 根据新的虚拟节点，创建一个真实节点
    el.appendChild(childElm);// 将生成的真实节点，放入 dom
  })
}
```

备注：newChildren 中的 child 为虚拟节点，需要先通过 createElm(child)创建为真实节点

测试：

```js
let vm1 = new Vue({
    data() {
        return { name: 'Brave' }
    }
})
let render1 = compileToFunction('<div style="color:blue"></div>');
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

#### 情况 3：新老都有儿子

处理方法：进行 diff 比对

```js
// src/vdom/patch.js#patch

...
// 比较儿子节点
let oldChildren = oldVnode.children || {};
let newChildren = vnode.children || {};

// 情况 1：老的有儿子，新的没有儿子；直接将对于的老 dom 元素干掉即可;
if(oldChildren.length > 0 && newChildren.length == 0){
  el.innerHTML = '';
// 情况 2：老的没有儿子，新的有儿子；直接将新的儿子节点放入对应的老节点中即可
}else if(oldChildren.length == 0 && newChildren.length > 0){
  newChildren.forEach((child)=>{
    let childElm = createElm(child);
    el.appendChild(childElm);
  })
// 情况 3：新老都有儿子
}else{
  // diff 比对的核心逻辑
  updateChildren(el, oldChildren, newChildren);
}
```

这里对“老的有儿子，新的没有儿子”和“老的没有儿子，新的有儿子”两种特殊情况做了特殊的处理接下来，当新老节点都有儿子时，就必须进行 diff 比对了；所以，updateChildren 才是 diff 算法的核心；

## 新老儿子 diff 比对的核心逻辑 updateChildren 方法

### 新老儿子 diff 比对方案介绍

继续，当新老节点都有儿子时，就需要对新老儿子节点进行比对了
新老节点的比对方案是：采用头尾双指针的方式，进行新老虚拟节点的依次比对
每次节点比对完成，如果是头节点就向后移动指针，尾节点就向前移动指针；

![](/images/手写vue2源码/（二十四）diff算法-比对优化/img3.png)

直至一方遍历完成，比对才结束；
即："老的头指针和尾指针重合"或"新的头指针和尾指针重合"；

![](/images/手写vue2源码/（二十四）diff算法-比对优化/img4.png)

这里，为了能够提升 diff 算法的性能，并不会直接全部采用最耗性能的“乱序比对”

而是结合了日常使用场景，优先对 4 种特殊情况进行了特殊的除了：头头、尾尾、头尾、尾头

> 头和头比较，将头指针向后移动；
> 尾和尾比较，将尾指针向前移动；
> 头和尾比较，将头指针向后移动，尾指针向前移动；
> 尾和尾比较，将尾指针向后移动，头指针向前移动；

每次比对时，优先进行头头、尾尾、头尾、尾头的比对尝试，如果都没有命中才会进行乱序比较

### diff 比对的几种特殊情况（头头、尾尾、头尾、尾头）

除了这 4 钟特殊情况外，就只能进行乱序比对了

虽然是做乱序比对，但目标依然是最大程度实现节点复用，提升渲染性能；

## 比对优化

### 节点比对的结束条件

直至新老节点一方遍历完成，比对才结束；

即："老的头指针和尾指针重合"或"新的头指针和尾指针重合"；

![](/images/手写vue2源码/（二十四）diff算法-比对优化/img4.png)

此时，就是循环中最后一次比对了，D 节点比对完成后节点继续后移

与老节点比对完成后（已经识别了可复用的节点），继续将新增节点 E 添加到老儿子节点中

代码实现：

```js
// src/vdom/patch.js

/**
 * 新老都有儿子时做比对，即 diff 算法核心逻辑
 * 备注：采用头尾双指针的方式；优化头头、尾尾、头尾、尾头的特殊情况；
 * @param {*} el
 * @param {*} oldChildren  老的儿子节点
 * @param {*} newChildren  新的儿子节点
 */
function updateChildren(el, oldChildren, newChildren) {

    // 声明头尾指针
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[0];
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex];

    let newStartIndex = 0;
    let newStartVnode = newChildren[0];
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex];

    // 循环结束条件：有一方遍历完了就结束；即"老的头指针和尾指针重合"或"新的头指针和尾指针重合"
    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
        // 1，优先做4种特殊情况比对：头头、尾尾、头尾、尾头
        // 2，如果没有命中，采用乱序比对
        // 3，比对完成后移动指针，继续下一轮比对
    }

    // 比对完成后
    // 新的多，插入新增节点，删除多余节点
}
```

备注：由于 diff 算法采用了 while 循环处理，所以复杂度为 O(n)

### 情况 1：新儿子比老儿子多，插入新增的

分为“从头部开始移动指针”和“从尾部部开始移动指针”两种情况

#### 从头部开始移动指针

头头比对：

第一次比配，匹配后移动新老头指针：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img5.png)

第二次匹配，匹配后移动新老头指针：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img6.png)

直至老节点的头尾指针重合，此时，D 节点是 while 最后一次做比对：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img7.png)

比对完成后，指针继续后移，导致老节点的头指针越过尾指针，此时 while 循环结束；

while 循环结束时的指针状态如下：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img8.png)

此时，新节点的头指针指向的节点 E 为新增节点，后面可能还有 F G H 等新增节点，需要将它们（ 指从 newStartIndex 到 newEndIndex 所有节点），添加到老节点儿子集合中

代码实现：

```js
while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
    // 头头比对：
    if(isSameVnode(oldStartVnode, newStartVnode)){
        // isSameVnode只能判断标签和key一样，但属性可能还有不同
        // 所以需要patch方法递归更新新老虚拟节点的属性
        patch(oldStartVnode, newStartVnode);
        // 更新新老头指针和新老头节点
        oldStartVnode = oldStartVnode[++oldStartIndex];
        newStartVnode = newStartVnode[++newStartIndex];
    }
}

// 1，新的多，插入新增的
if(newStartIndex <= newEndIndex){
    // 新的开始指针和新的结束指针之间的节点
    for(let i = newStartIndex; i <= newEndIndex; i++){
       // 获取对应的虚拟节点，并生成真实节点，添加到 dom 中
       el.appendChild(createElm(newChildren[i]))
    }
}h
```

测试效果：

```js
let render1 = compileToFunction(`<div>
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
</div>`);

let render2 = compileToFunction(`<div>
    <li key="A" style="color:red">A</li>
    <li key="B" style="color:blue">B</li>
    <li key="C" style="color:yellow">C</li>
    <li key="D" style="color:pink">D</li>
    <li key="E">E</li>
    <li key="F">F</li>
</div>`);
```

更新前：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img9.png)

更新后：

![](/images/手写vue2源码/（二十四）diff算法-比对优化/img10.png)

备注：
将新儿子中新增的节点直接向后添加到老儿子集合中，使用 appendChild 即可
但是，如果新增的节点在头部，就不能用 appendChild 了，见下面尾尾比对分析；

#### 从尾部开始移动指针

尾尾比对：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img11.png)

指针向前移动，当老节点的头尾指针重合，即 while 循环的最后一次比对：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img12.png)

比对完成指针向前移动后，循环结束时的指针状态如下：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img13.png)

while 比对完成后，需要将剩余新节点添加到老儿子中的对应位置
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img14.png)

问题：如何向头部位置新增节点
问题：如何将新增节点 E、F 放到 A 的前面？

分析：

1. 要加到 A 节点前，不能继续使用 appendChild 向后追加节点
2. 前面的代码是指“从新的头指针到新的尾指针”这一区间的节点，即 for (let i = newStartIndex; i <= newEndIndex; i++) 所以是先处理 E 节点，在处理 F 节点

先处理 E 节点，将 E 节点方到 A 节点前的位置：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img15.png)

再处理 F 节点，将 F 节点插入到 A 节点与 E 节点之间的位置：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img16.png)

当新增区域的头尾指针重合，即为最后一次处理；

方案：

新增节点有可能追加到后面，也有可能插入到前面

1. 头头比较时，将新增节点添加到老儿子集合中即可，使用 appendChild 追加
2. 尾尾比较时，

如何确认该向前还是向后添加节点？

要看 while 循环结束时，newChildren[newEndIndex + 1]新儿子的尾指针是否有节点
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img17.png)

1. 如果有节点，说明是从尾向头进行比对的，新增节需要点添加到老儿子集合前面，使用 insertBefore 插入指定位置
2. 如果无节点，说明是从头向尾进行比对的，新增节需要点追加到老儿子集合后面，使用 appendChild 追加

代码实现：

```js
// 1，新的多（以新指针为参照）插入新增
if (newStartIndex <= newEndIndex) {
  // 新的开始指针和新的结束指针之间的节点
  for (let i = newStartIndex; i <= newEndIndex; i++) {
    // 判断当前尾节点的下一个元素是否存在：
    //  1，如果存在：则插入到下一个元素的前面
    //  2，如果不存在（下一个是 null） ：就是 appendChild
    // 取参考节点 anchor:决定新节点放到前边还是后边
    //  逻辑：取去newChildren的尾部+1,判断是否为 null
    //  解释：如果有值说明是向前移动的，取出此虚拟元素的真实节点el，将新节点添加到此真实节点前即可
    let anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
    // 获取对应的虚拟节点，并生成真实节点，添加到 dom 中
    // el.appendChild(createElm(newChildren[i]))
    // 逻辑合并:将 appendChild 改为 insertBefore
    //  效果：既有appendChild又有insertBefore的功能，直接将参考节点放进来即可;
    //  解释：对于insertBefore方法,如果anchor为null，等同于appendChild;如果有值，则是insertBefore;
    el.insertBefore(createElm(newChildren[i]),anchor)
  }
}
```

备注：注意这里的 el.insertBefore 妙用，当 insertBefore 方法的第二个参数为 null 时，等同于 appendChild 方法

### 情况 2：老儿子比新儿子多，删除多余

```js
let render1 = compileToFunction(`<div>
    <li key="A" style="color:red">A</li>
    <li key="B" style="color:blue">B</li>
    <li key="C" style="color:yellow">C</li>
    <li key="D" style="color:pink">D</li>
</div>`);

let render2 = compileToFunction(`<div>
    <li key="A" style="color:red">A</li>
    <li key="B" style="color:blue">B</li>
    <li key="C" style="color:yellow">C</li>
</div>`);
```

![](/images/手写vue2源码/（二十四）diff算法-比对优化/img18.png)

老的比新的多，在移动过程中就会出现：新的已经到头了时，老的还有

当移动结束时：老的头指针会和尾指针重合，新的头指针会越过新的尾指针

![](/images/手写vue2源码/（二十四）diff算法-比对优化/img19.png)

代码实现：

将老儿子集合，“从头指针到尾指针”区域的多余真实节点删除

```js
// 2，老儿子比新儿子多，（以旧指针为参照）删除多余的真实节点
if(oldStartIndex <= oldEndIndex){
  for(let i = oldStartIndex; i <= oldEndIndex; i++){
    let child = oldChildren[i];
    el.removeChild(child.el);
  }
}
```

### 情况 3：反序情况

反序情况
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img20.png)

这种情况下，可以使用“旧的头指针”和“新的尾指针”进行比较，即头尾比较
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img21.png)

每次比较完成后，“旧的头指针”向后移动，“新的尾指针”向前移动
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img22.png)

并且比较完成后，直接将老节点 A 放到老节点最后去
更确切的说，是插入到尾指针的下一个节点的前面（移动前，尾指针指向的 D 节点的下一个节点为 null）

继续比较 B，比较完成后移动指针
移动 B ：插入到尾指针的下一个的前面（这时尾指针 D 的下一个是上一次移动过来的 A）
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img23.png)

继续 C 和 C 比，之后再移动指针：
移动 C ：插入到尾指针的下一个的前面（这时尾指针 D 的下一个是上一次移动过来的 B）
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img24.png)

接下来比较 D，此时会发现“旧的头指针”和“新的头指针”一样了，都是 D

这时就比较完成了，D 无需再移动，结果就是 D C B A（整个反序过程，共移动了 3 次，移动而不是重新创建）

所以，对于反序操作来说，需要去比对头尾指针（老的头和新的尾），

每次比对完成后头指针向后移，尾指针向左移

代码部分，添加“头尾比较”逻辑：

```js
while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
  if (isSameVnode(oldStartVnode, newStartVnode)) {
    patch(oldStartVnode, newStartVnode);
    oldStartVnode = oldChildren[++oldStartIndex];
    newStartVnode = newChildren[++newStartIndex];
  }else if(isSameVnode(oldEndVnode, newEndVnode)){
    patch(oldEndVnode, newEndVnode);
    oldEndVnode = oldChildren[--oldEndIndex];
    newEndVnode = newChildren[--newEndIndex];
    // 头尾比较：老的头节点和新的尾节点做对比
  }else if(isSameVnode(oldStartVnode, newEndVnode)){
    // patch方法只会duff比较并更新属性，但元素的位置不会变化
    patch(oldStartVnode, newEndVnode);// diff:包括递归比儿子
    // 移动节点：将当前的节点插入到最后一个节点的下一个节点的前面去
    el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
    // 移动指针
    oldStartVnode = oldChildren[++oldStartIndex];
    newEndVnode = newChildren[--newEndIndex];
  }
}
```

注意：

要先插入节点，再移动指针
insertBefore 是有移动效果的，会把原来的节点移走，这时 dom 的移动性
appendChild、insertBefore 操作 dom 都有移动性，都会吧原来的 dom 移走

测试效果：
更新前：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img25.png)

更新后：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img26.png)

同理尾头比对的情况：

```js
while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    }else if(isSameVnode(oldEndVnode, newEndVnode)){
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }else if(isSameVnode(oldStartVnode, newEndVnode)){
      patch(oldStartVnode, newEndVnode);
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    // 尾头比较
    }else if(isSameVnode(oldEndVnode, newStartVnode)){
      patch(oldEndVnode, newStartVnode);  // patch方法只会更新属性，元素的位置不会变化
      // 移动节点:将老的尾节点移动到老的头节点前面去
      el.insertBefore(oldEndVnode.el, oldStartVnode.el);// 将尾部插入到头部
      // 移动指针
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    }
}
```

测试效果：

```js
let render1 = compileToFunction(`<div>
    <li key="E">E</li>
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
</div>`);

let render2 = compileToFunction(`<div>
    <li key="D" style="color:pink">D</li>
    <li key="C" style="color:yellow">C</li>
    <li key="B" style="color:blue">B</li>
    <li key="A" style="color:red">A</li>
</div>`);
```

更新前：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img27.png)

更新后：
![](/images/手写vue2源码/（二十四）diff算法-比对优化/img28.png)

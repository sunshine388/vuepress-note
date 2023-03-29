---
title: （二十五）diff算法-乱序比对
order: 25
---

diff 算法-乱序比对

<!-- more -->

## 乱序比对

### 前文回顾

之前两篇主要介绍了，在进行乱序比对前针对几种特殊情况的处理，以提升比对性能：

1. 一方有儿子，一方没有儿子；老的有儿子，新的没有儿子：直接将多余的老 dom 元素删除即可；老的没有儿子，新的有儿子：直接将新的儿子节点放入对应的老节点中即可；
2. 新老节点都有儿子时，进行头头、尾尾、头尾、尾头对比；
3. 头头、尾尾、头尾、尾头均没有命中时，进行乱序比对

本篇主要介绍 diff 算法的乱序比对，目标是尽可能复用老节点，以提升渲染性能；

### 乱序比对方案

这种情况下，头头、尾尾、头尾、尾头都不相同

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img1.png)

理想情况下，A、B 节点是可以被复用的：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img2.png)

方案：

以新节点为主，以老节点做参照，

到老儿子集合中去找能复用的节点，再将不能复用老节点删掉；

创建一个映射关系：

根据老儿子集合创建一个节点 key 和索引 index 的映射关系 mapping，

用新节点依次到老的索引列表中查找是否存在，如果存在就复用；

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img3.png)

### 乱序比对过程分析

1，先比对一下头头、尾尾、头尾、尾头，没有命中：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img4.png)

查找 F 是否在映射关系中，不在，直接做插入操作：插入到老的头指针前面的位置

即：将 F 节点插入到 A 节点的前面，并将新的头指针向后移动：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img5.png)

2，再对比一下头头、尾尾、头尾、尾头，还是没有命中：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img6.png)

继续查找 B 是否在映射关系中，B 在映射关系中，复用 B 节点并做移动操作：将复用节点移动到头指针指向节点的前面

即：将老的 B 节点移动到 A 节点的前面，并将新的头指针向后移动：

备注：由于原来的 B 节点被移动走了，所以之前的空位置要做标记，后续指针移动至此直接跳过

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img7.png)

3，继续比对一次头头、尾尾、头尾、尾头，这时发现头和头相同，命中了头头比对：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img8.png)

这时，按照头头比对的逻辑：老的头指针向后移动，新头指针也向后移动；（同理，如果这里命中了尾尾比对，就将新老尾指针都向前进行移动；）

但由于之前 B 节点已经移动到 A 节点前面了，所以老的头指针跳过原始 B 节点位置，直接移动到 C 位置：

备注：这里就使用到了之前 B 节点移动走后所做的空位置标记；

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img9.png)

4，继续比对一次头头、尾尾、头尾、尾头，没有命中：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img10.png)

查找 E 是否在映射关系中，不在，直接做插入操作：插入到老的头指针前面的位置

即：将 E 节点插入到 C 节点的前面，并将新的头指针向后移动：

备注：永远是插入到老的头指针前面的位置

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img11.png)

5，继续比对一次头头、尾尾、头尾、尾头，没有命中：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img12.png)

查找 G 是否在映射关系中，不在，直接做插入操作：插入到老的头指针前面的位置 6，

即：将 G 节点插入到 C 节点的前面，并将新的头指针向后移动：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img13.png)

6，由于新儿子数组已全部比对完成，剩余的老节点直接删除即可，

依次删除“从老的头节点到老的尾节点”区域的全部节点：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img14.png)

所以，最终结果为 F B A E G；其中，A、B 节点实现了节点复用；

## 代码实现

### 新老节点更新示例

```js
let render1 = compileToFunction(`<div>
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
</div>`);

let render2 = compileToFunction(`<div>
    <li key="F" style="color:pink">F</li>
    <li key="B" style="color:yellow">B</li>
    <li key="A" style="color:blue">A</li>
    <li key="E" style="color:red">E</li>
    <li key="P" style="color:red">P</li>
</div>`);
```

### 创造映射关系

根据老儿子集合创建节点 key 与索引 index 的映射关系 mapping：

```js
// src/vdom/patch.js#updateChildren#makeKeyByIndex

function updateChildren(el, oldChildren, newChildren) {
  // ...

  /**
   * 根据children创建映射
   */
  function makeKeyByIndex(children) {
    let map = {};
    children.forEach((item, index) => {
      map[item.key] = index;
    });
    console.log(map);
    debugger;
    return map;
  }

  let mapping = makeKeyByIndex(oldChildren);

  // ...
}
```

测试：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img15.png)

### 处理步骤

> 筛查：看新节点在老的里面是否存在，到 mapping 中去筛查
>
> 没有，将当前比对的新节点插入到老的头指针对用的节点前面
>
> 有，需要复用，将当前比对的老节点移动到老的头指针前面
>
> 复用步骤：插入 dom、patch 更新属性，原位置置空，指针移动

```js
while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
  // 当前循环开始时，先处理当前的oldStartVnode和oldEndVnode为空的情况；
  // 原因：节点之前被移走时置空，直接跳过
  if (!oldStartVnode) {
    oldStartVnode = oldChildren[++oldStartIndex];
  } else if (!oldEndVnode) {
    oldEndVnode = oldChildren[--oldEndIndex];
  } else if (isSameVnode(oldStartVnode, newStartVnode)) {
    // 头头比较
    // ...
  } else if (isSameVnode(oldEndVnode, newEndVnode)) {
    // 尾尾比较
    // ...
  } else if (isSameVnode(oldStartVnode, newEndVnode)) {
    // 头尾比较
    // ...
  } else if (isSameVnode(oldEndVnode, newStartVnode)) {
    // 尾头比较
    // ...
  } else {
    // 前面4种逻辑（头头、尾尾、头尾、尾头）,主要是考虑到用户使用时的一些特殊场景，但也有非特殊情况，如：乱序排序
    // 筛查当前新的头指针对应的节点在mapping中是否存在
    let moveIndex = mapping[newStartVnode.key];
    if (moveIndex == undefined) {
      // 没有，将当前比对的新节点插入到老的头指针对用的节点前面
      // 将当前新的虚拟节点创建为真实节点，插入到老的开始节点前面
      el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
    } else {
      // 有,需要复用
      // 将当前比对的老节点移动到老的头指针前面
      let moveVnode = oldChildren[moveIndex]; // 从老的队列中找到可以被复用的这个节点
      el.insertBefore(moveVnode.el, oldStartVnode.el);
      // 复用：位置移动完成后，还要对比并更新属性
      patch(moveVnode, oldStartVnode);
      // 由于复用的节点在oldChildren中被移走了,之前的位置要标记为空(指针移动时，跳过会使用)
      oldChildren[moveIndex] = undefined;
    }
    // 每次处理完成后，新节点的头指针都需要向后移动
    // 备注：
    //     无论节点是否可复用，新指针都会向后移动，所以最后统一处理；
    //    节点可复用时，老节点的指针移动会在4种特殊情况中被处理完成；
    newStartVnode = newChildren[++newStartIndex];
  }
}
```

### 删除多余的老节点

注意：由于在新旧节点的对比时，有可能已经将部分节点移动走了，移走时置为了 undefined

所以此时删除多余节点时，有可能这个新老指针的区间中包含这 undefined 的节点，需要跳过去

```js
// 2，旧的多，（以旧指针为参照）删除多余的真实节点
if (oldStartIndex <= oldEndIndex) {
  for (let i = oldStartIndex; i <= oldEndIndex; i++) {
    let child = oldChildren[i];
    // child有值时才删除；原因：节点有可能在移走时被置为undefined
    child && el.removeChild(child.el);
  }
}
```

### 测试乱序比对更新

更新前：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img16.png)

更新后：

![](/images/手写vue2源码/（二十五）diff算法-乱序比对/img17.png)

节点更新情况：

> A 节点复用，只更新了颜色
>
> F、E、G 均为新增节点
>
> B 节点仅做了移动操作

这样，就尽可能的复用了老节点；

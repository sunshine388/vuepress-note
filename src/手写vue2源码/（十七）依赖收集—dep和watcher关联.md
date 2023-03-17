---
title: （十七）依赖收集—dep和watcher关联
order: 17
---

依赖收集

<!-- more -->

## 依赖收集的过程分析

### Vue 的使用

备注：当前仅考虑单个根组件的更新，暂不涉及多组件更新；

同一数据可能被多个视图（页面或组件）所共享，如 Vuex 中的数据：

> A 组件，使用了数据 name；
> B 组件，使用了数据 name；
> 即 name 依赖了 A，B 两个组件；
> 当数据发生变化时，两个组件都会触发对应视图更新操作；

当响应式数据发生变化时，会触发对应视图的更新
这就需要知道数据和视图间的关系，从而准确触发该数据对应视图的更新操作
这就涉及到 Vue 依赖收集的过程

### dep 和 watcher

在 Vue 中，依赖收集的实现使用了观察者模式：
每个数据具有一个 dep 属性：用于记录使用该数据的组件或页面的视图渲染函数 watcher
当数据发生变化时，dep 属性中存放的多个 watcher 将会被通知，
watcher 就会调用自身对应的更新方法 update，完成页面的重新渲染；

> 为 name 添加属性 dep：用于收集组件 A 和 组件 B 的渲染逻辑 watcherA，watcherB
> 为 watcherA，watcherB 添加各自的更新方法 update
> 当数据发生变化时，通知 dep 中存放的 watcherA，，watcherB 触发各个的更新方法 update

由于同一个数据可能在多个页面或组件中被渲染，所以一个 dep 可以对应多个 watcher；
由于同一个视图可能包含多个数据，所以一个 watcher 可以对应多个 dep；
综上，dep 和 watcher 是多对多关系

通过前面文章可知，vm.\_update(vm.\_render()) 执行了数据渲染和更新操作
watcher 中的 update 方法，便是触发了 vm.\_update(vm.\_render()) 重新进行数据渲染和视图更新
所以，需要将 vm.\_update(vm.\_render())改造为可以通过 watcher 调用的方法

### 其他

数据响应式过程中，为每个属性扩展 dep，用于收集 watcher，当数据渲染时，记录 watcher；
当同一数据在同一视图中被多次使用时，dep 中应只记录一次 watcher，需对 watcher 进行查重；
防止只要一修改数据就会渲染视图的情况：当数据在视图中没有被使用时，数据的变化不应触发 watcher 渲染，需要在视图渲染时进行依赖收集；

## Watcher 部分

### watcher 的本质

之前分析可知：
vm.\_render：调用 render 方法
vm.\_update：将虚拟节点更新到页面上
本质上，vm.\_update(vm.\_render())就可以触发视图的更新

```js
let vm = new Vue({
  el: '#app',
  data() {
    return { name: "Brave" , age: 123}
  }
});

vm.name = "Brave Wang";   // 数据改变
vm._update(vm._render()); // 视图更新
```

在 Vue 中，数据更新： 1.每个数据有一个 dep 属性：记录使用该数据的组件或页面的视图渲染函数 watcher 2.当数据发生变化时，dep 属性中存放的多个 watcher 将会被通知，这里是观察者模式 3.这里的 watcher 就相当于 vm.\_update(vm.\_render())

### 抽取视图更新逻辑 watcher

将视图渲染逻辑抽取成为可调用函数：

```js
export function mountComponent(vm) {
  // 抽取成为一个可被调用的函数
  let updateComponent = ()=>{
    vm._update(vm._render());
  }
  updateComponent();
}
```

最终的目标是：让 updateComponent 方法通过 watcher 被调用

### 创建 Watcher 类

数据改变，视图更新，所以 watcher 应所属于响应式模块
创建 watcher 类：

```js
// src/observe/watcher.js

class Watcher {
  constructor(vm, fn, cb, options){
    this.vm = vm;
    this.fn = fn;
    this.cb = cb;
    this.options = options;

    this.getter = fn; // fn 为页面渲染逻辑
    this.get();
  }

  get(){
    this.getter();  // 调用页面渲染逻辑
  }
}
export default Watcher;
```

将页面更新逻辑 updateComponent 注入到 Watcher 类中，
再考虑如何通过 watcher 调用页面更新方法 updateComponent

```js
export function mountComponent(vm) {
  let updateComponent = ()=>{
    vm._update(vm._render());
  }

  // 渲染 watcher ：每个组件都有一个 watcher
  new Watcher(vm, updateComponent, ()=>{
    console.log('Watcher-update')
  },true)
}
```

### 依赖收集的必要性

数据改变时，会被劫持进入 Object.defineProperty 的 set 方法
那么，如果在此时调用了视图更新逻辑，是不是就可以做到“数据变化，视图更新”了?

```js
// src/observe/index.js#defineReactive
Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return
      vm._update(vm._render());  // 当数据变化时，触发视图更新
      observe(newValue);
      value = newValue;
    }
})
```

这样做，虽然可以实现视图的更新
但是，有一个严重的问题： 1.此时，由于所有的响应式数据被修改时都会进入 set 方法， 2.导致未被视图使用的数据变化也会触发页面的更新， 3.即这种做法会触发不必要的视图更新
所以，在视图渲染过程中，被使用的数据需要被记录下来，并且只针对这些数据的变化触发视图更新
这就需要做依赖收集，需要创建为属性创建 dep 用来收集渲染 watcher

## Dep 部分

### 创建 Dep 类

前面说过： 1.每一个数据都有一个 dep 属性，用于存放对应的 watcher； 2.每一个 watcher 中，也可能有多个 dep
所以，Dep 类中要有一个添加 watcher 的方法；Watcher 类中 也要有一个添加 dep 的方法；
当数据变化时，通知数据 dep 属性中的所有 watcher 执行视图更新，应用了观察者模式
为了标识 Dep 的唯一性，每次 new Dep 时添加一个唯一 id；

```js
// src/observe/dep.js

let id = 0;

class Dep {
  constructor(){
    this.id = id++;
    this.subs = [];
  }
  // 保存数据的渲染 watcher
  depend(){
    this.subs.push(Dep.target)
  }
}

Dep.target = null;  // 静态属性

export default Dep
```

### 为属性添加 dep 属性

Object.defineProperty 时会为每个数据添加属性,在此时为属性添加 dep：

```js
function defineReactive(obj, key, value) {
  observe(value);
  let dep = new Dep();  // 为每个属性添加一个 dep
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return
      observe(newValue);
      value = newValue;
    }
  })
}
```

当视图渲染时，会走 Watcher 中的 get 方法，即 vm.\_update(vm.\_render())
此时，利用 JS 的单线程特性，在即将进行渲染前，记录当前渲染 watcher

```js
class Watcher {
  constructor(vm, fn, cb, options){
    this.vm = vm;
    this.fn = fn;
    this.cb = cb;
    this.options = options;

    this.getter = fn;
    this.get();
  }
  get(){
    Dep.target = this;  // 在触发视图渲染前，将 watcher 记录到 Dep.target 上
    this.getter();      // 调用页面渲染逻辑
    Dep.target = null;  // 渲染完成后，清除 Watcher 记录
  }
}
export default Watcher
```

在视图渲染的过程中，将会触发数据的取值，如：vm.name
此时，进入 Object.defineProperty 中 get 方法
所以，如果 get 方法中 Dep.target 有值（即当前 watcher），就让数据的 dep 记住渲染 watcher

```js
function defineReactive(obj, key, value) {
  observe(value);
  let dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      if(Dep.target){
        dep.depend();
      }
      return value;
    },
    set(newValue) {
      if (newValue === value) return
      observe(newValue);
      value = newValue;
    }
  })
}
```

这样，dep 会记住所有渲染 watcher，未参与视图渲染的数据更新时，不会触发视图更新

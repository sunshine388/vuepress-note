---
title: vue框架篇
order: 5
---

vue 相关面试题

<!-- more -->

## 对于 MVVM 的理解

> MVVM 是 Model-View-ViewModel 的缩写

- Model 代表数据模型，也可以在 Model 中定义数据修改和操作的业务逻辑。
- View 代表 UI 组件，它负责将数据模型转化成 UI 展现出来。
- ViewModel 监听模型数据的改变和控制视图行为、处理用户交互，简单理解就是一个同步 View 和 Model 的对象，连接 Model 和 View

> - 在 MVVM 架构下， View 和 Model 之间并没有直接的联系，而是通过 ViewModel 进行交互， Model 和 ViewModel 之间的交互是双向的， 因此 View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上。
> - ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作 DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理

## 请详细说下你对 vue 生命周期的理解

> 答：总共分为 8 个阶段创建前/后，载入前/后，更新前/后，销毁前/后

- 创建前/后： 在 beforeCreate 阶段， vue 实例的挂载元素 el 和数据对象 data 都为 undefined ，还未初始化。在 created 阶段， vue 实例的数据对象 data 有了，el 还没有
- 载入前/后：在 beforeMount 阶段， vue 实例的 $el 和 data 都初始化了，但还是挂载之前为虚拟的 dom 节点， data.message 还未替换。在 mounted 阶段， vue 实例挂载完成， data.message 成功渲染。
- 更新前/后：当 data 变化时，会触发 beforeUpdate 和 updated 方法
- 销毁前/后：在执行 destroy 方法后，对 data 的改变不会再触发周期函数，说明此时 vue 实例已经解除了事件监听以及和 dom 的绑定，但是 dom 结构依然存在

**什么是 vue 生命周期？**

- 答： Vue 实例从创建到销毁的过程，就是生命周期。从开始创建、初始化数据、编译模板、挂载 Dom→ 渲染、更新 → 渲染、销毁等一系列过程，称之为 Vue 的生命周期。

**vue 生命周期的作用是什么？**

- 答：它的生命周期中有多个事件钩子，让我们在控制整个 Vue 实例的过程时更容易形成好的逻辑。

**vue 生命周期总共有几个阶段？**

- 答：它可以总共分为 8 个阶段：创建前/后、载入前/后、更新前/后、销毁前/销毁后。

**第一次页面加载会触发哪几个钩子？**

- 答：会触发下面这几个 beforeCreate 、 created 、 beforeMount 、 mounted 。

**DOM 渲染在哪个周期中就已经完成？**

- 答： DOM 渲染在 mounted 中就已经完成了

### 生命周期钩子函数

- 在 beforeCreate 钩子函数调用的时候，是获取不到 props 或者 data 中的数据的，因为这些数据的初始化都在 initState 中。
- 然后会执行 created 钩子函数，在这一步的时候已经可以访问到之前不能访问到的数据，但是这时候组件还没被挂载，所以是看不到的。
- 接下来会先执行 beforeMount 钩子函数，开始创建 VDOM ，最后执行 mounted 钩子，并将 VDOM 渲染为真实 DOM 并且渲染数据。组件中如果有子组件的话，会递归挂载子组件，只有当所有子组件全部挂载完毕，才会执行根组件的挂载钩子。
- 接下来是数据更新时会调用的钩子函数 beforeUpdate 和 updated ，这两个钩子函数没什么好说的，就是分别在数据更新前和更新后会调用。
- 另外还有 keep-alive 独有的生命周期，分别为 activated 和 deactivated 。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数。
- 最后就是销毁组件的钩子函数 beforeDestroy 和 destroyed 。前者适合移除事件、定时器等等，否则可能会引起内存泄露的问题。然后进行一系列的销毁操作，如果有子组件的话，也会递归销毁子组件，所有子组件都销毁完毕后才会执行根组件的 destroyed 钩子函数

## 说一下 Vue 的双向绑定数据的原理

vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的 setter ， getter ，在数据变动时发布消息给订阅者，触发相应的监听回调

## Vue 实现数据双向绑定的原理：Object.defineProperty()

- vue 实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的 setter ， getter ，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty() 将它们转为 getter/setter 。用户看不到 getter/setter ，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。
- vue 的数据双向绑定 将 MVVM 作为数据绑定的入口，整合 Observer ， Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 的数据变化，通过 Compile 来解析编译模板指令（ vue 中是用来解析 `{{}}` ），最终利用 watcher 搭起 observer 和 Compile 之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（ input ）—>数据 model 变更双向绑定效果。

## 响应式原理

> Vue 内部使用了 Object.defineProperty() 来实现数据响应式，通过这个函数可以监听到 set 和 get 的事件

```js
var data = { name: 'poetries' }
observe(data)
let name = data.name // -> get value
data.name = 'yyy' // -> change value
function observe(obj) {
  // 判断类型
  if (!obj || typeof obj !== 'object') {
    return
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}
function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val)
  Object.defineProperty(obj, key, {
    // 可枚举
    enumerable: true,
    // 可配置
    configurable: true,
    // 自定义函数
    get: function reactiveGetter() {
      console.log('get value')
      return val
    },
    set: function reactiveSetter(newVal) {
      console.log('change value')
      val = newVal
    }
  })
}
```

> 以上代码简单的实现了如何监听数据的 set 和 get 的事件，但是仅仅如此是不够的，因为自定义的函数一开始是不会执行的。只有先执行了依赖收集，从能在属性更新的时候派发更新，所以接下来我们需要先触发依赖收集

```js
<div>
  {{name}}
</div>
```

- 在解析如上模板代码时，遇到 就会进行依赖收集。
- 接下来我们先来实现一个 Dep 类，用于解耦属性的依赖收集和派发更新操作

```js
// 通过 Dep 解耦属性的依赖和更新操作
class Dep {
  constructor() {
    this.subs = []
  }
  // 添加依赖
  addSub(sub) {
    this.subs.push(sub)
  }
  // 更新
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
// 全局属性，通过该属性配置 Watcher
Dep.target = null
```

> 以上的代码实现很简单，当需要依赖收集的时候调用 addSub ，当需要派发更新的时候调用 notify 。
> 接下来我们先来简单的了解下 Vue 组件挂载时添加响应式的过程。在组件挂载时，会先对所有需要的属性调用 Object.defineProperty() ，然后实例化 Watcher ，传入组件更新的回调。在实例化过程中，会对模板中的属性进行求值，触发依赖收集。

触发依赖收集时的操作

```js
class Watcher {
  constructor(obj, key, cb) {
    // 将 Dep.target 指向自己
    // 然后触发属性的 getter 添加监听
    // 最后将 Dep.target 置空
    Dep.target = this
    this.cb = cb
    this.obj = obj
    this.key = key
    this.value = obj[key]
    Dep.target = null
  }
  update() {
    // 获得新值
    this.value = this.obj[this.key]
    // 调用 update 方法更新 Dom
    this.cb(this.value)
  }
}
```

> 以上就是 Watcher 的简单实现，在执行构造函数的时候将 Dep.target 指向自身，从而使得收集到了对应的 Watcher ，在派发更新的时候取出对应的 Watcher 然后执行 update 函数。

接下来，需要对 defineReactive 函数进行改造，在自定义函数中添加依赖收集和派发更新相关的代码

```js
function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val)
  let dp = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get value')
      // 将 Watcher 添加到订阅
      if (Dep.target) {
        dp.addSub(Dep.target)
      }
      return val
    },
    set: function reactiveSetter(newVal) {
      console.log('change value')
      val = newVal
      // 执行 watcher 的 update 方法
      dp.notify()
    }
  })
}
```

> 以上所有代码实现了一个简易的数据响应式，核心思路就是手动触发一次属性的 getter 来实现依赖收集。

现在我们就来测试下代码的效果，只需要把所有的代码复制到浏览器中执行，就会发现页面的内容全部被替换了

```js
var data = { name: 'poetries' }
observe(data)
function update(value) {
  document.querySelector('div').innerText = value
}
// 模拟解析到 '{{name}}' 触发的操作
new Watcher(data, 'name', update)
// update Dom innerText
data.name = 'yyy'
```

### Object.defineProperty 的缺陷

- 以上已经分析完了 Vue 的响应式原理，接下来说一点 Object.defineProperty 中的缺陷。
- 如果通过下标方式修改数组数据或者给对象新增属性并不会触发组件的重新渲染，因为 Object.defineProperty 不能拦截到这些操作，更精确的来说，对于数组而言，大部分操作都是拦截不到的，只是 Vue 内部通过重写函数的方式解决了这个问题。
- 对于第一个问题， Vue 提供了一个 API 解决

```js
export function set (target: Array<any> | Object, key: any, val: any): any {
  // 判断是否为数组且下标是否有效
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 调用 splice 函数触发派发更新
    // 该函数已被重写
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  // 判断 key 是否已经存在
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  // 如果对象不是响应式对象，就赋值返回
  if (!ob) {
    target[key] = val
    return val
  }
  // 进行双向绑定
  defineReactive(ob.value, key, val)
  // 手动派发更新
  ob.dep.notify()
  return val
}
```

对于数组而言， Vue 内部重写了以下函数实现派发更新

```js
// 获得数组原型
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
// 重写以下函数
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
methodsToPatch.forEach(function (method) {
  // 缓存原生函数
  const original = arrayProto[method]
  // 重写函数
  def(arrayMethods, method, function mutator (...args) {// 先调用原生函数获得结果
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    // 调用以下几个函数时，监听新数据
    switch (method) {
      case 'push':
      case 'unshift':
      inserted = args
      break
      case 'splice':
      inserted = args.slice(2)
      break
    }
    if (inserted) ob.observeArray(inserted)
    // 手动派发更新
    ob.dep.notify()
    return result
  })
})
```

### 编译过程

> 想必大家在使用 Vue 开发的过程中，基本都是使用模板的方式。那么你有过「模板是怎么在浏览器中运行的」这种疑虑嘛？

- 首先直接把模板丢到浏览器中肯定是不能运行的，模板只是为了方便开发者进行开发。Vue 会通过编译器将模板通过几个阶段最终编译为 render 函数，然后通过执行 render 函数生成 Virtual DOM 最终映射为真实 DOM 。
- 接下来我们就来学习这个编译的过程，了解这个过程中大概发生了什么事情。这个过程其中又分为三个阶段，分别为：

> - 将模板解析为 AST
> - 优化 AST
> - 将 AST 转换为 render 函数

在第一个阶段中，最主要的事情还是通过各种各样的正则表达式去匹配模板中的内容，然后
将内容提取出来做各种逻辑操作，接下来会生成一个最基本的 AST 对象

```js
{
  // 类型
  type: 1,
  // 标签
  tag,
  // 属性列表
  attrsList: attrs,
  // 属性映射
  attrsMap: makeAttrsMap(attrs),
  // 父节点
  parent,
  // 子节点
  children: []
}
```

- 然后会根据这个最基本的 AST 对象中的属性，进一步扩展 AST 。
- 当然在这一阶段中，还会进行其他的一些判断逻辑。比如说对比前后开闭标签是否一致，判断根组件是否只存在一个，判断是否符合 HTML5 Content Model 规范等等问题。
- 接下来就是优化 AST 的阶段。在当前版本下， Vue 进行的优化内容其实还是不多的。只是对节点进行了静态内容提取，也就是将永远不会变动的节点提取了出来，实现复用 Virtual DOM ，跳过对比算法的功能。在下一个大版本中， Vue 会在优化 AST 的阶段继续发力，实现更多的优化功能，尽可能的在编译阶段压榨更多的性能，比如说提取静态的属性等等优化行为。
- 最后一个阶段就是通过 AST 生成 render 函数了。其实这一阶段虽然分支有很多，但是最主要的目的就是遍历整个 AST ，根据不同的条件生成不同的代码罢了。

### NextTick 原理分析

> nextTick 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM 。

- 在 Vue 2.4 之前都是使用的 microtasks ，但是 microtasks 的优先级过高，在某些情况下可能会出现比事件冒泡更快的情况，但如果都使用 macrotasks 又可能会出现渲染的性能问题。所以在新版本中，会默认使用 microtasks ，但在特殊情况下会使用 macrotasks ，比如 v-on 。
- 对于实现 macrotasks ，会先判断是否能使用 setImmediate ，不能的话降级为 MessageChannel ，以上都不行的话就使用 setTimeout

```js
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (
  typeof MessageChannel !== 'undefined' &&
  (isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]')
) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

以上代码很简单，就是判断能不能使用相应的 API

## vue 组件通讯方式有哪些方法

- props 和$emit 父组件向子组件传递数据是通过 prop 传递的，子组件传递数据给父组件是通过$emit 触发事件来做到的
- $parent,$children 获取当前组件的父组件和当前组件的子组件
- $attrs 和$listeners A->B->C。Vue 2.4 开始提供了$attrs 和$listeners 来解决这个问题
- 父组件中通过 provide 来提供变量，然后在子组件中通过 inject 来注入变量。(官方不推荐在实际业务中使用，但是写组件库时很常用)
- $refs 获取组件实例
- envetBus 兄弟组件数据传递 这种情况下可以使用事件总线的方式
- vuex 状态管理

## Vue 组件间的参数传递

父组件与子组件传值

- 父组件传给子组件：子组件通过 props 方法接受数据；
- 子组件传给父组件： $emit 方法传递参数

非父子组件间的数据传递，兄弟组件传值

- eventBus ，就是创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件。项目比较小时，用这个比较合适（虽然也有不少人推荐直接用 VUEX ，具体来说看需求）

## Vue 的路由实现：hash 模式 和 history 模式

- hash 模式：在浏览器中符号 “#” ，#以及#后面的字符称之为 hash ，用 window.location.hash 读取。特点： hash 虽然在 URL 中，但不被包括在 HTTP 请求中；用来指导浏览器动作，对服务端安全无用， hash 不会重加载页面。
- history 模式：history 采用 HTML5 的新特性；且提供了两个新方法：pushState() ， replaceState() 可以对浏览器历史记录栈进行修改，以及 popState 事件的监听到状态变更

## vue 路由的钩子函数

> 首页可以控制导航跳转， beforeEach ， afterEach 等，一般用于页面 title 的修改。一些需要登录才能调整页面的重定向功能。

- beforeEach 主要有 3 个参数 to ， from ， next 。
- to ： route 即将进入的目标路由对象。
- from ： route 当前导航正要离开的路由。
- next ： function 一定要调用该方法 resolve 这个钩子。执行效果依赖 next 方法的调用参数。可以控制网页的跳转

## vuex 是什么？怎么使用？哪种功能场景使用它？

- 只用来读取的状态集中放在 store 中； 改变状态的方式是提交 mutations ，这是个同步的事物； 异步逻辑应该封装在 action 中。
- 在 main.js 引入 store ，注入。新建了一个目录 store ， … export
- 场景有：单页应用中，组件之间的状态、音乐播放、登录状态、加入购物车

vuex

- state ： Vuex 使用单一状态树,即每个应用将仅仅包含一个 store 实例，但单一状态树和模块化并不冲突。存放的数据状态，不可以直接修改里面的数据。
- mutations ： mutations 定义的方法动态修改 Vuex 的 store 中的状态或数据
- getters ：类似 vue 的计算属性，主要用来过滤一些数据。
- action ： actions 可以理解为通过将 mutations 里面处里数据的方法变成可异步的处理数据的方法，简单的说就是异步操作数据。 view 层通过 store.dispath 来分发 action

> modules ：项目特别复杂的时候，可以让每一个模块拥有自己的 state 、mutation 、 action 、 getters ，使得结构非常清晰，方便管理

## v-if 和 v-show 区别

- v-show 只是在 display: none 和 display: block 之间切换。无论初始条件是什么都会被渲染出来，后面只需要切换 CSS ， DOM 还是一直保留着的。所以总的来说 v-show 在初始渲染时有更高的开销，但是切换开销很小，更适合于频繁切换的场景。
- v-if 的话就得说到 Vue 底层的编译了。当属性初始为 false 时，组件就不会被渲染，直到条件为 true ，并且切换条件时会触发销毁/挂载组件，所以总的来说在切换时开销更高，更适合不经常切换的场景。
- 并且基于 v-if 的这种惰性渲染机制，可以在必要的时候才去渲染组件，减少整个页面的初始渲染开销。

## $route 和 $router 的区别

- $route 是“路由信息对象”，包括 path ， params ， hash ， query ， fullPath ，matched ， name 等路由信息参数。
- 而 $router 是“路由实例”对象包括了路由的跳转方法，钩子函数等

## 如何让 CSS 只在当前组件中起作用?

> 将当前组件的 \<style> 修改为 \<style scoped>

## keep-alive 的作用是什么?

- \<keep-alive>\</keep-alive> 包裹动态组件时，会缓存不活动的组件实例,主要用于保留组件状态或避免重新渲染
- 如果你需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keepalive 组件裹需要保存的组件。
- 对于 keep-alive 组件来说，它拥有两个独有的生命周期钩子函数，分别为 activated 和 deactivated 。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数。

> 比如有一个列表和一个详情，那么用户就会经常执行打开详情=>返回列表=>打开详情…这样的话列表和详情都是一个频率很高的页面，那么就可以对列表组件使用 \<keep-alive>\</keep-alive> 进行缓存，这样用户每次返回列表的时候，都能从缓存中快速渲染，而不是重新渲染

## 指令 v-el 的作用是什么?

> 提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标.可以是 CSS 选择器，也可以是一个 HTMLElement 实例,

## 在 Vue 中使用插件的步骤

- 采用 ES6 的 import ... from ... 语法或 CommonJS 的 require() 方法引入插件
- 使用全局方法 Vue.use( plugin ) 使用插件,可以传入一个选项对象 Vue.use(MyPlugin, {someOption: true })

## 请列举出 3 个 Vue 中常用的生命周期钩子函数?

- created : 实例已经创建完成之后调用,在这一步,实例已经完成数据观测, 属性和方法的运算, watch/event 事件回调. 然而, 挂载阶段还没有开始, $el 属性目前还不可见
- mounted : el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。
- activated : keep-alive 组件激活时调用

## vue-cli 工程技术集合介绍

**问题一：构建的 vue-cli 工程都到了哪些技术，它们的作用分别是什么？**

- vue.js ： vue-cli 工程的核心，主要特点是 双向数据绑定 和 组件系统。
- vue-router ： vue 官方推荐使用的路由框架。
- vuex ：专为 Vue.js 应用项目开发的状态管理器，主要用于维护 vue 组件间共用的一些 变量 和 方法。
- axios （ 或者 fetch 、 ajax ）：用于发起 GET 、或 POST 等 http 请求，基于 Promise 设计。
- vuex 等：一个专为 vue 设计的移动端 UI 组件库。
- 创建一个 emit.js 文件，用于 vue 事件机制的管理。
- webpack ：模块加载和 vue-cli 工程打包器。

**问题二：vue-cli 工程常用的 npm 命令有哪些？**

- 下载 node_modules 资源包的命令：npm instal
- 启动 vue-cli 开发环境的 npm 命令：npm run dev
- vue-cli 生成 生产环境部署资源 的 npm 命令：npm run build
- 用于查看 vue-cli 生产环境部署资源文件大小的 npm 命令：npm run build --repor

> 在浏览器上自动弹出一个 展示 vue-cli 工程打包后 app.js 、manifest.js 、 vendor.js 文件里面所包含代码的页面。可以具此优化 vue-cli 生产环境部署的静态资源，提升 页面 的加载速度

## NextTick

> nextTick 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM

## vue 的优点是什么？

- 低耦合。视图（ View ）可以独立于 Model 变化和修改，一个 ViewModel 可以绑定到不同的 "View" 上，当 View 变化的时候 Model 可以不变，当 Model 变化的时候 View 也可以不变
- 可重用性。你可以把一些视图逻辑放在一个 ViewModel 里面，让很多 view 重用这段视图逻辑
- 可测试。界面素来是比较难于测试的，而现在测试可以针对 ViewModel 来写

## 路由之间跳转？

声明式（标签跳转）

```js
<router-link :to="index">
```

编程式（ js 跳转）

```js
router.push('index')
```

## 实现 Vue SSR

**其基本实现原理**

- app.js 作为客户端与服务端的公用入口，导出 Vue 根实例，供客户端 entry 与服务端 entry 使用。客户端 entry 主要作用挂载到 DOM 上，服务端 entry 除了创建和返回实例，还进行路由匹配与数据预获取。
- webpack 为客服端打包一个 Client Bundle ，为服务端打包一个 Server Bundle 。
- 服务器接收请求时，会根据 url ，加载相应组件，获取和解析异步数据，创建一个读取 Server Bundle 的 BundleRenderer ，然后生成 html 发送给客户端。
- 客户端混合，客户端收到从服务端传来的 DOM 与自己的生成的 DOM 进行对比，把不相同的 DOM 激活，使其可以能够响应后续变化，这个过程称为客户端激活 。为确保混合成功，客户端与服务器端需要共享同一套数据。在服务端，可以在渲染之前获取数据，填充到 stroe 里，这样，在客户端挂载到 DOM 之前，可以直接从 store 里取数据。首屏的动态数据通过 window.\_\_INITIAL_STATE\_\_ 发送到客户端

> Vue SSR 的实现，主要就是把 Vue 的组件输出成一个完整 HTML , vue-server-renderer 就是干这事的

- Vue SSR 需要做的事多点（输出完整 HTML），除了 complier -> vnode ，还需如数据获取填充至 HTML 、客户端混合（ hydration ）、缓存等等。 相比于其他模板引擎（ ejs ,jade 等），最终要实现的目的是一样的，性能上可能要差点

## Vue 组件 data 为什么必须是函数

- 每个组件都是 Vue 的实例。
- 组件共享 data 属性，当 data 的值是同一个引用类型的值时，改变其中一个会影响其他

## 组件中 data 什么时候可以使用对象

- 组件复用时所有组件实例都会共享 data ，如果 data 是对象的话，就会造成一个组件修改 data 以后会影响到其他所有组件，所以需要将 data 写成函数，每次用到就调用一次函数获得新的数据。
- 当我们使用 new Vue() 的方式的时候，无论我们将 data 设置为对象还是函数都是可以的，因为 new Vue() 的方式是生成一个根组件，该组件不会复用，也就不存在共享 data 的情况了

## Vue computed 实现

- 建立与其他属性（如： data 、 Store ）的联系；
- 属性改变后，通知计算属性重新计算

> 实现时，主要如下

- 初始化 data ， 使用 Object.defineProperty 把这些属性全部转为 getter/setter 。
- 初始化 computed , 遍历 computed 里的每个属性，每个 computed 属性都是一个 watch 实例。每个属性提供的函数作为属性的 getter ，使用 Object.defineProperty 转化。
- Object.defineProperty getter 依赖收集。用于依赖发生变化时，触发属性重新计算。
- 若出现当前 computed 计算属性嵌套其他 computed 计算属性时，先进行其他的依赖收集

## Vue complier 实现

- 模板解析这种事，本质是将数据转化为一段 html ，最开始出现在后端，经过各种处理吐给前端。随着各种 mv\* 的兴起，模板解析交由前端处理。
- 总的来说， Vue complier 是将 template 转化成一个 render 字符串。

> 可以简单理解成以下步骤：

- parse 过程，将 template 利用正则转化成 AST 抽象语法树。
- optimize 过程，标记静态节点，后 diff 过程跳过静态节点，提升性能。
- generate 过程，生成 render 字符串

## 怎么快速定位哪个组件出现性能问题

> 用 timeline 工具。 大意是通过 timeline 来查看每个函数的调用时常，定位出哪个函数的问题，从而能判断哪个组件出了问题

## extend 能做什么

> 这个 API 很少用到，作用是扩展组件生成一个构造器，通常会与 $mount 一起使用。

```js
// 创建组件构造器
let Component = Vue.extend({
  template: '<div>test</div>'
})
// 挂载到 #app 上
new Component().$mount('#app')
// 除了上面的方式，还可以用来扩展已有的组件
let SuperComponent = Vue.extend(Component)
new SuperComponent({
  created() {
    console.log(1)
  }
})
new SuperComponent().$mount('#app')
```

## mixin 和 mixins 区别

> mixin 用于全局混入，会影响到每个组件实例，通常插件都是这样做初始化的

```js
Vue.mixin({
  beforeCreate() {
    // ...逻辑
    // 这种方式会影响到每个组件的 beforeCreate 钩子函数
  }
})
```

- 虽然文档不建议我们在应用中直接使用 mixin ，但是如果不滥用的话也是很有帮助的，比如可以全局混入封装好的 ajax 或者一些工具函数等等。
- mixins 应该是我们最常使用的扩展组件的方式了。如果多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 mixins 混入代码，比如上拉下拉加载数据这种逻辑等等。
- 另外需要注意的是 mixins 混入的钩子函数会先于组件内的钩子函数执行，并且在遇到同名选项的时候也会有选择性的进行合并，具体可以阅读 文档。

## computed 和 watch 区别

- computed 是计算属性，依赖其他属性计算值，并且 computed 的值有缓存，只有当计算值变化才会返回内容。
- watch 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。
- 所以一般来说需要依赖别的属性来动态获得值的时候可以使用 computed ，对于监听到值的变化需要做一些复杂业务逻辑的情况可以使用 watch 。
- 另外 computer 和 watch 还都支持对象的写法，这种方式知道的人并不多。

```js
vm.$watch('obj', {
  // 深度遍历
  deep: true,
  // 立即触发
  immediate: true,
  // 执行的函数
  handler: function(val, oldVal) {}
})
var vm = new Vue({
  data: { a: 1 },
  computed: {
    aPlus: {
      // this.aPlus 时触发
      get: function () {
        return this.a + 1
      },
      // this.aPlus = 1 时触发
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
```

---
title: react框架篇
---

react 相关面试题

<!-- more -->

# react 中 key 的作用

- 简单的说：key 是虚拟 DOM 中的一种标识，在更新显示是 key 起到了极其重要的作用
- 复杂的说：当状态中的数据发生改变的时候，react 会根据【新数据】生成【新的虚拟 DOM】，随后 react 进行【新虚拟 DOM】 和 【旧的虚拟 DOM】的 diff 比较，而在这个比较过程中 key 就是起到是关键中用

> Keys 是 React 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识

在开发过程中，我们需要保证某个元素的 key 在其同级元素中具有唯一性。在 ReactDiff 算法中 React 会借助元素的 Key 值来判断该元素是新近创建的还是被移动而来的元素，从而减少不必要的元素重渲染。此外，React 还需要借助 Key 值来判断元素与本地状态的关联关系，因此我们绝不可忽视转换函数中 Key 的重要性

# setState

- setState 在 React 中是经常使用的一个 API ，但是它存在一些的问题经常会导致初学者出错，核心原因就是因为这个 API 是异步的。
- 首先 setState 的调用并不会马上引起 state 的改变，并且如果你一次调用了多个 setState ，那么结果可能并不如你期待的一样。

```js
handle() {
  // 初始化 'count' 为 0
  console.log(this.state.count) // -> 0
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  console.log(this.state.count) // -> 0
}
```

- 第一，两次的打印都为 0 ，因为 setState 是个异步 API ，只有同步代码运行完毕才会执行。 setState 异步的原因我认为在于， setState 可能会导致 DOM 的重绘，如果调用一次就马上去进行重绘，那么调用多次就会造成不必要的性能损失。设计成异步的话，就可以将多次调用放入一个队列中，在恰当的时候统一进行更新过程。

```js
Object.assign(
  {},
  { count: this.state.count + 1 },
  { count: this.state.count + 1 },
  { count: this.state.count + 1 },
)
```

当然你也可以通过以下方式来实现调用三次 setState 使得 count 为 3

```js
handle() {
  this.setState((prevState) => ({ count: prevState.count + 1 }))
  this.setState((prevState) => ({ count: prevState.count + 1 }))
  this.setState((prevState) => ({ count: prevState.count + 1 }))
}
```

如果你想在每次调用 setState 后获得正确的 state ，可以通过如下代码实现

```js
handle() {
  this.setState((prevState) => ({ count: prevState.count + 1 }), () => {
    console.log(this.state)
  })
}
更多详情 http://blog.poetries.top/2018/12/20/react-setState
```

# 传入 setState 函数的第二个参数的作用是什么？

> 该函数会在 setState 函数调用完成并且组件开始重渲染的时候被调用，我们可以用该函数来监听渲染是否完成：

```js
this.setState(
  { username: 'tylermcginnis33' },
  () => console.log('setState has finished and the component has re-rendered.')
)
this.setState((prevState, props) => {
   return {
    streak: prevState.streak + props.count
  }
})
```

# React 中 refs 的作用是什么

- Refs 是 React 提供给我们的安全访问 DOM 元素或者某个组件实例的句柄
- 可以为元素添加 ref 属性然后在回调函数中接受该元素在 DOM 树中的句柄，该值会作为回调函数的第一个参数返回

# 在生命周期中的哪一步你应该发起 AJAX 请求

> 我们应当将 AJAX 请求放到 componentDidMount 函数中执行，主要原因有下

- React 下一代调和算法 Fiber 会通过开始或停止渲染的方式优化应用性能，其会影响到 componentWillMount 的触发次数。对于 componentWillMount 这个生命周期函数的调用次数会变得不确定， React 可能会多次频繁调用 componentWillMount 。如果我们将 AJAX 请求放到 componentWillMount 函数中，那么显而易见其会被触发多次，自然也就不是好的选择。
- 如果我们将 AJAX 请求放置在生命周期的其他函数中，我们并不能保证请求仅在组件挂载完毕后才会要求响应。如果我们的数据请求在组件挂载之前就完成，并且调用了 setState 函数将数据添加到组件状态中，对于未挂载的组件则会报错。而在 componentDidMount 函数中进行 AJAX 请求则能有效避免这个问题

# react 生命周期函数

**初始化阶段**

- getDefaultProps :获取实例的默认属性
- getInitialState :获取每个实例的初始化状态
- componentWillMount ：组件即将被装载、渲染到页面上
- render :组件在这里生成虚拟的 DOM 节点
- omponentDidMount :组件真正在被装载之后

**运行中状态**

- componentWillReceiveProps :组件将要接收到属性的时候调用
- shouldComponentUpdate :组件接受到新属性或者新状态的时候（可以返回 false，接收数据后不更新，阻止 render 调用，后面的函数不会被继续执行了）
- componentWillUpdate :组件即将更新不能修改属性和状态
- render :组件重新描绘
- componentDidUpdate :组件已经更新

**销毁阶段**

- componentWillUnmount :组件即将销毁

# 生命周期

> 在 V16 版本中引入了 Fiber 机制。这个机制一定程度上的影响了部分生命周期的调用，并且也引入了新的 2 个 API 来解决问题
> 在之前的版本中，如果你拥有一个很复杂的复合组件，然后改动了最上层组件的 state ，那么调用栈可能会很长

- 调用栈过长，再加上中间进行了复杂的操作，就可能导致长时间阻塞主线程，带来不好的用户体验。 Fiber 就是为了解决该问题而生
- Fiber 本质上是一个虚拟的堆栈帧，新的调度器会按照优先级自由调度这些帧，从而将之前的同步渲染改成了异步渲染，在不影响体验的情况下去分段计算更新

- 对于如何区别优先级， React 有自己的一套逻辑。对于动画这种实时性很高的东西，也就是 16 ms 必须渲染一次保证不卡顿的情况下， React 会每 16 ms （以内） 暂停一下更新，返回来继续渲染动画
- 对于异步渲染，现在渲染有两个阶段： reconciliation 和 commit 。前者过程是可以打断的，后者不能暂停，会一直更新界面直到完成。

1. Reconciliation 阶段
   - componentWillMount
   - componentWillReceiveProps
   - shouldComponentUpdate
   - componentWillUpdate
2. Commit 阶段
   - componentDidMount
   - componentDidUpdate
   - componentWillUnmount

> 因为 Reconciliation 阶段是可以被打断的，所以 Reconciliation 阶段会执行的生命周期函数就可能会出现调用多次的情况，从而引起 Bug 。由此对于 Reconciliation 阶段调用的几个函数，除了 shouldComponentUpdate 以外，其他都应该避免去使用，并且 V16 中也引入了新的 API 来解决这个问题。

> getDerivedStateFromProps 用于替换 componentWillReceiveProps ，该函数会在初始化和 update 时被调用

```js
class ExampleComponent extends React.Component {
  // Initialize state in constructor,
  // Or with a property initializer.
  state = {};
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.someMirroredValue !== nextProps.someValue) {
      return {
        derivedData: computeDerivedState(nextProps),
        someMirroredValue: nextProps.someValue
      };
    }
    // Return null to indicate no change to state.
    return null;
  }
}
```

> getSnapshotBeforeUpdate 用于替换 componentWillUpdate ，该函数会在 update 后 DOM 更新前被调用，用于读取最新的 DOM 数据

更多详情 http://blog.poetries.top/2018/11/18/react-lifecircle

# react 性能优化是哪个周期函数

> shouldComponentUpdate 这个方法用来判断是否需要调用 render 方法重新描绘 dom。因为 dom 的描绘非常消耗性能，如果我们能在 shouldComponentUpdate 方 法中能够写出更优化的 dom diff 算法，可以极大的提高性能

# shouldComponentUpdate 的作用

> shouldComponentUpdate 允许我们手动地判断是否要进行组件更新，根据组件的应用场景设置函数的合理返回值能够帮我们避免不必要的更新

# 如何告诉 React 它应该编译生产环境版

> 通常情况下我们会使用 Webpack 的 DefinePlugin 方法来将 NODE_ENV 变量值设置为 production 。编译版本中 React 会忽略 propType 验证以及其他的告警信息，同时还会降低代码库的大小， React 使用了 Uglify 插件来移除生产环境下不必要的注释等信息

# 概述下 React 中的事件处理逻辑

> 为了解决跨浏览器兼容性问题， React 会将浏览器原生事件（ BrowserNative Event ）封装为合成事件（ SyntheticEvent ）传入设置的事件处理器中。这里的合成事件提供了与原生事件相同的接口，不过它们屏蔽了底层浏览器的细节差异，保证了行为的一致性。另外有意思的是， React 并没有直接将事件附着到子元素上，而是以单一事件监听器的方式将所有的事件发送到顶层进行处理。这样 React 在更新 DOM 的时候就不需要考虑如何去处理附着在 DOM 上的事件监听器，最终达到优化性能的目的

# createElement 与 cloneElement 的区别是什么

> createElement 函数是 JSX 编译之后使用的创建 React Element 的函数，而 cloneElement 则是用于复制某个元素并传入新的 Props

# redux 中间件

> 中间件提供第三方插件的模式，自定义拦截 action -> reducer 的过程。变为 action -> middlewares -> reducer 。这种机制可以让我们改变数据流，实现如异步 action ， action 过滤，日志输出，异常报告等功能

- redux-logger ：提供日志输出
- redux-thunk ：处理异步操作
- redux-promise ：处理异步操作， actionCreator 的返回值是 promise

# redux 有什么缺点

- 一个组件所需要的数据，必须由父组件传过来，而不能像 flux 中直接从 store 取。
- 当一个组件相关数据更新时，即使父组件不需要用到这个组件，父组件还是会重新 render ，可能会有效率影响，或者需要写复杂的 shouldComponentUpdate 进行判断

# react 组件的划分业务组件技术组件？

- 根据组件的职责通常把组件分为 UI 组件和容器组件。
- UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。
- 两者通过 React-Redux 提供 connect 方法联系起来

# 为什么虚拟 dom 会提高性能

> 虚拟 dom 相当于在 js 和真实 dom 中间加了一个缓存，利用 dom diff 算法避免了没有必要的 dom 操作，从而提高性能

**具体实现步骤如下**

- 用 JavaScript 对象结构表示 DOM 树的结构；然后用这个树构建一个真正的 DOM 树，插到文档当中
- 当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异
- 把 2 所记录的差异应用到步骤 1 所构建的真正的 DOM 树上，视图就更新

# diff 算法?

- 把树形结构按照层级分解，只比较同级元素。
- 给列表结构的每个单元添加唯一的 key 属性，方便比较。
- React 只会匹配相同 class 的 component （这里面的 class 指的是组件的名字）
- 合并操作，调用 component 的 setState 方法的时候, React 将其标记为 - dirty .到每一个事件循环结束, React 检查所有标记 dirty 的 component 重新绘制.
- 选择性子树渲染。开发人员可以重写 shouldComponentUpdate 提高 diff 的性能

# react 性能优化方案

- 重写 shouldComponentUpdate 来避免不必要的 dom 操作
- 使用 production 版本的 react.js
- 使用 key 来帮助 React 识别列表中所有子组件的最小变化

- 在 shouldComponentUpdate 函数中我们可以通过返回布尔值来决定当前组件是否需要更新。这层代码逻辑可以是简单地浅比较一下当前 state 和之前的 state 是否相同，也可以是判断某个值更新了才触发组件更新。一般来说不推荐完整地对比当前 state 和之前的 state 是否相同，因为组件更新触发可能会很频繁，这样的完整对比性能开销会有点大，可能会造成得不偿失的情况。
- 当然如果真的想完整对比当前 state 和之前的 state 是否相同，并且不影响性能也是行得通的，可以通过 immutable 或者 immer 这些库来生成不可变对象。这类库对于操作大规模的数据来说会提升不错的性能，并且一旦改变数据就会生成一个新的对象，对比前后 state 是否一致也就方便多了，同时也很推荐阅读下 immer 的源码实现
- 另外如果只是单纯的浅比较一下，可以直接使用 PureComponent ，底层就是实现了浅比较 state

```js
class Test extends React.PureComponent {
  render() {
    return (
      <div>
      PureComponent
      </div>
    )
  }
}
```

> 这时候你可能会考虑到函数组件就不能使用这种方式了，如果你使用 16.6.0 之后的版本的话，可以使用 React.memo 来实现相同的功能

```js
const Test = React.memo(() => (
  <div>
    PureComponent
  </div>
))
```

> 通过这种方式我们就可以既实现了 shouldComponentUpdate 的浅比较，又能够使用函数组件

# 简述 flux 思想

> Flux 的最大特点，就是数据的"单向流动"。

- 用户访问 View
- View 发出用户的 Action
- Dispatcher 收到 Action ，要求 Store 进行相应的更新
- Store 更新后，发出一个 "change" 事件
- View 收到 "change" 事件后，更新页面

# 说说你用 react 有什么坑点？

1. JSX 做表达式判断时候，需要强转为 boolean 类型
   > 如果不使用 !!b 进行强转数据类型，会在页面里面输出 0 。
   ```
   render() {
    const b = 0;
    return <div>
    {
      !!b && <div>这是一段文本</div>
    }
    </div>
   }
   ```
2. 尽量不要在 componentWillReviceProps 里使用 setState，如果一定要使用，那么需要判断结束条件，不然会出现无限重渲染，导致页面崩溃
3. 给组件添加 ref 时候，尽量不要使用匿名函数，因为当组件更新的时候，匿名函数会被当做新的 prop 处理，让 ref 属性接受到新函数的时候，react 内部会先清空 ref，也就是会以 null 为回调参数先执行一次 ref 这个 props，然后在以该组件的实例执行一次 ref，所以用匿名函数做 ref 的时候，有的时候去 ref 赋值后的属性会取到 null
4. 遍历子节点的时候，不要用 index 作为组件的 key 进行传入

# 我现在有一个 button，要用 react 在上面绑定点击事件，要怎么做？

```js
class Demo {
  render() {
    return <button onClick={(e) => {
      alert('我点击了按钮')
    }}>
      按钮
    </button>
  }
}
```

你觉得你这样设置点击事件会有什么问题吗？

> 由于 onClick 使用的是匿名函数，所有每次重渲染的时候，会把该 onClick 当做一个新的 prop 来处理，会将内部缓存的 onClick 事件进行重新赋值，所以相对直接使用函数来说，可能有一点的性能下降

修改

```js
class Demo {
  onClick = (e) => {
    alert('我点击了按钮')
  }
  render() {
    return <button onClick={this.onClick}>
      按钮
    </button>
  }
}
```

# react 的虚拟 dom 是怎么实现的

首先说说为什么要使用 Virturl DOM ，因为操作真实 DOM 的耗费的性能代价太高，所以 react 内部使用 js 实现了一套 dom 结构，在每次操作在和真实 dom 之前，使用实现好的 diff 算法，对虚拟 dom 进行比较，递归找出有变化的 dom 节点，然后对其进行更新操作。为了实现虚拟 DOM ，我们需要把每一种节点类型抽象成对象，每一种节点类型有自己的属性，也就是 prop，每次进行 diff 的时候， react 会先比较该节点类型，假如节点类型不一样，那么 react 会直接删除该节点，然后直接创建新的节点插入到其中，假如节点类型一样，那么会比较 prop 是否有更新，假如有 prop 不一样，那么 react 会判定该节点有更新，那么重渲染该节点，然后在对其子节点进行比较，一层一层往下，直到没有子节点

# react 的渲染过程中，兄弟节点之间是怎么处理的？也就是 key 值 不一样的时候

通常我们输出节点的时候都是 map 一个数组然后返回一个 ReactNode ，为了方便 react 内部进行优化，我们必须给每一个 reactNode 添加 key ，这个 key prop 在设计值处不是给开发者用的，而是给 react 用的，大概的作用就是给每一个 reactNode 添加一个身份标识，方便 react 进行识别，在重渲染过程中，如果 key 一样，若组件属性有所变化，则 react 只更新组件对应的属性；没有变化则不更新，如果 key 不一样，则 react 先销毁该组件，然后重新创建该组件

# 那给我介绍一下 react

1. 以前我们没有 jquery 的时候，我们大概的流程是从后端通过 ajax 获取到数据然后使用 jquery 生成 dom 结果然后更新到页面当中，但是随着业务发展，我们的项目可能会越来越复杂，我们每次请求到数据，或则数据有更改的时候，我们又需要重新组装一次 dom 结构，然后更新页面，这样我们手动同步 dom 和数据的成本就越来越高，而且频繁的操作 dom，也使我我们页面的性能慢慢的降低。
2. 这个时候 mvvm 出现了，mvvm 的双向数据绑定可以让我们在数据修改的同时同步 dom 的更新，dom 的更新也可以直接同步我们数据的更改，这个特定可以大大降低我们手动去维护 dom 更新的成本，mvvm 为 react 的特性之一，虽然 react 属于单项数据流，需要我们手动实现双向数据绑定。
3. 有了 mvvm 还不够，因为如果每次有数据做了更改，然后我们都全量更新 dom 结构的话，也没办法解决我们频繁操作 dom 结构(降低了页面性能)的问题，为了解决这个问题，react 内部实现了一套虚拟 dom 结构，也就是用 js 实现的一套 dom 结构，他的作用是讲真实 dom 在 js 中做一套缓存，每次有数据更改的时候，react 内部先使用算法，也就是鼎鼎有名的 diff 算法对 dom 结构进行对比，找到那些我们需要新增、更新、删除的 dom 节点，然后一次性对真实 DOM 进行更新，这样就大大降低了操作 dom 的次数。 那么 diff 算法是怎么运作的呢，首先，diff 针对类型不同的节点，会直接判定原来节点需要卸载并且用新的节点来装载卸载的节点的位置；针对于节点类型相同的节点，会对比这个节点的所有属性，如果节点的所有属性相同，那么判定这个节点不需要更新，如果节点属性不相同，那么会判定这个节点需要更新，react 会更新并重渲染这个节点。
4. react 设计之初是主要负责 UI 层的渲染，虽然每个组件有自己的 state，state 表示组件的状态，当状态需要变化的时候，需要使用 setState 更新我们的组件，但是，我们想通过一个组件重渲染它的兄弟组件，我们就需要将组件的状态提升到父组件当中，让父组件的状态来控制这两个组件的重渲染，当我们组件的层次越来越深的时候，状态需要一直往下传，无疑加大了我们代码的复杂度，我们需要一个状态管理中心，来帮我们管理我们状态 state。
5. 这个时候，redux 出现了，我们可以将所有的 state 交给 redux 去管理，当我们的某一个 state 有变化的时候，依赖到这个 state 的组件就会进行一次重渲染，这样就解决了我们的我们需要一直把 state 往下传的问题。redux 有 action、reducer 的概念，action 为唯一修改 state 的来源，reducer 为唯一确定 state 如何变化的入口，这使得 redux 的数据流非常规范，同时也暴露出了 redux 代码的复杂，本来那么简单的功能，却需要完成那么多的代码。
6. 后来，社区就出现了另外一套解决方案，也就是 mobx，它推崇代码简约易懂，只需要定义一个可观测的对象，然后哪个组价使用到这个可观测的对象，并且这个对象的数据有更改，那么这个组件就会重渲染，而且 mobx 内部也做好了是否重渲染组件的生命周期 shouldUpdateComponent，不建议开发者进行更改，这使得我们使用 mobx 开发项目的时候可以简单快速的完成很多功能，连 redux 的作者也推荐使用 mobx 进行项目开发。但是，随着项目的不断变大，mobx 也不断暴露出了它的缺点，就是数据流太随意，出了 bug 之后不好追溯数据的流向，这个缺点正好体现出了 redux 的优点所在，所以针对于小项目来说，社区推荐使用 mobx，对大项目推荐使用 redux

# 通信

1. 父子通信
   - 父组件通过 props 传递数据给子组件，子组件通过调用父组件传来的函数传递数据给父组件，这两种方式是最常用的父子通信实现办法。
   - 这种父子通信方式也就是典型的单向数据流，父组件通过 props 传递数据，子组件不能直接修改 props ， 而是必须通过调用父组件函数的方式告知父组件修改数据。
2. 兄弟组件通信
   > 对于这种情况可以通过共同的父组件来管理状态和事件函数。比如说其中一个兄弟组件调用父组件传递过来的事件函数修改父组件中的状态，然后父组件将状态传递给另一个兄弟组件
3. 跨多层次组件通信
   > 如果你使用 16.3 以上版本的话，对于这种情况可以使用 Context API
   ```js
   // 创建 Context，可以在开始就传入值
   const StateContext = React.createContext()
   class Parent extends React.Component {
     render () {
       return (
         // value 就是传入 Context 中的值
         <StateContext.Provider value='yck'>
         <Child />
         </StateContext.Provider>
       )
     }
   }
   class Child extends React.Component {
     render () {
       return (
         <ThemeContext.Consumer>
         // 取出值
         {context => (
         name is { context }
         )}
         </ThemeContext.Consumer>
       );
     }
   }
   ```
4. 任意组件
   > 这种方式可以通过 Redux 或者 Event Bus 解决，另外如果你不怕麻烦的话，可以使用这种方式解决上述所有的通信情况

# HOC 是什么？相比 mixins 有什么优点？

> 很多人看到高阶组件（ HOC ）这个概念就被吓到了，认为这东西很难，其实这东西概念真的很简单，我们先来看一个例子。

```js
function add(a, b) {
  return a + b
}
```

> 现在如果我想给这个 add 函数添加一个输出结果的功能，那么你可能会考虑我直接使用 console.log 不就实现了么。说的没错，但是如果我们想做的更加优雅并且容易复用和扩展，我们可以这样去做

```js
function withLog (fn) {
  function wrapper(a, b) {
    const result = fn(a, b)
    console.log(result)
    return result
  }
  return wrapper
}
const withLogAdd = withLog(add)
withLogAdd(1, 2)
```

- 其实这个做法在函数式编程里称之为高阶函数，大家都知道 React 的思想中是存在函数式编程的，高阶组件和高阶函数就是同一个东西。我们实现一个函数，传入一个组件，然后在函数内部再实现一个函数去扩展传入的组件，最后返回一个新的组件，这就是高阶组件的概念，作用就是为了更好的复用代码。
- 其实 HOC 和 Vue 中的 mixins 作用是一致的，并且在早期 React 也是使用 mixins 的方式。但是在使用 class 的方式创建组件以后， mixins 的方式就不能使用了，并且其实 mixins 也是存在一些问题的，比如

1. 隐含了一些依赖，比如我在组件中写了某个 state 并且在 mixin 中使用了，就这存在了一个依赖关系。万一下次别人要移除它，就得去 mixin 中查找依赖
2. 多个 mixin 中可能存在相同命名的函数，同时代码组件中也不能出现相同命名的函数，否则就是重写了，其实我一直觉得命名真的是一件麻烦事。。
3. 雪球效应，虽然我一个组件还是使用着同一个 mixin ，但是一个 mixin 会被多个组件使用，可能会存在需求使得 mixin 修改原本的函数或者新增更多的函数，这样可能就会产生一个维护成本

> HOC 解决了这些问题，并且它们达成的效果也是一致的，同时也更加的政治正确（毕竟更加函数式了）

# 事件机制

> React 其实自己实现了一套事件机制，首先我们考虑一下以下代码：

```js
const Test = ({ list, handleClick }) => ({
  list.map((item, index) => (
    <span onClick={handleClick} key={index}>{index}</span>
  ))
})
```

- 以上类似代码想必大家经常会写到，但是你是否考虑过点击事件是否绑定在了每一个标签上？事实当然不是， JSX 上写的事件并没有绑定在对应的真实 DOM 上，而是通过事件代理的方式，将所有的事件都统一绑定在了 document 上。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。
- 另外冒泡到 document 上的事件也不是原生浏览器事件，而是 React 自己实现的合成事件（ SyntheticEvent ）。因此我们如果不想要事件冒泡的话，调用 event.stopPropagation 是无效的，而应该调用 event.preventDefault

那么实现合成事件的目的是什么呢？总的来说在我看来好处有两点，分别是：

1. 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力
2. 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象

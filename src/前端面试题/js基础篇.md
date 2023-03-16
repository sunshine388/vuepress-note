---
title: js基础篇
---

js 相关面试题

<!-- more -->

# apply call bind 区别

- 三者都可以改变函数的 this 对象指向。
- 三者第一个参数都是 this 要指向的对象，如果如果没有这个参数或参数为 undefined 或 null，则默认指向全局 window。
- 三者都可以传参，但是 apply 是数组，而 call 是参数列表，且 apply 和 call 是一次性传入参数，而 bind 可以分为多次传入。
- bind 是返回绑定 this 之后的函数，便于稍后调用；apply 、call 则是立即执行 。
- bind()会返回一个新的函数，如果这个返回的新的函数作为构造函数创建一个新的对象，那么此时 this 不再指向传入给 bind 的第一个参数，而是指向用 new 创建的实例

# null，undefined 的区别

- undefined 表示不存在这个值。
- undefined :是一个表示"无"的原始值或者说表示"缺少值"，就是此处应该有一个值，但是还没有定义。当尝试读取时会返回 undefined
- 例如变量被声明了，但没有赋值时，就等于 undefined
- null 表示一个对象被定义了，值为“空值”
- null : 是一个对象(空对象, 没有任何属性和方法)
- 例如作为函数的参数，表示该函数的参数不是对象；
- 在验证 null 时，一定要使用 === ，因为 == 无法分别 null 和 undefined

# 闭包

- 闭包就是能够读取其他函数内部变量的函数
- 闭包是指有权访问另一个函数作用域中变量的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，通过另一个函数访问这个函数的局部变量,利用闭包可以突破作用链域
- 闭包的特性：
  - 函数内再嵌套函数
  - 内部函数可以引用外层的参数和变量
  - 参数和变量不会被垃圾回收机制回收

**说说你对闭包的理解**

> 闭包的定义很简单：函数 A 返回了一个函数 B，并且函数 B 中使用了函数 A 的变量，函数 B 就被称为闭包。
> 你是否会疑惑，为什么函数 A 已经弹出调用栈了，为什么函数 B 还能引用到函数 A 中的变量。因为函数 A 中的变量这时候是存储在堆上的。现在的 JS 引擎可以通过逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。

- 使用闭包主要是为了设计私有的方法和变量。闭包的优点是可以避免全局变量的污染，缺点是闭包会常驻内存，会增大内存使用量，使用不当很容易造成内存泄露。在 js 中，函数即闭包，只有函数才会产生作用域的概念
- 闭包 的最大用处有两个，一个是可以读取函数内部的变量，另一个就是让这些变量始终保持在内存中
- 闭包的另一个用处，是封装对象的私有属性和私有方法
- **好处**：能够实现封装和缓存等；
- **坏处**：就是消耗内存、不正当使用会造成内存溢出的问题

**使用闭包的注意点**

- 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在 IE 中可能导致内存泄露
- 解决方法是，在退出函数之前，将不使用的局部变量全部删除

经典面试题，循环中使用闭包解决 var 定义函数的问题

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

- 首先因为 setTimeout 是个异步函数，所有会先把循环全部执行完毕，这时候 i 就是 6 了，所以会输出一堆 6 。
- 解决办法两种，第一种使用闭包
  ```js
  for (var i = 1; i <= 5; i++) {
    (function (j) {
      setTimeout(function timer() {
        console.log(j);
      }, j * 1000);
    })(i);
  }
  ```
- 第二种就是使用 setTimeout 的第三个参数
  ```js
  for (var i = 1; i <= 5; i++) {
    setTimeout(
      function timer(j) {
        console.log(j);
      },
      i * 1000,
      i
    );
  }
  ```
- 第三种就是使用 let 定义 i 了
  ```js
  for (let i = 1; i <= 5; i++) {
    setTimeout(function timer() {
      console.log(i);
    }, i * 1000);
  }
  ```
  因为对于 let 来说，他会创建一个块级作用域，相当于
  ```js
  { // 形成块级作用域
    let i = 0
    {
      let ii = i
      setTimeout( function timer() {
        console.log( i );
      }, i*1000 );
    }
    i++
    {
      let ii = i
    }
    i++
    {
      let ii = i
    }
    ...
  }
  ```

# 说说你对作用域链的理解

- 作用域链的作用是保证执行环境里有权访问的变量和函数是有序的，作用域链的变量只能向上访问，变量访问到 window 对象即被终止，作用域链向下访问变量是不被允许的
- 简单的说，作用域就是变量与函数的可访问范围，即作用域控制着变量与函数的可见性和生命周期

# 原型

- 每个函数都有 prototype 属性，除了 Function.prototype.bind() ，该属性指向原型。
- 每个对象都有 \_\_proto\_\_ 属性，指向了创建该对象的构造函数的原型。其实这个属性指向了 [[prototype]] ，但是 [[prototype]] 是内部属性，我们并不能访问到，所以使用\_\_proto\_\_ 来访问。
- 对象可以通过 \_\_proto\_\_来寻找不属于该对象的属性， \_\_proto\_\_ 将对象连接起来组成了原型链

# JavaScript 原型，原型链 ? 有什么特点？

- 每个对象都会在其内部初始化一个属性，就是 prototype (原型)，当我们访问一个对象的属性时
- 如果这个对象内部不存在这个属性，那么他就会去 prototype 里找这个属性，这个 prototype 又会有自己的 prototype ，于是就这样一直找下去，也就是我们平时所说的原型链的概念
- 关系： instance.constructor.prototype = instance.\_\_proto\_\_
- 特点：
  - JavaScript 对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与之相关的对象也会继承这一改变
- 当我们需要一个属性的时， Javascript 引擎会先看当前对象中是否有这个属性， 如果没有的就会查找他的 Prototype 对象是否有这个属性，如此递推下去，一直检索到 Object 内建对象

# 请解释什么是事件代理

- 事件代理（ Event Delegation ），又称之为事件委托。是 JavaScript 中常用绑定事件的常用技巧。顾名思义，“事件代理”即是把原本需要绑定的事件委托给父元素，让父元素担当事件监听的职务。事件代理的原理是 DOM 元素的事件冒泡。使用事件代理的好处是可以提高性能
- 可以大量节省内存占用，减少事件注册，比如在 table 上代理所有 td 的 click 事件就非常棒
- 可以实现当新增子对象时无需再次对其绑定

# 继承

> 在 ES5 中，我们可以使用如下方式解决继承的问题

```js
function Super() {}
Super.prototype.getNumber = function () {
  return 1;
};
function Sub() {}
let s = new Sub();
Sub.prototype = Object.create(Super.prototype, {
  constructor: {
    value: Sub,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});
```

- 以上继承实现思路就是将子类的原型设置为父类的原型
- 在 ES6 中，我们可以通过 class 语法轻松解决这个问题
  ```js
  class MyDate extends Date {
    test() {
      return this.getTime();
    }
  }
  let myDate = new MyDate();
  myDate.test();
  ```
- 但是 ES6 不是所有浏览器都兼容，所以我们需要使用 Babel 来编译这段代码。
- 如果你使用编译过的代码调用 myDate.test() 你会惊奇地发现出现了报错
  > 因为在 JS 底层有限制，如果不是由 Date 构造出来的实例的话，是不能调用 Date 里的函数的。所以这也侧面的说明了： ES6 中的 class 继承与 ES5 中的一般继承写法是不同的。
- 既然底层限制了实例必须由 Date 构造出来，那么我们可以改变下思路实现继承
  ```js
  function MyData() {}
  MyData.prototype.test = function () {
    return this.getTime();
  };
  let d = new Date();
  Object.setPrototypeOf(d, MyData.prototype);
  Object.setPrototypeOf(MyData.prototype, Date.prototype);
  ```
- 以上继承实现思路：先创建父类实例 => 改变实例原先的\_\_proto\_\_转而连接到子类的 prototype => 子类的 prototype 的\_\_proto\_\_改为父类的 prototype 。
- 通过以上方法实现的继承就可以完美解决 JS 底层的这个限制

# Javascript 如何实现继承？

- 构造继承
- 原型继承
- 实例继承
- 拷贝继承
- 原型 prototype 机制或 apply 和 call 方法去实现较简单，建议使用构造函数与原型混合方式

```js
function Parent() {
  this.name = "wang";
}
function Child() {
  this.age = 28;
}

Child.prototype = new Parent(); //继承了Parent，通过原型
var demo = new Child();
alert(demo.age);
alert(demo.name); //得到被继承的属性
```

# 原型继承和 class 继承

> 涉及面试题：原型如何实现继承？ Class 如何实现继承？ Class 本质是什么？

首先先来讲下 class ，其实在 JS 中并不存在类， class 只是语法糖，本质还是函数

```js
class Person {}
Person instanceof Function; // true
```

**组合继承**
组合继承是最常用的继承方式

```js
function Parent(value) {
  this.val = value;
}
Parent.prototype.getValue = function () {
  console.log(this.val);
};
function Child(value) {
  Parent.call(this, value);
}
Child.prototype = new Parent();
const child = new Child(1);
child.getValue(); // 1
child instanceof Parent; // true
```

- 以上继承的方式核心是在子类的构造函数中通过 Parent.call(this) 继承父类的属性，然后改变子类的原型为 new Parent() 来继承父类的函数。
- 这种继承方式优点在于构造函数可以传参，不会与父类引用属性共享，可以复用父类的函数，但是也存在一个缺点就是在继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费

**寄生组合继承**
这种继承方式对组合继承进行了优化，组合继承缺点在于继承父类函数时调用了构造函数，我们只需要优化掉这点就行了

```js
function Parent(value) {
  this.val = value;
}
Parent.prototype.getValue = function () {
  console.log(this.val);
};
function Child(value) {
  Parent.call(this, value);
}
Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});
const child = new Child(1);
child.getValue(); // 1
child instanceof Parent; // true
```

> 以上继承实现的核心就是将父类的原型赋值给了子类，并且将构造函数设置为子类，这样既解决了无用的父类属性问题，还能正确的找到子类的构造函数。

**Class 继承**
以上两种继承方式都是通过原型去解决的，在 ES6 中，我们可以使用 class 去实现继承，并且实现起来很简单

```js
class Parent {
  constructor(value) {
    this.val = value;
  }
  getValue() {
    console.log(this.val);
  }
}
class Child extends Parent {
  constructor(value) {
    super(value);
    this.val = value;
  }
}
let child = new Child(1);
child.getValue(); // 1
child instanceof Parent; // true
```

> class 实现继承的核心在于使用 extends 表明继承自哪个父类，并且在子类构造函数中必须调用 super ，因为这段代码可以看成 Parent.call(this,value) 。

# 谈谈 This 对象的理解

- this 总是指向函数的直接调用者（而非间接调用者）
- 如果有 new 关键字， this 指向 new 出来的那个对象
- 在事件中， this 指向触发这个事件的对象，特殊的是， IE 中的 attachEvent 中的 this 总是指向全局对象 Window

> 首先， new 的方式优先级最高，接下来是 bind 这些函数，然后是 obj.foo() 这种调用方式，最后是 foo 这种调用方式，同时，箭头函数的 this 一旦被绑定，就不会再被任何方式所改变。

# 描述一下 this

> this ，函数执行的上下文，可以通过 apply ， call ， bind 改变 this 的指向。对于匿名函数或者直接调用的函数来说，this 指向全局上下文（浏览器为 window，NodeJS 为 global ），剩下的函数调用，那就是谁调用它，this 就指向谁。当然还有 es6 的箭头函数，箭头函数的指向取决于该箭头函数声明的位置，在哪里声明， this 就指向哪里

```js
function foo() {
  console.log(this.a);
}
var a = 1;
foo();
var obj = {
  a: 2,
  foo: foo,
};
obj.foo();
// 以上两者情况 `this` 只依赖于调用函数前的对象，优先级是第二个情况大于第一个情况
// 以下情况是优先级最高的，`this` 只会绑定在 `c` 上，不会被任何方式修改 `this` 指向
var c = new foo();
c.a = 3;
console.log(c.a);
// 还有种就是利用 call，apply，bind 改变 this，这个优先级仅次于 new
```

> 看看箭头函数中的 this

```js
function a() {
  return () => {
    return () => {
      console.log(this);
    };
  };
}
console.log(a()()());
```

> 箭头函数其实是没有 this 的，这个函数中的 this 只取决于他外面的第一个不是箭头函数的函数的 this 。在这个例子中，因为调用 a 符合前面代码中的第一个情况，所以 this 是 window 。并且 this 一旦绑定了上下文，就不会被任何代码改变

# 谈一谈函数中 this 的指向

- this 的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定 this 到底指向谁，实际上 this 的最终指向的是那个调用它的对象
- 《javascript 语言精髓》中大概概括了 4 种调用方式：
- 方法调用模式
- 函数调用模式
- 构造器调用模式
  ```
  graph LR
  A-->B
  ```
- apply/call 调用模式

# 事件模型

> W3C 中定义事件的发生经历三个阶段：捕获阶段（ capturing ）、目标阶段（ targetin ）、冒泡阶段（ bubbling ）

- 冒泡型事件：当你使用事件冒泡时，子级元素先触发，父级元素后触发
- 捕获型事件：当你使用事件捕获时，父级元素先触发，子级元素后触发
- DOM 事件流：同时支持两种事件模型：捕获型事件和冒泡型事件
- 阻止冒泡：在 W3c 中，使用 stopPropagation() 方法；在 IE 下设置 cancelBubble = true
- 阻止捕获：阻止事件的默认行为，例如 click - \<a> 后的跳转。在 W3c 中，使用 preventDefault() 方法，在 IE 下设置 window.event.returnValue = false

# 事件的各个阶段

- 1：捕获阶段 ---> 2：目标阶段 ---> 3：冒泡阶段
- document ---> target 目标 ----> document
- 由此， addEventListener 的第三个参数设置为 true 和 false 的区别已经非常清晰了
  - true 表示该元素在事件的“捕获阶段”（由外往内传递时）响应事件
  - false 表示该元素在事件的“冒泡阶段”（由内向外传递时）响应事件

# 说说事件流

事件流分为两种，捕获事件流和冒泡事件流

- 捕获事件流从根节点开始执行，一直往子节点查找执行，直到查找执行到目标节点
- 冒泡事件流从目标节点开始执行，一直往父节点冒泡查找执行，直到查到到根节点

> 事件流分为三个阶段，一个是捕获节点，一个是处于目标节点阶段，一个是冒泡阶段

# 事件机制

**事件机制**
事件触发三阶段

- document 往事件触发处传播，遇到注册的捕获事件会触发
- 传播到事件触发处时触发注册的事件
- 从事件触发处往 document 传播，遇到注册的冒泡事件会触发

> 事件触发一般来说会按照上面的顺序进行，但是也有特例，如果给一个目标节点同时注册冒泡和捕获事件，事件触发会按照注册的顺序执行

```js
// 以下会先打印冒泡然后是捕获
node.addEventListener(
  "click",
  (event) => {
    console.log("冒泡");
  },
  false
);
node.addEventListener(
  "click",
  (event) => {
    console.log("捕获 ");
  },
  true
);
```

**注册事件**

> 通常我们使用 addEventListener 注册事件，该函数的第三个参数可以是布尔值，也可以是对象。对于布尔值 useCapture 参数来说，该参数默认值为 false 。 useCapture 决定了注册的事件是捕获事件还是冒泡事件

- capture ：布尔值，和 useCapture 作用一样
- once ：布尔值，值为 true 表示该回调只会调用一次，调用后会移除监听
- passive ：布尔值，表示永远不会调用 preventDefault
  > 一般来说，我们只希望事件只触发在目标上，这时候可以使用 stopPropagation 来阻止事件的进一步传播。通常我们认为 stopPropagation 是用来阻止事件冒泡的，其实该函数也可以阻止捕获事件。 stopImmediatePropagation 同样也能实现阻止事件，但是还能阻止该事件目标执行别的注册事件

```js
node.addEventListener(
  "click",
  (event) => {
    event.stopImmediatePropagation();
    console.log("冒泡");
  },
  false
);
// 点击 node 只会执行上面的函数，该函数不会执行
node.addEventListener(
  "click",
  (event) => {
    console.log("捕获 ");
  },
  true
);
```

**事件代理**

> 如果一个节点中的子节点是动态生成的，那么子节点需要注册事件的话应该注册在父节点上

```js
<ul id="ul">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>
<script>
let ul = document.querySelector('##ul')
ul.addEventListener('click', (event) => {
  console.log(event.target);
})
</script>
```

> 事件代理的方式相对于直接给目标注册事件来说，有以下优点

- 节省内存
- 不需要给子节点注销事件

# new 操作符具体干了什么呢?

- 创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型
- 属性和方法被加入到 this 引用的对象中
- 新创建的对象由 this 所引用，并且最后隐式的返回 this

# new

- 新生成了一个对象
- 链接到原型
- 绑定 this
- 返回新对象

> 在调用 new 的过程中会发生以上四件事情，我们也可以试着来自己实现一个 new

```js
function create() {
  // 创建一个空的对象
  let obj = new Object();
  // 获得构造函数
  let Con = [].shift.call(arguments);
  // 链接到原型
  obj.__proto__ = Con.prototype;
  // 绑定 this，执行构造函数
  let result = Con.apply(obj, arguments);
  // 确保 new 出来的是个对象
  return typeof result === "object" ? result : obj;
}
```

- 对于创建一个对象来说，更推荐使用字面量的方式创建对象（无论性能上还是可读性）。因为你使用 new Object() 的方式创建对象需要通过作用域链一层层找到 Object ，但是你使用字面量的方式就没这个问题

# Ajax 原理

- Ajax 的原理简单来说是在用户和服务器之间加了—个中间层( AJAX 引擎)，通过 XmlHttpRequest 对象来向服务器发异步请求，从服务器获得数据，然后用 javascript 来操作 DOM 而更新页面。使用户操作与服务器响应异步化。这其中最关键的一步就是从服务器获得请求数据
- Ajax 的过程只涉及 JavaScript 、 XMLHttpRequest 和 DOM 。 XMLHttpRequest 是 ajax 的核心机制

```js
// 1. 创建连接
var xhr = null;
xhr = new XMLHttpRequest();
// 2. 连接服务器
xhr.open("get", url, true);
// 3. 发送请求
xhr.send(null);
// 4. 接受请求
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      success(xhr.responseText);
    } else {
      // false
      fail && fail(xhr.status);
    }
  }
};
```

ajax 有那些优缺点?

- 优点：
  - 通过异步模式，提升了用户体验.
  - 优化了浏览器和服务器之间的传输，减少不必要的数据往返，减少了带宽占用.
  - Ajax 在客户端运行，承担了一部分本来由服务器承担的工作，减少了大用户量下的服务器负载。
  - Ajax 可以实现动态不刷新（局部刷新）
- 缺点：
  - 安全问题 AJAX 暴露了与服务器交互的细节。
  - 对搜索引擎的支持比较弱。
  - 不容易调试。

# 如何解决跨域问题?

> 首先了解下浏览器的同源策略 同源策略 SOP（Same origin policy） 是一种约定，由 Netscape 公司 1995 年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到 XSS 、 CSFR 等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个 ip 地址，也非同源
> 那么怎样解决跨域问题的呢？

- 通过 jsonp 跨域
  > JSONP 的原理很简单，就是利用 \<script> 标签没有跨域限制的漏洞。通过 \<script> 标签指向一个需要访问的地址并提供一个回调函数来接收数据当需要通讯时
  ```js
  <script src="http://domain/api?param1=a&param2=b&callback=jsonp"></script>
  <script>
  function jsonp(data) {
    console.log(data)
  }
  </script>
  ```
  > JSONP 使用简单且兼容性不错，但是只限于 get 请求。
  > 在开发中可能会遇到多个 JSONP 请求的回调函数名是相同的，这时候就需要自己封装一个 JSONP ，以下是简单实现
  ```js
  function jsonp(url, jsonpCallback, success) {
    let script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.type = "text/javascript";
    window[jsonpCallback] = function (data) {
      success && success(data);
    };
    document.body.appendChild(script);
  }
  jsonp("http://xxx", "callback", function (value) {
    console.log(value);
  });
  ```
- document.domain + iframe 跨域
  - 此方案仅限主域相同，子域不同的跨域应用场景
  - 该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。
  - 只需要给页面添加 document.domain = 'test.com' 表示二级域名都相同就可以实现跨域
  1. 父窗口：(http://www.domain.com/a.html)
  ```js
  <iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
  <script>
  document.domain = 'domain.com';
  var user = 'admin';
  </script>
  ```
  2. 子窗口：(http://child.domain.com/b.html)
  ```js
  document.domain = "domain.com";
  // 获取父窗口中变量
  alert("get js data from parent ---> " + window.parent.user);
  ```
- nginx 代理跨域
- nodejs 中间件代理跨域
- 后端在头部信息里面设置安全域名
- CORS
  - CORS 需要浏览器和后端同时支持
  - 浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS ，就实现了跨域。
  - 服务端设置 Access-Control-Allow-Origin 就可以开启 CORS 。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源
- postMessage
  > 这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息
  ```js
  // 发送消息端
  window.parent.postMessage("message", "http://blog.poetries.com");
  // 接收消息端
  var mc = new MessageChannel();
  mc.addEventListener("message", (event) => {
    var origin = event.origin || event.originalEvent.origin;
    if (origin === "http://blog.poetries.com") {
      console.log("验证通过");
    }
  });
  ```

# 模块化开发怎么做？

**立即执行函数,不暴露私有成员**

```js
var module1 = (function () {
  var _count = 0;
  var m1 = function () {
    //...
  };
  var m2 = function () {
    //...
  };
  return {
    m1: m1,
    m2: m2,
  };
})();
```

**AMD 和 CMD**

```js
// AMD
define(["./a", "./b"], function (a, b) {
  // 加载模块完毕可以使用
  a.do();
  b.do();
});
// CMD
define(function (require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require("./a");
  a.doSomething();
});
```

**CommonJS**
**ES Module**
ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别

1. CommonJS 支持动态导入，也就是 require(${path}/xx.js) ，后者目前不支持，但是已有提案
2. CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
3. CommonJS 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
4. ES Module 会编译成 require/exports 来执行的

```js
// 引入模块 API
import XXX from "./a.js";
import { XXX } from "./a.js";
// 导出模块 API
export function a() {}
export default function () {}
```

# 异步加载 JS 的方式有哪些？

- defer，只支持 IE
- async ：
- 创建 script ，插入到 DOM 中，加载完毕后 callBack

# 那些操作会造成内存泄漏

- 内存泄漏指任何对象在您不再拥有或需要它之后仍然存在
- setTimeout 的第一个参数使用字符串而非函数的话，会引发内存泄漏
- 闭包使用不当
- 闭包、控制台日志、循环（在两个对象彼此引用且彼此保留时，就会产生一个循环）

# 内存泄漏

> 定义：程序中己动态分配的堆内存由于某种原因程序未释放或无法释放引发的各种问题。

**js 中可能出现的内存泄漏情况**

> 结果：变慢，崩溃，延迟大等，原因：

- 全局变量
- dom 清空时，还存在引用
- ie 中使用闭包
- 定时器未清除
- 子元素存在引起的内存泄露
  **避免策略**
- 减少不必要的全局变量，或者生命周期较长的对象，及时对无用的数据进行垃圾回收；
- 注意程序逻辑，避免“死循环”之类的 ；
- 避免创建过多的对象 原则：不用了的东西要及时归还。
- 减少层级过多的引用

# XML 和 JSON 的区别？

- 数据体积方面
  - JSON 相对 于 XML 来讲，数据的体积小，传递的速度更快些。
- 数据交互方面
  - JSON 与 JavaScript 的交互更加方便，更容易解析处理，更好的数据交互
- 数据描述方面
  - JSON 对数据的描述性比 XML 较差
- 传输速度方面
  - JSON 的速度要远远快于 XML

# JSON 的了解

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式
它是基于 JavaScript 的一个子集。数据格式简单, 易于读写, 占用带宽小
JSON 字符串转换为 JSON 对象:

```js
var obj = eval("(" + str + ")");
var obj = str.parseJSON();
var obj = JSON.parse(str);
```

JSON 对象转换为 JSON 字符串：

```js
var last = obj.toJSONString();
var last = JSON.stringify(obj);
```

# 用过哪些设计模式？

- 工厂模式：
  - 工厂模式解决了重复实例化的问题，但还有一个问题,那就是识别问题，因为根本无法
  - 主要好处就是可以消除对象间的耦合，通过使用工程方法而不是 new 关键字
- 构造函数模式
  - 使用构造函数的方法，即解决了重复实例化的问题，又解决了对象识别的问题，该模式与工厂模式的不同之处在于
  - 直接将属性和方法赋值给 this 对象;

# javascript 有哪些方法定义对象

- 对象字面量： var obj = {};
- 构造函数： var obj = new Object();
- Object.create(): var obj = Object.create(Object.prototype);

# javascript 创建对象的几种方式

> javascript 创建对象简单的说,无非就是使用内置对象或各种自定义对象，当然还可以用 JSON ；但写法有很多种，也能混合使用

- 对象字面量的方式
  ```js
  person = { firstname: "Mark", lastname: "Yun", age: 25, eyecolor: "black" };
  ```
- 用 function 来模拟无参的构造函数
  ```js
  function Person() {}
  var person = new Person(); //定义一个function，如果使用new"实例化",该function可以看作
  person.name = "Mark";
  person.age = "25";
  person.work = function () {
    alert(person.name + " hello...");
  };
  person.work();
  ```
- 用 function 来模拟参构造函数来实现（用 this 关键字定义构造的上下文属性）
  ```js
  function Pet(name, age, hobby) {
    this.name = name; //this作用域：当前对象
    this.age = age;
    this.hobby = hobby;
    this.eat = function () {
      alert("我叫" + this.name + ",我喜欢" + this.hobby + ",是个程序员");
    };
  }
  var maidou = new Pet("麦兜", 25, "coding"); //实例化、创建对象
  maidou.eat(); //调用eat方法
  ```
- 用工厂方式来创建（内置对象）
  ```js
  var wcDog = new Object();
  wcDog.name = "旺财";
  wcDog.age = 3;
  wcDog.work = function () {
    alert("我是" + wcDog.name + ",汪汪汪......");
  };
  wcDog.work();
  ```
- 用原型方式来创建
  ```js
  function Dog() {}
  Dog.prototype.name = "旺财";
  Dog.prototype.eat = function () {
    alert(this.name + "是个吃货");
  };
  var wangcai = new Dog();
  wangcai.eat();
  ```
- 用混合方式来创建
  ```js
  function Car(name, price) {
    this.name = name;
    this.price = price;
  }
  Car.prototype.sell = function () {
    alert("我是" + this.name + "，我现在卖" + this.price + "万元");
  };
  var camry = new Car("凯美瑞", 27);
  camry.sell();
  ```

# 说说你对 promise 的了解

- 依照 Promise/A+ 的定义， Promise 有四种状态：

  - pending: 初始状态, 非 fulfilled 或 rejected.
  - fulfilled: 成功的操作.
  - rejected: 失败的操作.
  - settled: Promise 已被 fulfilled 或 rejected ，且不是 pending

- 另外， fulfilled 与 rejected 一起合称 settled
- Promise 对象用来进行延迟( deferred ) 和异步( asynchronous ) 计算

**Promise 的构造函数**

- 构造一个 Promise ，最基本的用法如下：

```js

var promise = new Promise(function(resolve, reject) {
  if (...) { // succeed
    resolve(result);
  } else { // fails
    reject(Error(errMessage));
  }
});
```

- Promise 实例拥有 then 方法（具有 then 方法的对象，通常被称为 thenable ）。它的使用方法如下：

```js
promise.then(onFulfilled, onRejected);
```

- 接收两个函数作为参数，一个在 fulfilled 的时候被调用，一个在 rejected 的时候被调用，接收参数就是 future ， onFulfilled 对应 resolve , onRejected 对应 reject

# 介绍 js 的基本数据类型

Undefined 、 Null 、 Boolean 、 Number 、 String

# 介绍 js 有哪些内置对象

- Object 是 JavaScript 中所有对象的父对象
- 数据封装类对象： Object 、 Array 、 Boolean 、 Number 和 String
- 其他对象： Function 、 Arguments 、 Math 、 Date 、 RegExp 、 Error

# 说几条写 JavaScript 的基本规范

- 不要在同一行声明多个变量
- 请使用 ===/!== 来比较 true/false 或者数值
- 使用对象字面量替代 new Array 这种形式
- 不要使用全局函数
- Switch 语句必须带有 default 分支
- If 语句必须使用大括号
- for-in 循环中的变量 应该使用 var 关键字明确限定作用域，从而避免作用域污

# JavaScript 有几种类型的值

- 栈：原始数据类型（ Undefined ， Null ， Boolean ， Number 、 String ）
- 堆：引用数据类型（对象、数组和函数）
- 两种类型的区别是：存储位置不同；
- 原始数据类型直接存储在栈( stack )中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；
- 引用数据类型存储在堆( heap )中的对象,占据空间大、大小不固定,如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体

# eval 是做什么的

- 它的功能是把对应的字符串解析成 JS 代码并运行
- 应该避免使用 eval ，不安全，非常耗性能（ 2 次，一次解析成 js 语句，一次执行）
- 由 JSON 字符串转换为 JSON 对象的时候可以用 eval，var obj =eval('('+ str +')')

# ["1", "2", "3"].map(parseInt) 答案是多少

- [1, NaN, NaN] 因为 parseInt 需要两个参数 (val, radix) ，其中 radix 表示解析时用的基数。
- map 传了 3 个 (element, index, array) ，对应的 radix 不合法导致解析失败。

# javascript 代码中的"use strict";是什么意思

- use strict 是一种 ECMAscript 5 添加的（严格）运行模式，这种模式使得 Javascript 在更严格的条件下运行，使 JS 编码更加规范化的模式，消除 Javascript 语法的一些不合理、不严谨之处，减少一些怪异行为

# 说说严格模式的限制

- 变量必须声明后再使用
- 函数的参数不能有同名属性，否则报错
- 不能使用 with 语句
- 禁止 this 指向全局对象

# js 延迟加载的方式有哪些

defer 和 async 、动态创建 DOM 方式（用得最多）、按需异步载入 js

# defer 和 async

- defer 并行加载 js 文件，会按照页面上 script 标签的顺序执行
- async 并行加载 js 文件，下载完成立即执行，不会按照页面上 script 标签的顺序执行

# 同步和异步的区别

- 同步：浏览器访问服务器请求，用户看得到页面刷新，重新发请求，等请求完，页面刷新，新内容出现，用户看到新内容,进行下一步操作
- 异步：浏览器访问服务器请求，用户正常操作，浏览器后端进行请求。等请求完，页面不刷新，新内容也会出现，用户看到新内容

# attribute 和 property 的区别是什么

- attribute 是 dom 元素在文档中作为 html 标签拥有的属性；
- property 就是 dom 元素在 js 中作为对象拥有的属性。
- 对于 html 的标准属性来说， attribute 和 property 是同步的，是会自动更新的
- 但是对于自定义的属性来说，他们是不同步的

# 谈谈你对 ES6 的理解

- 新增模板字符串（为 JavaScript 提供了简单的字符串插值功能）
- 箭头函数
- for-of （用来遍历数据—例如数组中的值。）
- arguments 对象可被不定参数和默认参数完美代替。
- ES6 将 p romise 对象纳入规范，提供了原生的 Promise 对象。
- 增加了 let 和 const 命令，用来声明变量。
- 增加了块级作用域。
- let 命令实际上就增加了块级作用域。
- 还有就是引入 module 模块的概念

# ECMAScript6 怎么写 class 么

- 这个语法糖可以让有 OOP 基础的人更快上手 js ，至少是一个官方的实现了
- 但对熟悉 js 的人来说，这个东西没啥大影响；一个 Object.creat() 搞定继承，比 class 简洁清晰的多

# 什么是面向对象编程及面向过程编程，它们的异同和优缺点

- 面向过程就是分析出解决问题所需要的步骤，然后用函数把这些步骤一步一步实现，使用的时候一个一个依次调用就可以了
- 面向对象是把构成问题事务分解成各个对象，建立对象的目的不是为了完成一个步骤，而是为了描叙某个事物在整个解决问题的步骤中的行为
- 面向对象是以功能来划分问题，而不是步骤

# 面向对象编程思想

- 基本思想是使用对象，类，继承，封装等基本概念来进行程序设计
- 优点
  - 易维护
    - 采用面向对象思想设计的结构，可读性高，由于继承的存在，即使改变需求，那么维护也只是在局部模块，所以维护起来是非常方便和较低成本的
  - 易扩展
  - 开发工作的重用性、继承性高，降低重复工作量。
  - 缩短了开发周期

# 如何通过 JS 判断一个数组

- instanceof 方法
  - instanceof 运算符是用来测试一个对象是否在其原型链原型构造函数的属性
  ```js
  var arr = [];
  arr instanceof Array; // true
  ```
- constructor 方法
  - constructor 属性返回对创建此对象的数组函数的引用，就是返回对象相对应的构造函数
  ```js
  var arr = [];
  arr.constructor == Array; //true
  ```
- 最简单的方法
  - 这种写法，是 jQuery 正在使用的
  ```js
  Object.prototype.toString.call(value) == "[object Array]";
  // 利用这个方法，可以写一个返回数据类型的方法
  var isType = function (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  };
  ```
- ES5 新增方法 isArray()
  ```js
  var a = new Array(123);
  var b = new Date();
  console.log(Array.isArray(a)); //true
  console.log(Array.isArray(b)); //false
  ```

# 谈一谈 let 与 var 的区别

- 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- var 存在提升，我们能在声明之前使用。 let 、 const 因为暂时性死区的原因，不能在声明前使用
- let 命令不存在变量提升，如果在 let 前使用，会导致报错
- 如果块区中存在 let 和 const 命令，就会形成封闭作用域
- 不允许重复声明，因此，不能在函数内部重新声明参数

# let var const

let

- 允许你声明一个作用域被限制在块级中的变量、语句或者表达式
- let 绑定不受变量提升的约束，这意味着 let 声明不会被提升到当前
- 该变量处于从块开始到初始化处理的“暂存死区”

var

- 声明变量的作用域限制在其声明位置的上下文中，而非声明变量总是全局的
- 由于变量声明（以及其他声明）总是在任意代码执行之前处理的，所以在代码中的任意位置声明变量总是等效于在代码开头声明
- 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会

const

- 声明创建一个值的只读引用 (即指针)
- 基本数据当值发生改变时，那么其对应的指针也将发生改变，故造成 const 申明基本数据类型时再将其值改变时，将会造成报错， 例如 const a = 3 ; a = 5 时 将会报错
- 但是如果是复合类型时，如果只改变复合类型的其中某个 Value 项时， 将还是正常使用

# map 与 forEach 的区别

- forEach 方法，是最基本的方法，就是遍历与循环，默认有 3 个传参：分别是遍历的数组内容 item 、数组索引 index 、和当前遍历数组 Array
- map 方法，基本用法与 forEach 一致，但是不同的，它会返回一个新的数组，所以在 callback 需要有 return 值，如果没有，会返回 undefined

# 谈一谈你理解的函数式编程

- 简单说，"函数式编程"是一种"编程范式"（programming paradigm），也就是如何编写程序的方法论
- 它具有以下特性：闭包和高阶函数、惰性计算、递归、函数是"第一等公民"、只用"表达式"

# 谈一谈箭头函数与普通函数的区别？

- 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象
- 不可以当作构造函数，也就是说，不可以使用 new 命令，否则会抛出一个错误
- 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 Rest 参数代替
- 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数

# 异步编程的实现方式

- 回调函数
  - 优点：简单、容易理解
  - 缺点：不利于维护，代码耦合高
- 事件监听(采用时间驱动模式，取决于某个事件是否发生)：
  - 优点：容易理解，可以绑定多个事件，每个事件可以指定多个回调函数
  - 缺点：事件驱动型，流程不够清晰
- 发布/订阅(观察者模式)
  - 类似于事件监听，但是可以通过‘消息中心’，了解现在有多少发布者，多少订阅者
- Promise 对象
  - 优点：可以利用 then 方法，进行链式写法；可以书写错误时的回调函数；
  - 缺点：编写和理解，相对比较难
- Generator 函数
  - 优点：函数体内外的数据交换、错误处理机制
  - 缺点：流程管理不方便
- async 函数
  - 优点：内置执行器、更好的语义、更广的适用性、返回的是 Promise、结构清晰。
  - 缺点：错误处理机制

# 对原生 Javascript 了解程度

数据类型、运算、对象、Function、继承、闭包、作用域、原型链、事件、 RegExp 、JSON 、 Ajax 、 DOM 、 BOM 、内存泄漏、跨域、异步装载、模板引擎、前端 MVC 、路由、模块化、 Canvas 、 ECMAScript

# Js 动画与 CSS 动画区别及相应实现

- CSS3 的动画的优点
  - 在性能上会稍微好一些，浏览器会对 CSS3 的动画做一些优化
  - 代码相对简单
- 缺点
  - 在动画控制上不够灵活
  - 兼容性不好
- JavaScript 的动画正好弥补了这两个缺点，控制能力很强，可以单帧的控制、变换，同时写得好完全可以兼容 IE6 ，并且功能强大。对于一些复杂控制的动画，使用 javascript 会比较靠谱。而在实现一些小的交互动效的时候，就多考虑考虑 CSS 吧

# JS 数组和对象的遍历方式，以及几种方式的比较

> 通常我们会用循环的方式来遍历数组。但是循环是 导致 js 性能问题的原因之一。一般我们会采用下几种方式来进行数组的遍历

- for in 循环
- for 循环
- forEach
  - 这里的 forEach 回调中两个参数分别为 value ， index
  - forEach 无法遍历对象
  - IE 不支持该方法； Firefox 和 chrome 支持
  - forEach 无法使用 break ， continue 跳出循环，且使用 return 是跳过本次循环
- 这两种方法应该非常常见且使用很频繁。但实际上，这两种方法都存在性能问题
- 在方式一中， for-in 需要分析出 array 的每个属性，这个操作性能开销很大。用在 key 已知的数组上是非常不划算的。所以尽量不要用 for-in ，除非你不清楚要处理哪些属性，例如 JSON 对象这样的情况
- 在方式 2 中，循环每进行一次，就要检查一下数组长度。读取属性（数组长度）要比读局部变量慢，尤其是当 array 里存放的都是 DOM 元素，因为每次读取都会扫描一遍页面上的选择器相关元素，速度会大大降低

# 怎样添加、移除、移动、复制、创建和查找节点

创建新节点

```js
createDocumentFragment(); //创建一个DOM片段
createElement(); //创建一个具体的元素
createTextNode(); //创建一个文本节点
```

添加、移除、替换、插入

```js
appendChild(); //添加
removeChild(); //移除
replaceChild(); //替换
insertBefore(); //插入
```

查找

```js
getElementsByTagName(); //通过标签名称
getElementsByName(); //通过元素的Name属性的值
getElementById(); //通过元素Id，唯一性
```

# 正则表达式

> 正则表达式构造函数 var reg=new RegExp(“xxx”) 与正则表达字面量 var reg=// 有什么不同？匹配邮箱的正则表达式？

- 当使用 RegExp() 构造函数的时候，不仅需要转义引号（即 \ ”表示”），并且还需要双反斜杠（即 \\\ 表示一个 \ ）。使用正则表达字面量的效率更高

# Javascript 中 callee 和 caller 的作用

- caller 是返回一个对函数的引用，该函数调用了当前函数；
- callee 是返回正在被执行的 function 函数，也就是所指定的 function 对象的正文

> 那么问题来了？如果一对兔子每月生一对兔子；一对新生兔，从第二个月起就开始生兔子；假定每对兔子都是一雌一雄，试问一对兔子，第 n 个月能繁殖成多少对兔子？（使用 callee 完成）

```js
var result=[];
  function fn(n){ //典型的斐波那契数列
    if(n==1){
      return 1;
    }else if(n==2){
      return 1;
    }else if(result[n]){
      return result[n];
    }else{
      //argument.callee()表示fn()
      result[n]=arguments.callee(n-1)+arguments.callee(n-2);
      return result[n];
    }
  }
}
```

# caller 和 callee 的区别

**caller**

> caller 返回一个函数的引用，这个函数调用了当前的函数。
> 使用这个属性要注意

- 这个属性只有当函数在执行时才有用
- 如果在 javascript 程序中，函数是由顶层调用的，则返回 null

> functionName.caller: functionName 是当前正在执行的函数。

```js
function a() {
  console.log(a.caller);
}
```

**callee**

> callee 返回正在执行的函数本身的引用，它是 arguments 的一个属性

使用 callee 时要注意:

- 这个属性只有在函数执行时才有效
- 它有一个 length 属性，可以用来获得形参的个数，因此可以用来比较形参和实参个数是否一致，即比较 arguments.length 是否等于 arguments.callee.length
- 它可以用来递归匿名函数。

```js
function a() {
  console.log(arguments.callee);
}
```

# window.onload 和$(document).ready

> 原生 JS 的 window.onload 与 Jquery 的 $(document).ready(function(){})有什么不同？如何用原生 JS 实现 Jq 的 ready 方法？

- window.onload() 方法是必须等到页面内包括图片的所有元素加载完毕后才能执行。
- $(document).ready() 是 DOM 结构绘制完毕后就执行，不必等到加载完毕

```js
document.ready = function (callback) {
  ///兼容FF,Google
  if (document.addEventListener) {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        document.removeEventListener(
          "DOMContentLoaded",
          arguments.callee,
          false
        );
        callback();
      },
      false
    );
  }
  //兼容IE
  else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", function () {
      if (document.readyState == "complete") {
        document.detachEvent("onreadystatechange", arguments.callee);
        callback();
      }
    });
  } else if (document.lastChild == document.body) {
    callback();
  }
};
```

# addEventListener()和 attachEvent()的区别

- addEventListener() 是符合 W3C 规范的标准方法; attachEvent() 是 IE 低版本的非标准方法
- addEventListener() 支持事件冒泡和事件捕获; - 而 attachEvent() 只支持事件冒泡
- addEventListener() 的第一个参数中,事件类型不需要添加 on ; attachEvent() 需要添加 'on'
- 如果为同一个元素绑定多个事件, addEventListener() 会按照事件绑定的顺序依次执行,attachEvent() 会按照事件绑定的顺序倒序执行

# （设计题）想实现一个对页面某个节点的拖曳？如何做？（使用原生 JS）

- 给需要拖拽的节点绑定 mousedown , mousemove , mouseup 事件
- mousedown 事件触发后，开始拖拽
- mousemove 时，需要通过 event.clientX 和 clientY 获取拖拽位置，并实时更新位置
- mouseup 时，拖拽结束
- 需要注意浏览器边界的情况

# Javascript 全局函数和全局变量

**全局变量**

- Infinity 代表正的无穷大的数值。
- NaN 指示某个值是不是数字值。
- undefined 指示未定义的值。

**全局函数**

- decodeURI() 解码某个编码的 URI 。
- decodeURIComponent() 解码一个编码的 URI 组件。
- encodeURI() 把字符串编码为 URI。
- encodeURIComponent() 把字符串编码为 URI 组件。
- escape() 对字符串进行编码。
- eval() 计算 JavaScript 字符串，并把它作为脚本代码来执行。
- isFinite() 检查某个值是否为有穷大的数。
- isNaN() 检查某个值是否是数字。
- Number() 把对象的值转换为数字。
- parseFloat() 解析一个字符串并返回一个浮点数。
- parseInt() 解析一个字符串并返回一个整数。
- String() 把对象的值转换为字符串。
- unescape() 对由 escape() 编码的字符串进行解码

# 怎么判断两个对象相等？

JSON.stringify(obj)==JSON.stringify(obj2);//true

# 深浅拷贝

浅拷贝

- Object.assign
- 或者展开运算符

深拷贝

- 可以通过 JSON.parse(JSON.stringify(object)) 来解决
  该方法也是有局限性的
  会忽略 函数和 undefined
  不能序列化函数
  不能解决循环引用的对象
- 递归

# 谈谈变量提升？

> 当执行 JS 代码时，会生成执行环境，只要代码不是写在函数中的，就是在全局执行环境中，函数中的代码会产生函数执行环境，只此两种执行环境

- 接下来让我们看一个老生常谈的例子， var

```js
b(); // call b
console.log(a); // undefined
var a = "Hello world";
function b() {
  console.log("call b");
}
```

> **变量提升**
> 这是因为函数和变量提升的原因。通常提升的解释是说将声明的代码移动到了顶部，这其实没有什么错误，便于大家理解。但是更准确的解释应该是：在生成执行环境时，会有两个阶段。第一个阶段是创建的阶段，JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined ，所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用

在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

```js
b(); // call b second
function b() {
  console.log("call b fist");
}
function b() {
  console.log("call b second");
}
var b = "Hello world";
```

> 复制代码 var 会产生很多错误，所以在 ES6 中引入了 let 。 let 不能在声明前使用，但是这并不是常说的 let 不会提升， let 提升了，在第一阶段内存也已经为他开辟好了空间，但是因为这个声明的特性导致了并不能在声明前使用

# 什么是单线程，和异步的关系

- 单线程 - 只有一个线程，只能做一件事
- 原因 - 避免 DOM 渲染的冲突
  - 浏览器需要渲染 DOM
  - JS 可以修改 DOM 结构
  - JS 执行的时候，浏览器 DOM 渲染会暂停
  - 两段 JS 也不能同时执行（都修改 DOM 就冲突了）
  - webworker 支持多线程，但是不能访问 DOM
- 解决方案 - 异步

# 说说 event loop

**进程与线程**

> 涉及面试题：进程与线程区别？ JS 单线程带来的好处？

- JS 是单线程执行的，但是你是否疑惑过什么是线程？
- 讲到线程，那么肯定也得说一下进程。本质上来说，两个名词都是 CPU 工作时间片的一个描述。
- 进程描述了 CPU 在运行指令及加载和保存上下文所需的时间，放在应用上来说就代表了一个程序。线程是进程中的更小单位，描述了执行一段指令所需的时间
  > 把这些概念拿到浏览器中来说，当你打开一个 Tab 页时，其实就是创建了一个进程，一个进程中可以有多个线程，比如渲染线程、 JS 引擎线程、 HTTP 请求线程等等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁
- 上文说到了 JS 引擎线程和渲染线程，大家应该都知道，在 JS 运行的时候可能会阻止 UI 渲染，这说明了两个线程是互斥的。这其中的原因是因为 JS 可以修改 DOM ，如果在 JS 执行的时候 UI 线程还在工作，就可能导致不能安全的渲染 UI 。这其实也是一个单线程的好处，得益于 JS 是单线程运行的，可以达到节省内存，节约上下文切换时间，没有锁的问题的好处

**执行栈**

> 涉及面试题：什么是执行栈？

可以把执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则

> 当开始执行 JS 代码时，首先会执行一个 main 函数，然后执行我们的代码。根据先进后出的原则，后执行的函数会先弹出栈，在图中我们也可以发现， foo 函数后执行，当执行完毕后就从栈中弹出了

在开发中，大家也可以在报错中找到执行栈的痕迹

```js
function foo() {
  throw new Error("error");
}
function bar() {
  foo();
}
bar();
```

大家可以在上图清晰的看到报错在 foo 函数， foo 函数又是在 bar 函数中调用的
当我们使用递归的时候，因为栈可存放的函数是有限制的，一旦存放了过多的函数且没有得到释放的话，就会出现爆栈的问题
**浏览器中的 Event Loop**

> 首先， js 是单线程的，主要的任务是处理用户的交互，而用户的交互无非就是响应 DOM 的增删改，使用事件队列的形式，一次事件循环只处理一个事件响应，使得脚本执行相对连续，所以有了事件队列，用来储存待执行的事件，那么事件队列的事件从哪里被 push 进来的呢。那就是另外一个线程叫事件触发线程做的事情了，他的作用主要是在定时触发器线程、异步 HTTP 请求线程满足特定条件下的回调函数 push 到事件队列中，等待 js 引擎空闲的时候去执行，当然 js 引擎执行过程中有优先级之分，首先 js 引擎在一次事件循环中，会先执行 js 线程的主任务，然后会去查找是否有微任务 microtask（promise） ，如果有那就优先执行微任务，如果没有，在去查找宏任务 macrotask（setTimeout、setInterval） 进行执行

- JS 在执行的过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入到 Task （有多种 task ） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为

```js
console.log("script start");
setTimeout(function () {
  console.log("setTimeout");
}, 0);
console.log("script end");
```

> 不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（ microtask ） 和 宏任务（ macrotask ）。在 ES6 规范中， microtask 称为 jobs，macrotask 称为 task

```js
console.log("script start");
setTimeout(function () {
  console.log("setTimeout");
}, 0);
new Promise((resolve) => {
  console.log("Promise");
  resolve();
})
  .then(function () {
    console.log("promise1");
  })
  .then(function () {
    console.log("promise2");
  });
console.log("script end");
// script start => Promise => script end => promise1 => promise2 => setTimeout
```

> 以上代码虽然 setTimeout 写在 Promise 之前，但是因为 Promise 属于微任务而 setTimeout 属于宏任务

微任务

- process.nextTick
- promise
- Object.observe
- MutationObserver

宏任务

- script
- setTimeout
- setInterval
- setImmediate
- I/O
- UI rendering

> 宏任务中包括了 script ，浏览器会先执行一个宏任务，接下来有异步代码的话就先执行微任务

所以正确的一次 Event loop 顺序是这样的

- 执行同步代码，这属于宏任务
- 执行栈为空，查询是否有微任务需要执行
- 执行所有微任务
- 必要的话渲染 UI
- 然后开始下一轮 Event loop ，执行宏任务中的异步代码

> 通过上述的 Event loop 顺序可知，如果宏任务中的异步代码有大量的计算并且需要操作 DOM 的话，为了更快的响应界面响应，我们可以把操作 DOM 放入微任务中

**Node 中的 Event loop**

- Node 中的 Event loop 和浏览器中的不相同。
- Node 的 Event loop 分为 6 个阶段，它们会按照顺序反复运行

```js
┌─────────────────────────┐
┌─>│ timers               │
│ └──────────┬────────────┘
│ ┌──────────┴────────────┐
│ │ I/O callbacks         │
│ └──────────┬────────────┘
│ ┌──────────┴────────────┐
│ │ idle, prepare         │
│ └──────────┬────────────┘ ┌───────────────┐
│ ┌──────────┴────────────┐ │ incoming:     │
│ │ poll                  │<──connections── │
│ └──────────┬────────────┘ │ data, etc.    │
│ ┌──────────┴────────────┐ └───────────────┘
│ │ check                 │
│ └──────────┬────────────┘
│ ┌──────────┴────────────┐
└─┤ close callbacks       │
  └───────────────────────┘
```

timer

- timers 阶段会执行 setTimeout 和 setInterval
- 一个 timer 指定的时间并不是准确时间，而是在达到这个时间后尽快执行回调，可能会因为系统正在执行别的事务而延迟

I/O

- I/O 阶段会执行除了 close 事件，定时器和 setImmediate 的回调

poll

- poll 阶段很重要，这一阶段中，系统会做两件事情
  - 执行到点的定时器
  - 执行 poll 队列中的事件
- 并且当 poll 中没有定时器的情况下，会发现以下两件事情
  - 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者系统限制
  - 如果 poll 队列为空，会有两件事发生
  - 如果有 setImmediate 需要执行， poll 阶段会停止并且进入到 check 阶段执行 setImmediate
  - 如果没有 setImmediate 需要执行，会等待回调被加入到队列中并立即执行回调
  - 如果有别的定时器需要被执行，会回到 timer 阶段执行回调。

check

- check 阶段执行 setImmediate

close callbacks

- close callbacks 阶段执行 close 事件
- 并且在 Node 中，有些情况下的定时器执行顺序是随机的

```js
setTimeout(() => {
  console.log("setTimeout");
}, 0);
setImmediate(() => {
  console.log("setImmediate");
});
// 这里可能会输出 setTimeout，setImmediate
// 可能也会相反的输出，这取决于性能
// 因为可能进入 event loop
```

> 上面介绍的都是 macrotask 的执行情况， microtask 会在以上每个阶段完成后立即执行

```js
setTimeout(() => {
  console.log("timer1");
  Promise.resolve().then(function () {
    console.log("promise1");
  });
}, 0);
setTimeout(() => {
  console.log("timer2");
  Promise.resolve().then(function () {
    console.log("promise2");
  });
}, 0);
// 以上代码在浏览器和 node 中打印情况是不同的
// 浏览器中一定打印 timer1, promise1, timer2, promise2
// node 中可能打印 timer1, timer2, promise1, promise2
// 也可能打印 timer1, promise1, timer2, promise2
```

> Node 中的 process.nextTick 会先于其他 microtask 执行

```js
setTimeout(() => {
  console.log("timer1");
  Promise.resolve().then(function () {
    onsole.log("promise1");
  });
}, 0);
process.nextTick(() => {
  console.log("nextTick");
});
// nextTick, timer1, promise1
```

# js 自定义事件

> 三要素： document.createEvent() event.initEvent() element.dispatchEvent()

```js
// (en:自定义事件名称，fn:事件处理函数，addEvent:为DOM元素添加自定义事件，triggerEvent
window.onload = function () {
  var demo = document.getElementById("demo");
  demo.addEvent("test", function () {
    console.log("handler1");
  });
  demo.addEvent("test", function () {
    console.log("handler2");
  });
  demo.onclick = function () {
    this.triggerEvent("test");
  };
};
Element.prototype.addEvent = function (en, fn) {
  this.pools = this.pools || {};
  if (en in this.pools) {
    this.pools[en].push(fn);
  } else {
    this.pools[en] = [];
    this.pools[en].push(fn);
  }
};
Element.prototype.triggerEvent = function (en) {
  if (en in this.pools) {
    var fns = this.pools[en];
    for (var i = 0, il = fns.length; i < il; i++) {
      fns[i]();
    }
  } else {
    return;
  }
};
```

# 内置类型

- JS 中分为七种内置类型，七种内置类型又分为两大类型：基本类型和对象（ Object ）。
- 基本类型有六种： null ， undefined ， boolean， number ， string ， symbol 。
- 其中 JS 的数字类型是浮点类型的，没有整型。并且浮点类型基于 IEEE 754 标准实现，在使用中会遇到某些 Bug。 NaN 也属于 number 类型，并且 NaN 不等于自身。
- 对于基本类型来说，如果使用字面量的方式，那么这个变量只是个字面量，只有在必要的时候才会转换为对应的类型。

```js
let a = 111; // 这只是字面量，不是 number 类型
a.toString(); // 使用时候才会转换为对象类型
```

> 对象（ Object ）是引用类型，在使用过程中会遇到浅拷贝和深拷贝的问题。

```js
let a = { name: "FE" };
let b = a;
b.name = "EF";
console.log(a.name); // EF
```

# Typeof

> typeof 对于基本类型，除了 null 都可以显示正确的类型

```js
typeof 1; // 'number'
typeof "1"; // 'string'
typeof undefined; // 'undefined'
typeof true; // 'boolean'
typeof Symbol(); // 'symbol'
typeof b; // b 没有声明，但是还会显示 undefined
```

> typeof 对于对象，除了函数都会显示 object，所以说 typeof 并不能准确判断变量到底是什么类型

```js
typeof []; // 'object'
typeof {}; // 'object'
typeof console.log; // 'function'
```

> 如果我们想判断一个对象的正确类型，这时候可以考虑使用 instanceof ，因为内部机制是通过原型链来判断的

```js
const Person = function () {};
const p1 = new Person();
p1 instanceof Person; // true
var str = "hello world";
str instanceof String; // false
var str1 = new String("hello world");
str1 instanceof String; // true
```

> 对于 null 来说，虽然它是基本类型，但是会显示 object ，这是一个存在很久了的 Bug
> typeof null // 'object'
>
> PS：为什么会出现这种情况呢？因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息， 000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

- 如果我们想获得一个变量的正确类型，可以通过 Object.prototype.toString.call(xx) 。这样我们就可以获得类似 [object Type] 的字符串

```js
let a;
// 我们也可以这样判断 undefined
a === undefined;
// 但是 undefined 不是保留字，能够在低版本浏览器被赋值
let undefined = 1;
// 这样判断就会出错
// 所以可以用下面的方式来判断，并且代码量更少
// 因为 void 后面随便跟上一个组成表达式
// 返回就是 undefined
a === void 0;
```

# 类型转换

**转 Boolean**

> 在条件判断时，除了 undefined ， null ， false ， NaN ， '' ，0 ， -0 ，其他所有值都转为 true ，包括所有对象

**对象转基本类型**

> 对象在转换基本类型时，首先会调用 valueOf 然后调用 toString 。并且这两个方法你是可以重写的

```js
let a = {
  valueOf() {
    return 0;
  },
};
```

**四则运算符**

> 只有当加法运算时，其中一方是字符串类型，就会把另一个也转为字符串类型。其他运算只要其中一方是数字，那么另一方就转为数字。
> 并且加法运算会触发三种类型转换：将值转换为原始值，转换为数字，转换为字符串

```js
1 + "1"; // '11'
2 * "2"[(1, 2)] + // 4
  [2, 1]; // '1,22,1'
// [1, 2].toString() -> '1,2'
// [2, 1].toString() -> '2,1'
// '1,2' + '2
```

> 对于加号需要注意这个表达式

```js
"a" + +"b"; // -> "aNaN"
// 因为 + 'b' -> NaN
// 你也许在一些代码中看到过 + '1' -> 1
```

**== 操作符**

> 这里来解析一道题目 [] == ![] // -> true ，下面是这个表达式为何为 true 的步骤

```js
// [] 转成 true，然后取反变成 false
[] == false
// 根据第 8 条得出
[] == ToNumber(false)
[] == 0
// 根据第 10 条得出
ToPrimitive([]) == 0
// [].toString() -> ''
'' == 0
// 根据第 6 条得出
0 == 0 // -> true
```

**比较运算符**

- 如果是对象，就通过 toPrimitive 转换对象
- 如果是字符串，就通过 unicode 字符索引来比较

# instanceof

> instanceof 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 prototype
> 我们也可以试着实现一下 instanceof

```js
function instanceof(left, right) {
  // 获得类型的原型
  let prototype = right.prototype
  // 获得对象的原型
  left = left.__proto__
  // 判断对象的类型是否等于类型的原型
  while (true) {
    if (left === null)
      return false
    if (prototype === left)
      return true
    left = left.__proto__
  }
}
```

# 执行上下文

> 当执行 JS 代码时，会产生三种执行上下文

- 全局执行上下文
- 函数执行上下文
- eval 执行上下文

> 每个执行上下文中都有三个重要的属性

- 变量对象（ VO ），包含变量、函数声明和函数的形参，该属性只能在全局上下文中访问
- 作用域链（ JS 采用词法作用域，也就是说变量的作用域是在定义时就决定了）
- this

```js
var a = 10;
function foo(i) {
  var b = 20;
}
foo();
```

> 对于上述代码，执行栈中有两个上下文：全局上下文和函数 foo 上下文。

```js
stack = [globalContext, fooContext];
```

> 对于全局上下文来说， VO 大概是这样的

```js
globalContext.VO === globe
globalContext.VO = {
  a: undefined,
  foo: <Function>,
}
```

> 对于函数 foo 来说， VO 不能访问，只能访问到活动对象（ AO ）

```js
fooContext.VO === foo.AO
fooContext.AO {
  i: undefined,
  b: undefined,
  arguments: <>
}
// arguments 是函数独有的对象(箭头函数没有)
// 该对象是一个伪数组，有 `length` 属性且可以通过下标访问元素
// 该对象中的 `callee` 属性代表函数本身
// `caller` 属性代表函数的调用者
```

> 对于作用域链，可以把它理解成包含自身变量对象和上级变量对象的列表，通过 [[Scope]] 属性查找上级变量

```js
fooContext.[[Scope]] = [
  globalContext.VO
]
fooContext.Scope = fooContext.[[Scope]] + fooContext.VO
fooContext.Scope = [
   fooContext.VO,
   globalContext.VO
]
```

> 接下来让我们看一个老生常谈的例子， var

```js
b(); // call b
console.log(a); // undefined
var a = "Hello world";
function b() {
  console.log("call b");
}
```

> 想必以上的输出大家肯定都已经明白了，这是因为函数和变量提升的原因。通常提升的解释是说将声明的代码移动到了顶部，这其实没有什么错误，便于大家理解。但是更准确的解释应该是：在生成执行上下文时，会有两个阶段。第一个阶段是创建的阶段（具体步骤是创建 VO ）， JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined ，所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

- 在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

```js
b(); // call b second
function b() {
  console.log("call b fist");
}
function b() {
  console.log("call b second");
}
var b = "Hello world";
```

> var 会产生很多错误，所以在 ES6 中引入了 let 。 let 不能在声明前使用，但是这并不是常说的 let 不会提升， let 提升了声明但没有赋值，因为临时死区导致了并不能在声明前使用。

- 对于非匿名的立即执行函数需要注意以下一点

```js
var foo = 1(
  (function foo() {
    foo = 10;
    console.log(foo);
  })()
); // -> ƒ foo() { foo = 10 ; console.log(foo) }
```

> 因为当 JS 解释器在遇到非匿名的立即执行函数时，会创建一个辅助的特定对象，然后将函数名称作为这个对象的属性，因此函数内部才可以访问到 foo ，但是这个值又是只读的，所以对它的赋值并不生效，所以打印的结果还是这个函数，并且外部的值也没有发生更改。

```js
specialObject = {};
Scope = specialObject + Scope;
foo = new FunctionExpression;
foo.[[Scope]] = Scope;
specialObject.foo = foo; // {DontDelete}, {ReadOnly}
delete Scope[0]; // remove specialObject from the front of scope chain
```

# == 和 === 有什么区别

> 对于 == 来说，如果对比双方的类型不一样的话，就会进行类型转换
> 假如我们需要对比 x 和 y 是否相同，就会进行如下判断流程

1. 首先会判断两者类型是否相同。相同的话就是比大小了
2. 类型不相同的话，那么就会进行类型转换
3. 会先判断是否在对比 null 和 undefined ，是的话就会返回 true
4. 判断两者类型是否为 string 和 number ，是的话就会将字符串转换为 number
5. 判断其中一方是否为 boolean ，是的话就会把 boolean 转为 number 再进行判断
6. 判断其中一方是否为 object 且另一方为 string 、 number 或者 symbol ，是的话就会把 object 转为原始类型再进行判断

```js
'1' == { name: 'yck' }
↓
'1' == '[object Object]'
```

# 为什么 0.1 + 0.2 != 0.3

因为 JS 采用 IEEE 754 双精度版本（ 64 位），并且只要采用 IEEE 754 的语言都有该问题

> 我们都知道计算机是通过二进制来存储东西的，那么 0.1 在二进制中会表示为

```js
// (0011) 表示循环
0.1 = 2^-4 * 1.10011(0011)
```

> 我们可以发现， 0.1 在二进制中是无限循环的一些数字，其实不只是 0.1 ，其实很多十进制小数用二进制表示都是无限循环的。这样其实没什么问题，但是 JS 采用的浮点数标准却会裁剪掉我们的数字。

IEEE 754 双精度版本（64 位）将 64 位分为了三段

- 第一位用来表示符号
- 接下去的 11 位用来表示指数
- 其他的位数用来表示有效位，也就是用二进制表示 0.1 中的 10011(0011)

> 那么这些循环的数字被裁剪了，就会出现精度丢失的问题，也就造成了 0.1 不再是 0.1 了，而是变成了 0.100000000000000002

```js
0.100000000000000002 === 0.1; // true
```

> 那么同样的， 0.2 在二进制也是无限循环的，被裁剪后也失去了精度变成了 0.200000000000000002

```js
0.200000000000000002 === 0.2; // true
```

> 所以这两者相加不等于 0.3 而是 0.300000000000000004

```js
0.1 + 0.2 === 0.30000000000000004; // true
```

> 那么可能你又会有一个疑问，既然 0.1 不是 0.1 ，那为什么 console.log(0.1) 却是正确的呢？
> 因为在输入内容的时候，二进制被转换为了十进制，十进制又被转换为了字符串，在这个转换的过程中发生了取近似值的过程，所以打印出来的其实是一个近似值，你也可以通过以下代码来验证

```js
console.log(0.100000000000000002); // 0.1
```

解决

```js
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3; // true
```

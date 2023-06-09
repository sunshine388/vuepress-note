---
title: css
order: 2
---

css 相关面试题

<!-- more -->

[50 道 CSS 基础面试题（附答案）](https://segmentfault.com/a/1190000013325778)

[《50 道 CSS 基础面试题（附答案）》中的答案真的就只是答案吗？](https://segmentfault.com/a/1190000013860482)

## css 优先级是怎么计算的

- 第一优先级：!important 会覆盖页面内任何位置的元素样式
- 内联样式，如 style="color: green"，权值为 1000
- ID 选择器，如#app，权值为 0100
- 类、伪类、属性选择器，如.foo, :first-child, div[class="foo"]，权值为 0010
- 标签、伪元素选择器，如 div::first-line，权值为 0001
- 通配符、子类选择器、兄弟选择器，如\*, >, +，权值为 0000
- 继承的样式没有权值

## CSS 不同选择器的权重(CSS 层叠的规则)

- !important 规则最重要，大于其它规则
- 行内样式规则，加 1000
- 对于选择器中给定的各个 ID 属性值，加 100
- 对于选择器中给定的各个类属性、属性选择器或者伪类选择器，加 10
- 对于选择其中给定的各个元素标签选择器，加 1
- 如果权值一样，则按照样式规则的先后顺序来应用，顺序靠后的覆盖靠前的规则

## CSS 优先级算法如何计算？

- 优先级就近原则，同权重情况下样式定义最近者为准
- 载入样式以最后载入的定位为准
- 优先级为: !important > id > class > tag ; !important 比 内联优先级高

## css sprite 是什么,有什么优缺点

- 概念：将多个小图片拼接到一个图片中。通过 background-position 和元素尺寸调节需要显示的背景图案。
- 优点：
  - 减少 HTTP 请求数，极大地提高页面加载速度
  - 增加图片信息重复度，提高压缩比，减少图片大小
  - 更换风格方便，只需在一张或几张图片上修改颜色或样式即可实现
- 缺点：
  - 图片合并麻烦
  - 维护麻烦，修改一个图片可能需要从新布局整个图片，样式

## display: none; 与 visibility: hidden; 的区别

联系：它们都能让元素不可见
区别：

- display:none ;会让元素完全从渲染树中消失，渲染的时候不占据任何空间；visibility: hidden ;不会让元素从渲染树消失，渲染师元素继续占据空间，只是内容不可见
- display: none ;是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示 ；visibility: hidden; 是继承属性，子孙节点消失由于继承了 hidden，通过设置 visibility: visible; 可以让子孙节点显式
- 修改常规流中元素的 display 通常会造成文档重排。修改 visibility 属性只会造成本元素的重绘。
- 读屏器不会读取 display: none ;元素内容；会读取 visibility: hidden; 元素内容

## link 与 @import 的区别

1. link 是 HTML 方式， @import 是 CSS 方式
2. link 最大限度支持并行下载， @import 过多嵌套导致串行下载，出现 FOUC (文档样式短暂失效)
3. link 可以通过 rel="alternate stylesheet" 指定候选样式
4. 浏览器对 link 支持早于 @import ，可以使用 @import 对老浏览器隐藏样式
5. @import 必须在样式规则之前，可以在 css 文件中引用其他文件
6. 总体来说： link 优于 @import

## 什么是 FOUC?如何避免

- Flash Of Unstyled Content ：用户定义样式表加载之前浏览器使用默认样式显示文档，用户样式加载渲染之后再从新显示文档，造成页面闪烁。
- 解决方法：把样式表放到文档的 \<head>

## display、float、position 的关系

- 如果 display 取值为 none ，那么 position 和 float 都不起作用，这种情况下元素不产生框
- 否则，如果 position 取值为 absolute 或者 fixed ，框就是绝对定位的， float 的计算值为 none ， display 根据下面的表格进行调整。
- 否则，如果 float 不是 none ，框是浮动的， display 根据下表进行调整
- 否则，如果元素是根元素， display 根据下表进行调整
- 其他情况下 display 的值为指定值
- 总结起来：绝对定位、浮动、根元素都需要调整 display

## 清除浮动的几种方式，各自的优缺点

- 父级 div 定义 height
- 结尾处加空 div 标签 clear:both
- 父级 div 定义伪类 :after 和 zoom
- 父级 div 定义 overflow:hidden
- 父级 div 也浮动，需要定义宽度
- 结尾处加 br 标签 clear:both

比较好的是第 3 种方式，好多网站都这么用

## 谈谈浮动和清除浮动

浮动的框可以向左或向右移动，直到他的外边缘碰到包含框或另一个浮动框的边框为止。由于浮动框不在文档的普通流中，所以文档的普通流的块框表现得就像浮动框不存在一样。浮动的块框会漂浮在文档普通流的块框上

浮动带来的问题：

1. 父元素的高度无法被撑开，影响与父元素同级的元素
2. 与浮动元素同级的非浮动元素（内联元素）会跟随其后
3. 若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面显示的结构。

## 为什么要初始化 CSS 样式

- 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对 CSS 初始化往往会出现浏览器之间的页面显示差异。
- 当然，初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化

## css3 有哪些新特性

- 新增各种 css 选择器
- 圆角 border-radius
- 多列布局
- 阴影和反射
- 文字特效 text-shadow
- 线性渐变
- 旋转 transform

## CSS3 新增伪类有那些？

- p:first-of-type 选择属于其父元素的首个 \<p> 元素的每个 \<p> 元素
- p:last-of-type 选择属于其父元素的最后 \<p> 元素的每个 \<p>元素。
- p:only-of-type 选择属于其父元素唯一的\<p>元素的每个 \<p>元素。
- p:only-child 选择属于其父元素的唯一子元素的每个 \<p>元素。
- p:nth-child(2) 选择属于其父元素的第二个子元素的每个\<p>元素。
- :after 在元素之前添加内容,也可以用来做清除浮动。
- :before 在元素之后添加内容。
- :enabled 已启用的表单元素。
- :disabled 已禁用的表单元素。
- :checked 单选框或复选框被选中。

## display 有哪些值？说明他们的作用

- block 转换成块状元素。
- inline 转换成行内元素。
- none 设置元素不可见。
- inline-block 象行内元素一样显示，但其内容象块类型元素一样显示。
- list-item 象块类型元素一样显示，并添加样式列表标记。
- table 此元素会作为块级表格来显示
- inherit 规定应该从父元素继承 display 属性的值

## position 的值， relative 和 absolute 定位原点是

- absolute ：生成绝对定位的元素，相对于 static 定位以外的第一个父元素进行定位
- fixed ：生成绝对定位的元素，相对于浏览器窗口进行定位
- relative ：生成相对定位的元素，相对于其正常位置进行定位
- static 默认值。没有定位，元素出现在正常的流中
- inherit 规定从父元素继承 position 属性的值

## display:inline-block 什么时候不会显示间隙？

- 移除空格
- 使用 margin 负值
- 使用 font-size:0
- letter-spacing
- word-spacing

## PNG\GIF\JPG 的区别及如何选

GIF

- 8 位像素， 256 色
- 无损压缩
- 支持简单动画
- 支持 boolean 透明
- 适合简单动画

JPEG

- 颜色限于 256
- 有损压缩
- 可控制压缩质量
- 不支持透明
- 适合照片

PNG

- 有 PNG8 和 truecolor PNG
- PNG8 类似 GIF 颜色上限为 256 ，文件小，支持 alpha 透明度，无动画
- 适合图标、背景、按钮

## 行内元素 float:left 后是否变为块级元素？

行内元素设置成浮动之后变得更加像是 inline-block （行内块级元素，设置成这个属性的元素会同时拥有行内和块级的特性，最明显的不同是它的默认宽度不是 100% ），这时候给行内元素设置 padding-top 和 padding-bottom 或者 width 、 height 都是有效果的

## 在网页中的应该使用奇数还是偶数的字体？为什么呢？

偶数字号相对更容易和 web 设计的其他部分构成比例关系

## ::before 和 :after 中双冒号和单冒号 有什么区别？解释一下这 2 个伪元素的作用

- 单冒号( : )用于 CSS3 伪类，双冒号( :: )用于 CSS3 伪元素
- 用于区分伪类和伪元素

## 伪类和伪元素的区别

- 伪类表状态
- 伪元素是真的有元素
- 前者单冒号，后者双冒号

## 如果需要手动写动画，你认为最小时间间隔是多久，为什么？

多数显示器默认频率是 60Hz ，即 1 秒刷新 60 次，所以理论上最小间隔为 1/60\*1000ms ＝ 16.7ms

## CSS 合并方法

避免使用 @import 引入多个 css 文件，可以使用 CSS 工具将 CSS 合并为一个 CSS 文件，例如使用 Sass\Compass 等

## 列出你所知道可以改变页面布局的属性

position 、 display 、 float 、 width 、 height 、 margin 、 padding 、 top 、left 、 right 、`

## CSS 在性能优化方面的实践

- css 压缩与合并、 Gzip 压缩
- css 文件放在 head 里、不要用 @import
- 尽量用缩写、避免用滤镜、合理使用选择器

## CSS3 动画（简单动画的实现，如旋转等）

- 依靠 CSS3 中提出的三个属性： transition 、 transform 、 animation
- transition ：定义了元素在变化过程中是怎么样的，包含 transition-property 、transition-duration 、 transition-timing-function 、 transition-delay 。
- transform ：定义元素的变化结果，包含 rotate 、 scale 、 skew 、 translate 。
- animation ：动画定义了动作的每一帧（ @keyframes ）有什么效果，包括 animation-name ， animation-duration 、 animation-timing-function 、 animation-delay 、animation-iteration-count 、 animation-direction

## 说一说 css3 的 animation

- css3 的 animation 是 css3 新增的动画属性，这个 css3 动画的每一帧是通过 @keyframes 来声明的， keyframes 声明了动画的名称，通过 from 、 to 或者是百分比来定义每一帧动画元素的状态，通过 animation-name 来引用这个动画，同时 css3 动画也可以定义动画运行的时长、动画开始时间、动画播放方向、动画循环次数、动画播放的方式，
- 这些相关的动画子属性有：
  - animation-name 定义动画名；
  - animation-duration 定义动画播放的时长；
  - animation-delay 定义动画延迟播放的时间；
  - animation-direction 定义动画的播放方向；
  - animation-iteration-count 定义播放次数；
  - animation-fill-mode 定义动画播放之后的状态；
  - animation-play-state 定义播放状态，如暂停运行等；
  - animation-timing-function 定义播放的方式，如恒速播放、艰涩播放等。

## base64 的原理及优缺点

优点可以加密，减少了 HTTTP 请求
缺点是需要消耗 CPU 进行编解码

## base64 的使用

- 用于减少 HTTP 请求
- 适用于小图片
- base64 的体积约为原图的 4/3

## stylus/sass/less 区别

- 均具有“变量”、“混合”、“嵌套”、“继承”、“颜色混合”五大基本特性
- Scss 和 LESS 语法较为严谨， LESS 要求一定要使用大括号“{}”， Scss 和 Stylus 可以通过缩进表示层次与嵌套关系
- Scss 无全局变量的概念， LESS 和 Stylus 有类似于其它语言的作用域概念
- Sass 是基于 Ruby 语言的，而 LESS 和 Stylus 可以基于 NodeJS NPM 下载相应库后进行编译；

## Sass、LESS 是什么？大家为什么要使用他们

- 他们是 CSS 预处理器。他是 CSS 上的一种抽象层。他们是一种特殊的语法/语言编译成 CSS 。
- 例如 Less 是一种动态样式语言. 将 CSS 赋予了动态语言的特性，如变量，继承，运算， 函数。LESS 既可以在客户端上运行 (支持 IE 6+ , Webkit , Firefox )，也可一在服务端运行(借助 Node.js )

为什么要使用它们？

- 结构清晰，便于扩展。
- 可以方便地屏蔽浏览器私有语法差异。这个不用多说，封装对浏览器语法差异的重复处理，减少无意义的机械劳动。
- 可以轻松实现多重继承。
- 完全兼容 CSS 代码，可以方便地应用到老项目中。LESS 只- 是在 CSS 语法上做了扩展，所以老的 CSS 代码也可以与 LESS 代码一同编译

## postcss 的作用

- 可以直观的理解为：它就是一个平台。为什么说它是一个平台呢？因为我们直接用它，感觉不能干什么事情，但是如果让一些插件在它上面跑，那么将会很强大
- PostCSS 提供了一个解析器，它能够将 CSS 解析成抽象语法树
- 通过在 PostCSS 这个平台上，我们能够开发一些插件，来处理我们的 CSS ，比如热门的： autoprefixer
- postcss 可以对 sass 处理过后的 css 再处理 最常见的就是 autoprefixer

## 自定义字体的使用场景

宣传/品牌/ banner 等固定文案、字体图标

## 如何美化 CheckBox

- \<label> 属性 for 和 id
- 隐藏原生的 \<input>
- :checked + \<label>

## 请用 CSS 写一个简单的幻灯片效果页面

使用 animation 动画实现一个简单的幻灯片效果

```js
.ani{
  width: 480px;
  height: 320px;
  margin: 50px auto;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0,0,0,1);
  background-size: cover;
  background-position: center;
  -webkit-animation-name: "loops";//动画名称
  -webkit-animation-duration: 10s;
  -webkit-animation-iteration-count: infinite;//动画无限次播放
}
@-webkit-keyframes "loops" {
  0% {
    background-color: black;
  }
  25% {
    background-color: red;
  }
  50% {
    background-color: pink;
  }
  75% {
    background-color: blue;
  }
  100% {
    background-color: yellow;
  }
}
```

## 什么是外边距重叠？重叠的结果是什么？

外边距重叠就是 margin-collapse

- 在 CSS 当中，相邻的两个盒子（可能是兄弟关系也可能是祖先关系）的外边距可以结合成一个单独的外边距。这种合并外边距的方式被称为折叠，并且因而所结合成的外边距称为折叠外边距。

折叠结果遵循下列计算规则：

- 两个相邻的外边距都是正数时，折叠结果是它们两者之间较大的值。
- 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值。
- 两个外边距一正一负时，折叠结果是两者的相加的和。

## rgba()和 opacity 的透明效果有什么不同

- rgba() 和 opacity 都能实现透明效果，但最大的不同是 opacity 作用于元素，以及元素内的所有内容的透明度，
- 而 rgba() 只作用于元素的颜色或其背景色。（设置 rgba 透明的元素的子元素不会继承透明效果！）

## css 中可以让文字在垂直和水平方向上重叠的两个属性是什么

垂直方向： line-height
水平方向： letter-spacing

## 如何垂直居中一个浮动元素

```js
//方法一：已知元素的高宽
#div1{
  background-color:#6699FF;
  width:200px;
  height:200px;
  position: absolute; //父元素需要相对定位
  top: 50%;
  left: 50%;
  margin-top:-100px ; //二分之一的height，width
  margin-left: -100px;
}
//方法二:
#div1{
  width: 200px;
  height: 200px;
  background-color: #6699FF;
  margin:auto;
  position: absolute; //父元素需要相对定位
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
```

## 如何垂直居中一个 \<img> ?（用更简便的方法。）

```js
#container //<img>的容器设置如下
{
 display:table-cell;
 text-align:center;
 vertical-align:middle;
}
```

## px 和 em 的区别

- px 和 em 都是长度单位，区别是， px 的值是固定的，指定是多少就是多少，计算比较容易。 em 的值不是固定的，并且 em 会继承父级元素的字体大小。
- 浏览器的默认字体高都是 16px 。所以未经调整的浏览器都符合: 1em=16px 。那么 12px=0.75em , 10px=0.625em

## 知道 css 有个 content 属性吗？有什么作用？有什么应用？

css 的 content 属性专门应用在 before/after 伪元素上，用于来插入生成内容。最常见的应用是利用伪类清除浮动。

```js
//一种常见利用伪类清除浮动的代码
.clearfix:after {
  content:"."; //这里利用到了content属性
  display:block;
  height:0;
  visibility:hidden;
  clear:both;
}
.clearfix {
  *zoom:1;
}
```

## 如何使用 CSS 实现硬件加速？

> 硬件加速是指通过创建独立的复合图层，让 GPU 来渲染这个图层，从而提高性能，

- 一般触发硬件加速的 CSS 属性有 transform 、 opacity 、 filter ，为了避免 2D 动画在开始和结束的时候的 repaint 操作，一般使用 tranform:translateZ(0)

## 重绘和回流（重排）是什么，如何避免

- DOM 的变化影响到了元素的几何属性（宽高），浏览器重新计算元素的几何属性，其他元素的几何属性和位置也会受到影响，浏览器需要重新构造渲染树，这个过程称为重排，浏览器将受到影响的部分重新绘制到屏幕上的过程称为重绘。

引起重排的原因有

- 添加或者删除可见的 DOM 元素，
- 元素位置、尺寸、内容改变，
- 浏览器页面初始化，
- 浏览器窗口尺寸改变，重排一定重绘，重绘不一定重排，

减少重绘和重排的方法：

- 不在布局信息改变时做 DOM 查询
- 使用 cssText 或者 className 一次性改变属性
- 使用 fragment
- 对于多次重排的元素，如动画，使用绝对定位脱离文档流，让他的改变不影响到其他元素

## 几种常见的 CSS 布局

流体布局

```js
<div class="container">
  <div class="left"></div>
  <div class="right"></div>
  <div class="main"></div>
</div>

.left {
  float: left;
  width: 100px;
  height: 200px;
  background: red;
}
.right {
  float: right;
  width: 200px;
  height: 200px;
  background: blue;
}
.main {
  margin-left: 120px;
  margin-right: 220px;
  height: 200px;
  background: green;
}
```

圣杯布局

```js
<div class="container">
  <div class="left"></div>
  <div class="right"></div>
  <div class="main"></div>
</div>

.container {
  margin-left: 120px;
  margin-right: 220px;
}
.main {
  float: left;
  width: 100%;
  height: 300px;
  background: green;
}
.left {
  position: relative;
  left: -120px;
  float: left;
  height: 300px;
  width: 100px;
  margin-left: -100%;
  background: red;
}
.right {
  position: relative;
  right: -220px;
  float: right;
  height: 300px;
  width: 200px;
  margin-left: -200px;
  background: blue;
}
```

双飞翼布局

```js
<div class="content">
  <div class="main"></div>
</div>
<div class="left"></div>
<div class="right"></div>

.content {
  float: left;
  width: 100%;
}
.main {
  height: 200px;
  margin-left: 110px;
  margin-right: 220px;
  background: green;
}
.main::after {
  content: "";
  display: block;
  font-size: 0;
  height: 0;
  zoom: 1;
  clear: both;
}
.left {
  float: left;
  height: 200px;
  width: 100px;
  margin-left: -100%;
  background: red;
}
.right {
  float: right;
  height: 200px;
  width: 200px;
  margin-left: -200px;
  background: blue;
}
```

## 自适应布局

思路：

- 左侧浮动或者绝对定位，然后右侧 margin 撑开
- 使用 \<div> 包含，然后靠负 margin 形成 bfc
- 使用 flex

## 水平居中的方法

- 元素为行内元素，设置父元素 text-align:center
- 如果元素宽度固定，可以设置左右 margin 为 auto ;
- 如果元素为绝对定位，设置父元素 position 为 relative ，元素设 left:0;right:0;margin:auto;
- 使用 flex-box 布局，指定 justify-content 属性为 center
- display 设置为 tabel-ceil

## 垂直居中的方法

- 将显示方式设置为表格， display:table-cell ,同时设置 vertial-align：middle
- 使用 flex 布局，设置为 align-item：center
- 绝对定位中设置 bottom:0,top:0 ,并设置 margin:auto
- 绝对定位中固定高度时设置 top:50%，margin-top 值为高度一半的负值
- 文本垂直居中设置 line-height 为 height 值

## 两种以上方式实现已知或者未知宽度的垂直水平居中

```css
// 1
.wraper {
  position: relative;
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    margin: -50px 0 0 -50px;
  }
}
// 2
.wraper {
  position: relative;
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
// 3
.wraper {
  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
}
// 4
.wraper {
  display: table;
  .box {
    display: table-cell;
    vertical-align: middle;
  }
}
```

## 左边宽度固定，右边自适应

html 结构

```html
<div class="outer">
  <div class="left">固定宽度</div>
  <div class="right">自适应宽度</div>
</div>
```

> 在外层 div （类名为 outer ）的 div 中，有两个子 div ，类名分别为 left 和 right ，其中 left 为固定宽度，而 right 为自适应宽度

**方法 1：左侧 div 设置成浮动：float: left，右侧 div 宽度会自拉升适应**

```css
.outer {
  width: 100%;
  height: 500px;
  background-color: yellow;
}
.left {
  width: 200px;
  height: 200px;
  background-color: red;
  float: left;
}
.right {
  height: 200px;
  background-color: blue;
}
```

**方法 2：对右侧:div 进行绝对定位，然后再设置 right=0，即可以实现宽度自适应**

> 绝对定位元素的第一个高级特性就是其具有自动伸缩的功能，当我们将 width 设置为 auto 的时候（或者不设置，默认为 auto ），绝对定位元素会根据其 left 和 right 自动伸缩其大小

```css
.outer {
  width: 100%;
  height: 500px;
  background-color: yellow;
  position: relative;
}
.left {
  width: 200px;
  height: 200px;
  background-color: red;
}
.right {
  height: 200px;
  background-color: blue;
  position: absolute;
  left: 200px;
  top: 0;
  right: 0;
}
```

**方法 3：将左侧 div 进行绝对定位，然后右侧 div 设置 margin-left: 200px**

```css
.outer {
  width: 100%;
  height: 500px;
  background-color: yellow;
  position: relative;
}
.left {
  width: 200px;
  height: 200px;
  background-color: red;
  position: absolute;
}
.right {
  height: 200px;
  background-color: blue;
  margin-left: 200px;
}
```

**方法 4：使用 flex 布局**

```css
.outer {
  width: 100%;
  height: 500px;
  background-color: yellow;
  display: flex;
  flex-direction: row;
}
.left {
  width: 200px;
  height: 200px;
  background-color: red;
}
.right {
  height: 200px;
  background-color: blue;
  flex: 1;
}
```

## 左边定宽，右边自适应方案：float + margin，float + calc

```js
/* 方案1 */
.left {
  width: 120px;
  float: left;
}
.right {
  margin-left: 120px;
}
/* 方案2 */
.left {
  width: 120px;
  float: left;
}
.right {
  width: calc(100% - 120px);
  float: left;
}
```

## 左右两边定宽，中间自适应：float，float + calc, 圣杯布局（设置 BFC，margin 负值法），flex

```js
.wrap {
  width: 100%;
  height: 200px;
}
.wrap > div {
  height: 100%;
}
/* 方案1 */
.left {
  width: 120px;
  float: left;
 }
.right {
  float: right;
  width: 120px;
}
.center {
  margin: 0 120px;
}
/* 方案2 */
.left {
  width: 120px;
  float: left;
}
.right {
  float: right;
  width: 120px;
}
.center {
  width: calc(100% - 240px);
  margin-left: 120px;
}
/* 方案3 */
.wrap {
  display: flex;
}
.left {
  width: 120px;
}
.right {
  width: 120px;
}
.center {
  flex: 1;
}
```

## 如何实现小于 12px 的字体效果

transform:scale() 这个属性只可以缩放可以定义宽高的元素，而行内元素是没有宽高的，我们可以加上一个 display:inline-block ;
transform: scale(0.7);

## offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 的区别

- offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 e.getBoundingClientRect()相同
- clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
- scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸

## 常见兼容性问题？

- png24 位的图片在 iE6 浏览器上出现背景，解决方案是做成 PNG8
- 浏览器默认的 margin 和 padding 不同。解决方案是加一个全局的 \*{margin:0;padding:0;} 来统一，但是全局效率很低，一般是如下这样解决：
  ```js
  body,ul,li,ol,dl,dt,dd,form,input,h1,h2,h3,h4,h5,h6,p{
    margin:0;
    padding:0;
  }
  ```
- IE 下, event 对象有 x , y 属性,但是没有 pageX , pageY 属性
- Firefox 下, event 对象有 pageX , pageY 属性,但是没有 x,y 属性

## 现在要你完成一个 Dialog 组件，说说你设计的思路？它应该有什么功能？

- 该组件需要提供 hook 指定渲染位置，默认渲染在 body 下面。
- 然后改组件可以指定外层样式，如宽度等
- 组件外层还需要一层 mask 来遮住底层内容，点击 mask 可以执行传进来的 onCancel 函数关闭 Dialog 。
- 另外组件是可控的，需要外层传入 visible 表示是否可见。
- 然后 Dialog 可能需要自定义头 head 和底部 footer ，默认有头部和底部，底部有一个确认按钮和取消按钮，确认按钮会执行外部传进来的 onOk 事件，然后取消按钮会执行外部传进来的 onCancel 事件。
- 当组件的 visible 为 true 时候，设置 body 的 overflow 为 hidden ，隐藏 body 的滚动条，反之显示滚动条。
- 组件高度可能大于页面高度，组件内部需要滚动条。
- 只有组件的 visible 有变化且为 ture 时候，才重渲染组件内的所有内容

## 盒模型：content（元素内容） + padding（内边距） + border（边框） + margin（外边距）

延伸： box-sizing

- content-box ：默认值，总宽度 = margin + border + padding + width
- border-box ：盒子宽度包含 padding 和 border ， 总宽度 = margin + width
- inherit ：从父元素继承 box-sizing 属性

## 介绍一下标准的 CSS 的盒子模型？低版本 IE 的盒子模型有什么不同的

- 有两种， IE 盒子模型、 W3C 盒子模型；
- 盒模型： 内容(content)、填充( padding )、边界( margin )、 边框( border )；
- 区 别： IE 的 content 部分把 border 和 padding 计算了进去;

## 如何创建块级格式化上下文(block formatting context)，BFC 有什么用

- 创建规则：
  - 根元素
  - 浮动元素（ float 不取值为 none ）
  - 绝对定位元素（ position 取值为 absolute 或 fixed ）
  - display 取值为 inline-block 、 table-cell 、 table-caption 、 flex 、 inline-flex 之一的元素
  - overflow 不取值为 visible 的元素
- 作用：
  - 可以包含浮动元素
  - 不被浮动元素覆盖
  - 阻止父子元素的 margin 折叠

## 对 BFC 规范的理解？

它决定了元素如何对其内容进行定位,以及与其他元素的关系和相互作用

定位方案：

1. 内部的 Box 会在垂直方向上一个接一个放置。
2. Box 垂直方向的距离由 margin 决定，属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。
3. 每个元素的 margin box 的左边，与包含块 border box 的左边相接触。
4. BFC 的区域不会与 float box 重叠。
5. BFC 是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。
6. 计算 BFC 的高度时，浮动元素也会参与计算。

## BFC、IFC、GFC、FFC：FC（Formatting Contexts），格式化上 下文

> BFC ：块级格式化上下文，容器里面的子元素不会在布局上影响到外面的元素，反之也是如此(按照这个理念来想，只要脱离文档流，肯定就能产生 BFC )。产生 BFC 方式如下

- float 的值不为 none 。
- overflow 的值不为 visible 。
- position 的值不为 relative 和 static 。
- display 的值为 table-cell , table-caption , inline-block 中的任何一个

用处？

- 常见的多栏布局，结合块级别元素浮动，里面的元素则是在一个相对隔离的环境里运行

> IFC ：内联格式化上下文， IFC 的 line box （线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的 padding/margin 影响)。

> IFC 中的 line box 一般左右都贴紧整个 IFC ，但是会因为 float 元素而扰乱。 float 元素会位于 IFC 与 line box 之间，使得 line box 宽度缩短。 同个 ifc 下的多个 line box 高度会不同。 IFC 中时不可能有块级元素的，当插入块级元素时（如 p 中插入 div ）会产生两个匿名块与 div 分隔开，即产生两个 IFC ，每个 IFC 对外表现为块级元素，与 div 垂直排列。

用处？

- 水平居中：当一个块要在环境中水平居中时，设置其为 inline-block 则会在外层产生 IFC ，通过 text-align 则可以使其水平居中。
- 垂直居中：创建一个 IFC ，用其中一个元素撑开父元素的高度，然后设置其 vertical-align : middle ，其他行内元素则可以在此父元素下垂直居中

> - GFC：网格布局格式化上下文（ display: grid ）
> - FFC：自适应格式化上下文（ display: flex ）

---
title: html篇
---

html 相关面试题

<!-- more -->

# src 和 href 的区别

src 和 href 都是用来引用外部的资源，区别如下：

- src：表示对资源的引用，它指向的内容会嵌入到当前标签所在的位置。src 会将其指向的资源下载并应⽤到⽂档内，如请求 js 脚本。当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执⾏完毕，所以⼀般 js 脚本会放在页面底部。
- href：表示超文本引用，它指向一些网络资源，建立和当前元素或本文档的链接关系。当浏览器识别到它他指向的⽂件时，就会并⾏下载资源，不会停⽌对当前⽂档的处理。 常用在 a、link 等标签上。

# 对 HTML 语义化的理解

语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化） 。通俗来讲就是用正确的标签做正确的事情。

- 用正确的标签做正确的事情！
- HTML 语义化就是让页面的内容结构化，便于对浏览器、搜索引擎解析；
- 在没有样式 CSS 情况下也以一种文档格式显示，并且是容易阅读的。
- 搜索引擎的爬虫依赖于标记来确定上下文和各个关键字的权重，利于 SEO 。
- 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解

语义化的优点如下：

- 对机器友好，带有语义的文字表现力丰富，更适合搜索引擎的爬虫爬取有效信息，有利于 SEO。除此之外，语义类还支持读屏软件，根据文章可以自动生成目录；
- 对开发者友好，使用语义类标签增强了可读性，结构更加清晰，开发者能清晰的看出网页的结构，便于团队的开发与维护。

常见的语义化标签：

```js
<header></header>  头部
<nav></nav>  导航栏
<section></section>  区块（有语义化的div）
<main></main>  主要区域
<article></article>  主要内容
<aside></aside>  侧边栏
<footer></footer>  底部
```

# 前端需要注意哪些 SEO

- 合理的 title 、 description 、 keywords ：搜索对着三项的权重逐个减小， title 值强调重点即可，重要关键词出现不要超过 2 次，而且要靠前，不同页面 title 要有所不同； description 把页面内容高度概括，长度合适，不可过分堆砌关键词，不同页面 description 有所不同； keywords 列举出重要关键词即可
- 语义化的 HTML 代码，符合 W3C 规范：语义化代码让搜索引擎容易理解网页
- 重要内容 HTML 代码放在最前：搜索引擎抓取 HTML 顺序是从上到下，有的搜索引擎对抓取长度有限制，保证重要内容一定会被抓取
- 重要内容不要用 js 输出：爬虫不会执行 js 获取内容
- 少用 iframe ：搜索引擎不会抓取 iframe 中的内容
- 非装饰性图片必须加 alt
- 提高网站速度：网站速度是搜索引擎排序的一个重要指标

# \<img> 的 title 和 alt 有什么区别

- title 通常当鼠标滑动到元素上的时候显示
- alt 是 \<img>的特有属性，是图片内容的等价描述，用于图片无法加载时显示读屏器阅读图片。可提图片高可访问性，除了纯装饰图片外都必须设置有意义的值，搜索引擎会重点分析。
- 在 IE 浏览器下会在没有 title 时把 alt 当成 tool tip 显示

# html5 有哪些新特性、移除了那些元素

- HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加
  - 绘画 canvas
  - 地理(Geolocation) API
  - 拖拽释放(Drag and drop) API
  - 用于媒介回放的 video 和 audio 元素（音视频 api）
  - 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失
  - sessionStorage 的数据在浏览器关闭后自动删除
  - 语意化更好的内容元素，比如 header、nav、footer、aside、article、section
  - 表单控件， calendar 、 date 、 time 、 email 、 url 、 search
  - 新的技术 webworker 、 websocket 、 Geolocation
- 移除的元素：
  - 纯表现的元素： basefont 、 big 、 center 、 font 、 s 、 strike 、 tt 、 u
  - 对可用性产生负面影响的元素： frame 、 frameset 、 noframes
- 支持 HTML5 新标签：
  - IE8/IE7/IE6 支持通过 document.createElement 方法产生的标签
  - 可以利用这一特性让这些浏览器支持 HTML5 新标签
  - 浏览器支持新标签后，还需要添加标签默认的样式
- 当然也可以直接使用成熟的框架、比如 html5shim

# iframe 有那些优缺点

优点：

- 解决加载缓慢的第三方内容如图标和广告等的加载问题
- Security sandbox
- 并行加载脚本
  缺点：
- iframe 会阻塞主页面的 Onload 事件
- 即使内容为空，加载也需要时间
- 没有语意
- 搜索引擎的检索程序无法解读这种页面，不利于 SEO
- iframe 和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载
- 使用 iframe 之前需要考虑这两个缺点。如果需要使用 iframe ，最好是通过 javascript 动态给 iframe 添加 src 属性值，这样可以绕开以上两个问题

# WEB 标准以及 W3C 标准是什么

标签闭合、标签小写、不乱嵌套、使用外链 css 和 js 、结构行为表现的分离、文件下载与页面速度更快、内容能被更多的用户所访问、内容能被更广泛的设备所访问、更少的代码和组件，容易维护、改版方便，不需要变动页面内容、提供打印版本而不需要复制内容、提高网站易用性

# xhtml 和 html 有什么区别

1. 所有的标记都必须要有一个相应的结束标记
2. 所有标签的元素和属性的名字都必须使用小写
3. 所有的 XML 标记都必须合理嵌套
4. 所有的属性必须用引号 "" 括起来
5. 把所有 < 和 & 特殊符号用编码表示
6. 给所有属性赋一个值
7. 不要在注释内容中使用 "--"
8. 图片必须有说明文字

- 一个是功能上的差别
  - 主要是 XHTML 可兼容各大浏览器、手机以及 PDA ，并且浏览器也能快速正确地编译网页
- 另外是书写习惯的差别
  - XHTML 元素必须被正确地嵌套，闭合，区分大小写，文档必须拥有根元素

# Doctype 作用? 严格模式与混杂模式如何区分？它们有何意义?

- 页面被加载的时， link 会同时被加载，而 @imort 页面被加载的时， link 会同时被加载，而 @import 引用的 CSS 会等到页面被加载完再加载 import 只在 IE5 以上才能识别，而 link 是 XHTML 标签，无兼容问题 link 方式的样式的权重 高于 @import 的权重
- <!DOCTYPE> 声明位于文档中的最前面，处于 \<html> 标签之前。告知浏览器的解析器，
- 用什么文档类型 规范来解析这个文档严格模式的排版和 JS 运作模式是 以该浏览器支持的最高标准运行
- 在混杂模式中，页面以宽松的向后兼容的方式显示。模拟老式浏览器的行为以防止站点无法工作。 DOCTYPE 不存在或格式不正确会导致文档以混杂模式呈现

# 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？行内元素和块级元素有什么区别？

- 行内元素有： a b span img input select strong
- 块级元素有： div ul ol li dl dt dd h1 h2 h3 h4… p
- 空元素： \<br> \<hr> \<img> \<input> \<link> \<meta>
- 行内元素不可以设置宽高，不独占一行
- 块级元素可以设置宽高，独占一行

# HTML 全局属性(global attribute)有哪些

- class :为元素设置类标识
- data-\* : 为元素增加自定义属性
- draggable : 设置元素是否可拖拽
- id : 元素 id ，文档内唯一
- lang : 元素内容的的语言
- style : 行内 css 样式
- title : 元素相关的建议信息

# Canvas 和 SVG 有什么区别？

- svg 绘制出来的每一个图形的元素都是独立的 DOM 节点，能够方便的绑定事件或用来修改。 canvas 输出的是一整幅画布
- svg 输出的图形是矢量图形，后期可以修改参数来自由放大缩小，不会失真和锯齿。而 canvas 输出标量画布，就像一张图片一样，放大会失真或者锯齿

# HTML5 为什么只需要写 \<!DOCTYPE HTML>

- HTML5 不基于 SGML ，因此不需要对 DTD 进行引用，但是需要 doctype 来规范浏览器的行为
- 而 HTML4.01 基于 SGML ,所以需要对 DTD 进行引用，才能告知浏览器文档所使用的文档类型

# 如何在页面上实现一个圆形的可点击区域

- svg
- border-radius
- 纯 js 实现 需要求一个点在不在圆上简单算法、获取鼠标坐标等等

# viewport

```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale
 // width 设置viewport宽度，为一个正整数，或字符串‘device-width’
 // device-width 设备宽度
 // height 设置viewport高度，一般设置了宽度，会自动解析出高度，可以不用设置
 // initial-scale 默认缩放比例（初始缩放比例），为一个数字，可以带小数
 // minimum-scale 允许用户最小缩放比例，为一个数字，可以带小数
 // maximum-scale 允许用户最大缩放比例，为一个数字，可以带小数
 // user-scalable 是否允许手动缩放
```

- 延伸提问
  - 怎样处理 移动端 1px 被 渲染成 2px 问题

局部处理

- mate 标签中的 viewport 属性 ， initial-scale 设置为 1
- rem 按照设计稿标准走，外加利用 transfrome 的 scale(0.5) 缩小一倍即可；

全局处理

- mate 标签中的 viewport 属性 ， initial-scale 设置为 0.5
- rem 按照设计稿标准走即可

# meta viewport 相关

```html
<!DOCTYPE html>
<!--H5标准声明，使用 HTML5 doctype，不区分大小写-->
<head lang="en">
  <!--标准的 lang 属性写法-->
  <meta charset="utf-8" />
  <!--声明文档使用的字符编码-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <!--优先使用 IE 最新版本和 Chrome-->
  <meta name="description" content="不超过150个字符" />
  <!--页面描述-->
  <meta name="keywords" content="" />
  <!-- 页面关键词-->
  <meta name="author" content="name, email@gmail.com" />
  <!--网页作者-->
  <meta name="robots" content="index,follow" />
  <!--搜索引擎抓取-->
  <meta
    name="viewport"
    content="initial-scale=1,"
    maximum-scale="3,"
    minimum-scale="1,"
    user-scalable="no"
  />
  <!--为移动设备添加 viewport-->
  <meta name="apple-mobile-web-app-title" content="标题" />
  <!--iOS 设备 begin-->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <!--添加到主屏后的标题（iOS 6 新增）是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏-->
  <meta
    name="apple-itunes-app"
    content="app-id=myAppStoreID,"
    affiliate-data="myAffiliateData,"
    app-argument="myURL"
  />
  <!--添加智能 App 广告条 Smart App Banner（iOS 6+ Safari）-->
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="format-detection" content="telphone=no," email="no" />
  <!--设置苹果工具栏颜色-->
  <meta name="renderer" content="webkit" />
  <!-- 启用360浏览器的极速模式(webkit)-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--避免IE使用兼容模式-->
  <meta http-equiv="Cache-Control" content="no-siteapp" />
  <!--不让百度转码-->
  <meta name="HandheldFriendly" content="true" />
  <!--针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓-->
  <meta name="MobileOptimized" content="320″" />
  <!--微软的老式浏览器-->
  <meta name="screen-orientation" content="portrait" />
  <!--uc强制竖屏-->
  <meta name="x5-orientation" content="portrait" />
  <!--QQ强制竖屏-->
  <meta name="full-screen" content="yes" />
  <!--UC强制全屏-->
  <meta name="x5-fullscreen" content="true" />
  <!--QQ强制全屏-->
  <meta name="browsermode" content="application" />
  <!--UC应用模式-->
  <meta name="x5-page-mode" content="app" />
  <!-- QQ应用模式-->
  <meta name="msapplication-tap-highlight" content="no" />
  <!--windows phone 点击无高亮设置页面不缓存-->
  <meta http-equiv="pragma" content="no-cache" />
  <meta http-equiv="cache-control" content="no-cache" />
  <meta http-equiv="expires" content="0″" />
</head>
```

# div+css 的布局较 table 布局有什么优点？

- 改版的时候更方便 只要改 css 文件。
- 页面加载速度更快、结构化清晰、页面显示简洁。
- 表现与结构相分离。
- 易于优化（ seo ）搜索引擎更友好，排名更容易靠前

# a：img 的 alt 与 title 有何异同？b：strong 与 em 的异同？

- alt(alt text) :为不能显示图像、窗体或 applets 的用户代理（ UA ）， alt 属性用来指定替换文字。替换文字的语言由 lang 属性指定。(在 IE 浏览器下会在没有 title 时把 alt 当成 tool tip 显示)
- title(tool tip) :该属性为设置该属性的元素提供建议性的信息
- strong :粗体强调标签，强调，表示内容的重要性
- em :斜体强调标签，更强烈强调，表示内容的强调点

# 你能描述一下渐进增强和优雅降级之间的不同吗

- 渐进增强：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。
- 优雅降级：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

> 区别：优雅降级是从复杂的现状开始，并试图减少用户体验的供给，而渐进增强则是从一个非常基础的，能够起作用的版本开始，并不断扩充，以适应未来环境的需要。降级（功能衰减）意味着往回看；而渐进增强则意味着朝前看，同时保证其根基处于安全地带

# 简述一下 src 与 href 的区别

- src 用于替换当前元素，href 用于在当前文档和引用资源之间确立联系。
- src 是 source 的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求 src 资源时会将其指向的资源下载并应用到文档内，例如 js 脚本，img 图片和 frame 等元素
  > \<script src ="js.js">\</script> 当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将 js 脚本放在底部而不是头部
- href 是 Hypertext Reference 的缩写，指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，如果我们在文档中添加
- \<link href="common.css" rel="stylesheet"/> 那么浏览器会识别该文档为 css 文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用 link 方式来加载 css ，而不是使用 @import 方式

# 知道的网页制作会用到的图片格式有哪些？

png-8 、 png-24 、 jpeg 、 gif 、 svg

> 但是上面的那些都不是面试官想要的最后答案。面试官希望听到是 Webp , Apng 。（是否有关注新技术，新鲜事物）

- Webp： WebP 格式，谷歌（google）开发的一种旨在加快图片加载速度的图片格式。图片压缩体积大约只有 JPEG 的 2/3 ，并能节省大量的服务器带宽资源和数据空间。
- Facebook Ebay 等知名网站已经开始测试并使用 WebP 格式。在质量相同的情况下，WebP 格式图像的体积要比 JPEG 格式图像小 40% 。
- Apng：全称是 "Animated Portable Network Graphics" , 是 PNG 的位图动画扩展，可以实现 png 格式的动态图片效果。04 年诞生，但一直得不到各大浏览器厂商的支持，直到日前得到 iOS safari 8 的支持，有望代替 GIF 成为下一代动态图标准

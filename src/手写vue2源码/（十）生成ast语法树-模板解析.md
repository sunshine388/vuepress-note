---
title: （十）生成ast语法树-模板解析
order: 10
---

生成 ast 语法树-代码实现

<!--more -->

## 模板解析

模板解析的方式：对模板不停截取，直至全部解析完毕，可以使用 while 循环

```js
// src/compiler/index.js#parserHTML

function parserHTML(html) {
  while(html){
    // 解析标签or文本，看第一个字符是否为尖角号 <
    let index = html.indexOf('<');
    if(index == 0){
      console.log("是标签")
    } else{
      console.log("是文本")
    }
  }
}
```

### parseStartTag 解析开始标签

包含尖叫号 < 的情况，有可能是开始标签，但也有可能是结束标签
所以当为标签时，先使用正则匹配开始标签；如果没有匹配成功，再使用结束标签进行匹配

parseStartTag 方法：匹配开始标签，返回匹配结果
备注：匹配结果的索引 1 可以得到标签名，属性后续解析

```js
// src/compiler/index.js#parserHTML

function parserHTML(html) {

  /**
   * 匹配开始标签，返回匹配结果
   */
  function parseStartTag() {
    // 匹配开始标签，开始标签名为索引 1
    const start = html.match(startTagOpen);
    // 构造匹配结果，包含标签名和属性
    const match = {
      tagName:start[1],
      attrs:[]
    }
    console.log("match结果：" + match)
  }

  // 对模板不停截取，直至全部解析完毕
  while (html) {
    // 解析标签和文本(看开头是否为<)
    let index = html.indexOf('<');
    if (index == 0) {
      console.log("解析 html：" + html + ",结果：是标签")
      // 如果是标签，继续解析开始标签和属性
      const startTagMatch = parseStartTag();// 匹配开始标签，返回匹配结果
      if (startTagMatch) {  // 匹配到开始标签
        continue; // 如果是开始标签，无需执行下面逻辑，继续下次 while 解析后续内容
      }
      // 没有匹配到开始标签，此时有可能为结束标签 </div>，继续处理结束标签
      if (html.match(endTag)) {// 匹配到结束标签
        continue; // 如果是结束标签，无需执行下面逻辑，继续下次 while 解析后续内容
      }
    } else {
      console.log("解析 html：" + html + ",结果：是文本")
    }
  }
}
```

为了实现对已经匹配到标签进行截取，
需要 advance 方法：前进，即截取至当前已解析位置

```js
// src/compiler/index.js#parserHTML

function parserHTML(html) {

  /**
   * 截取字符串
   * @param {*} len 截取长度
   */
  function advance(len){
    html = html.substring(len);
  }

  /**
   * 匹配开始标签,返回匹配结果
   */
  function parseStartTag() {
    // 匹配开始标签，开始标签名为索引 1
    const start = html.match(startTagOpen);
    // 构造匹配结果，包含标签名和属性
    const match = {
      tagName:start[1],
      attrs:[]
    }
    console.log("match 结果：" + match)
    // 截取匹配到的结果
    advance(start[0].length)
    console.log("截取后的 html：" + html)
  }
	...
}
```

### 解析开始标签中的属性

```js
id="app">{{message}}</div>
```

开始标签中，可能存在多个属性，此部分需要循环进行处理

```js
// src/compiler/index.js#parserHTML#parseStartTag

function parseStartTag() {
  const start = html.match(startTagOpen);
  const match = {
    tagName: start[1],
    attrs: []
  }
  console.log("match 结果：" + match)
  // 截取匹配到的结果
  advance(start[0].length)
  console.log("截取后的 html：" + html)

  let end;  // 是否匹配到开始标签的结束符号 > 或 />
  let attr; // 存储属性匹配的结果
  // 匹配属性且不能为开始的结束标签，例如：<div>，到 > 就已经结束了，不再继续匹配该标签内的属性
  // 		attr = html.match(attribute)  匹配属性并赋值当前属性的匹配结果
  // 		!(end = html.match(startTagClose))   没有匹配到开始标签的关闭符号 > 或 />
  while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
    // 将匹配到的属性，push 到 attrs 数组中，匹配到关闭符号 >，while 就结束
    match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
    advance(attr[0].length)// 截取匹配到的属性 xxx=xxx
  }
  // 匹配到关闭符号 >,当前标签处理完成 while 结束
  // 此时，<div id="app" 处理完成，需连同关闭符号 > 一起被截取掉
  if (end) {
    advance(end[0].length)
  }

  // 开始标签处理完成后，返回匹配结果：tagName 标签名 + attrs属性
  return match
}
```

### 开始标签的处理步骤

```js
<div id="app" a=1 b=2>

处理过程：

	<开头，说明是标签：可能是开始标签，也可能是结束标签
  匹配正则 startTagOpen，获取属性名和属性
  匹配“<div”						剩		 “ id="app" a=1 b=2>”
	匹配“ id="app"”				剩		 “ a=1 b=2>”
	匹配“ a=1”						剩		 “ b=2>”
	匹配“ b=2”						剩		 “>”
	匹配“>”

匹配到 “>”，while 循环就终止了
```

至此，开始标签就解析完成了

### 处理开始标签、结束标签和文本

继续，将开始标签的状态（开始标签、结束标签、文本标签）发射出去
编写三个发射状态的方法，分别用于向外发射开始标签、结束标签、文本标签

```js
// src/compiler/index.js#parserHTML#start
// src/compiler/index.js#parserHTML#end
// src/compiler/index.js#parserHTML#text

// 开始标签
function start(tagName, attrs) {
  console.log("start", tagName, attrs)
}
// 结束标签
function end(tagName) {
  console.log("end", tagName)
}
// 文本标签
function text(chars) {
  console.log("text", chars)
}
```

当匹配到开始标签、结束标签、文本时，将数据发送出去

```js
// src/compiler/index.js#parserHTML#parseStartTag

/**
  * 匹配开始标签,返回匹配结果
  */
function parseStartTag() {
  const start = html.match(startTagOpen);
  if(start){
    const match = {
      tagName: start[1],
      attrs: []
    }
    advance(start[0].length)
    let end;
    let attr;
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
      advance(attr[0].length)
    }
    if (end) {
      advance(end[0].length)
    }
    return match
  }
  return false;
}

while (html) {
  let index = html.indexOf('<');
  if (index == 0) {
    console.log("解析 html：" + html + ",结果：是标签")
    // 如果是标签，继续解析开始标签和属性
    const startTagMatch = parseStartTag();
    console.log("开始标签的匹配结果 startTagMatch = " + JSON.stringify(startTagMatch))

    if (startTagMatch) {
      // 匹配到开始标签，调用start方法，传递标签名和属性
      start(startTagMatch.tagName, startTagMatch.attrs)
      continue; // 如果是开始标签，不需要继续向下走了，继续 while 解析后面的部分
    }

    // 如果开始标签没有匹配到，有可能是结束标签 </div>
    let endTagMatch;
    if (endTagMatch = html.match(endTag)) {// 匹配到了，说明是结束标签
      // 匹配到开始标签，调用start方法，传递标签名和属性
      end(endTagMatch[1])
      advance(endTagMatch[0].length)
      continue; // 如果是结束标签，不需要继续向下走了，继续 while 解析后面的部分
    }
  }

  if(index > 0){	// 文本
    // 将文本取出来并发射出去,再从 html 中拿掉
    let chars = html.substring(0,index) // hello</div>
    text(chars);
    advance(chars.length)
  }
}
```

至此，已经拿到了标签名、属性等，但此时还不是树形结构，没有形成一棵树

## 测试一个较复杂的模板解析

```js
<body>
  <div id="app" a='1' b=2 > <p>{{message}} <span>Hello Vue</span></p></div>
  <script src="/dist/vue.js"></script>
  <script>
    let vm = new Vue({
      el: '#app',
      data() {
        return { message:  "Brave" }
      },
    });
  </script>
</body>
```

打印结果：

```js
进入 state.js - initData，数据初始化操作
***** 进入 $mount，el = #app*****
获取真实的元素，el = [object HTMLDivElement]
options 中没有 render , 继续取 template
options 中没有 template, 取 el.outerHTML = <div id="app" a="1" b="2"> <p>{{message}} <span>Hello Vue</span></p></div>
***** 进入 compileToFunction：将 template 编译为 render 函数 *****
***** 进入 parserHTML：将模板编译成 AST 语法树*****
解析 html：<div id="app" a="1" b="2"> <p>{{message}} <span>Hello Vue</span></p></div>,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： <div id="app" a="1" b="2"> <p>{{message}} <span>Hello Vue</span></p></div>*****
html.match(startTagOpen) 结果:{"tagName":"div","attrs":[]}
截取匹配内容后的 html: id="app" a="1" b="2"> <p>{{message}} <span>Hello Vue</span></p></div>
===============================
匹配到属性 attr = [" id=\"app\"","id","=","app",null,null]
截取匹配内容后的 html: a="1" b="2"> <p>{{message}} <span>Hello Vue</span></p></div>
===============================
匹配到属性 attr = [" a=\"1\"","a","=","1",null,null]
截取匹配内容后的 html: b="2"> <p>{{message}} <span>Hello Vue</span></p></div>
===============================
匹配到属性 attr = [" b=\"2\"","b","=","2",null,null]
截取匹配内容后的 html:> <p>{{message}} <span>Hello Vue</span></p></div>
===============================
匹配关闭符号结果 html.match(startTagClose):[">",""]
截取匹配内容后的 html: <p>{{message}} <span>Hello Vue</span></p></div>
===============================
>>>>> 开始标签的匹配结果 startTagMatch = {"tagName":"div","attrs":[{"name":"id","value":"app"},{"name":"a","value":"1"},{"name":"b","value":"2"}]}
发射匹配到的开始标签-start,tagName = div,attrs = [{"name":"id","value":"app"},{"name":"a","value":"1"},{"name":"b","value":"2"}]
解析 html： <p>{{message}} <span>Hello Vue</span></p></div>,结果：是文本
发射匹配到的文本-text,chars =
截取匹配内容后的 html:<p>{{message}} <span>Hello Vue</span></p></div>
===============================
解析 html：<p>{{message}} <span>Hello Vue</span></p></div>,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： <p>{{message}} <span>Hello Vue</span></p></div>*****
html.match(startTagOpen) 结果:{"tagName":"p","attrs":[]}
截取匹配内容后的 html:>{{message}} <span>Hello Vue</span></p></div>
===============================
匹配关闭符号结果 html.match(startTagClose):[">",""]
截取匹配内容后的 html:{{message}} <span>Hello Vue</span></p></div>
===============================
>>>>> 开始标签的匹配结果 startTagMatch = {"tagName":"p","attrs":[]}
发射匹配到的开始标签-start,tagName = p,attrs = []
解析 html：{{message}} <span>Hello Vue</span></p></div>,结果：是文本
发射匹配到的文本-text,chars = {{message}}
截取匹配内容后的 html:<span>Hello Vue</span></p></div>
===============================
解析 html：<span>Hello Vue</span></p></div>,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： <span>Hello Vue</span></p></div>*****
html.match(startTagOpen) 结果:{"tagName":"span","attrs":[]}
截取匹配内容后的 html:>Hello Vue</span></p></div>
===============================
匹配关闭符号结果 html.match(startTagClose):[">",""]
截取匹配内容后的 html:Hello Vue</span></p></div>
===============================
>>>>> 开始标签的匹配结果 startTagMatch = {"tagName":"span","attrs":[]}
发射匹配到的开始标签-start,tagName = span,attrs = []
解析 html：Hello Vue</span></p></div>,结果：是文本
发射匹配到的文本-text,chars = Hello Vue
截取匹配内容后的 html:</span></p></div>
===============================
解析 html：</span></p></div>,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： </span></p></div>*****
未匹配到开始标签，返回 false
===============================
发射匹配到的结束标签-end,tagName = span
截取匹配内容后的 html:</p></div>
===============================
解析 html：</p></div>,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： </p></div>*****
未匹配到开始标签，返回 false
===============================
发射匹配到的结束标签-end,tagName = p
截取匹配内容后的 html:</div>
===============================
解析 html：</div>,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： </div>*****
未匹配到开始标签，返回 false
===============================
发射匹配到的结束标签-end,tagName = div
截取匹配内容后的 html:
===============================
当前 template 模板，已全部解析完成
```

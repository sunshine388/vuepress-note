---
title: （十一）生成ast语法树-构造树形结构
order: 11
---

生成 ast 语法树 - 构造树形结构

<!-- more -->

## 构建树形结构

### 需要描述什么

将 html 模板构造成为 ast 语法树，使用 js 树形结构来描述 html 语法

对于一个 html 模板来说，主要有以下几点需要被描述和记录：

1. 标签
2. 属性
3. 文本
4. html 结构的层级关系，即父子关系

### ast 节点元素的数据结构

```js
// 构建父子关系
function createASTElement(tag, attrs, parent) {
  return {
    tag, // 标签名
    type: 1, // 元素
    children: [], // 儿子
    parent, // 父亲
    attrs, // 属性
  };
}
```

### 处理开始标签

处理开始标签的逻辑

> 取当前栈中最后一个标签作为父节点，并创建 ast 节点入栈，
>
> 如果是第一个节点就自动成为整棵树的根节点

代码实现

```js
// 处理开始标签,如:[div,p]
function start(tag, attrs) {
  // 取栈中最后一个标签，作为父节点
  let parent = stack[stack.length - 1];
  // 创建当前 ast 节点
  let element = createASTElement(tag, attrs, parent);
  // 第一个作为根节点
  if (root == null) root = element;
  // 如果存在父亲，就父子相认（为当前节点设置父亲；同时为父亲设置儿子）
  if (parent) {
    element.parent = parent;
    parent.children.push(element);
  }
  stack.push(element);
}
```

### 处理结束标签

处理结束标签的逻辑

> 抛出栈中最后一个标签（即与当前结束标签成对的开始标签）
>
> 验证栈中抛出的标签是否与当前结束标签成对

代码实现

```js
// 处理结束标签
function end(tagName) {
  console.log("发射匹配到的结束标签-end,tagName = " + tagName);
  // 从栈中抛出结束标签
  let endTag = stack.pop();
  // check:抛出的结束标签名与当前结束标签名是否一直
  // 开始/结束标签的特点是成对的，当抛出的元素名与当前元素名不一致是报错
  if (endTag.tag != tagName) console.log("标签出错");
}
```

### 处理文本

处理文本的逻辑

- 取当前栈中最后一个标签作为父节点
- 删除文本中可能存在的空白字符
- 无需入栈，直接将文本绑定为父节点的儿子

代码实现

```js
// 处理文本（文本中可能包含空白字符）
function text(chars) {
  console.log("发射匹配到的文本-text,chars = " + chars);
  // 找到文本的父亲：文本的父亲，就是当前栈中的最后一个元素
  let parent = stack[stack.length - 1];
  // 删除空格文本中的可能存在的空白字符：将空格替换为空
  chars = chars.replace(/\s/g, "");
  if (chars) {
    // 绑定父子关系
    parent.children.push({
      type: 2, // type=2 表示文本类型
      text: chars,
    });
  }
}
```

## 代码重构

### 模块化

将 parserHTML 逻辑进行封装，并提取为单独 js 文件：src/compile/parser.js#parserHTML

```js
// src/compile/parser.js

// 匹配标签名：aa-xxx
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// 命名空间标签：aa:aa-xxx
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 匹配标签名(索引1)：<aa:aa-xxx
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 匹配标签名(索引1)：</aa:aa-xxxdsadsa>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 匹配属性（索引 1 为属性 key、索引 3、4、5 其中一直为属性值）：aaa="xxx"、aaa='xxx'、aaa=xxx
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 匹配结束标签：> 或 />
const startTagClose = /^\s*(\/?)>/;
// 匹配 {{   xxx    }} ，匹配到 xxx
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function parserHTML(html) {
  console.log("***** 进入 parserHTML：将模板编译成 AST 语法树 *****");
  let stack = [];
  let root = null;
  // 构建父子关系
  function createASTElement(tag, attrs, parent) {
    return {
      tag, // 标签名
      type: 1, // 元素类型为 1
      children: [], // 儿子
      parent, // 父亲
      attrs, // 属性
    };
  }
  // 开始标签,如:[div,p]
  function start(tag, attrs) {
    console.log(
      "发射匹配到的开始标签-start,tag = " +
        tag +
        ",attrs = " +
        JSON.stringify(attrs)
    );
    // 遇到开始标签，就取栈中最后一个，作为父节点
    let parent = stack[stack.length - 1];
    let element = createASTElement(tag, attrs, parent);
    // 还没有根节点时，作为根节点
    if (root == null) root = element;
    if (parent) {
      // 父节点存在
      element.parent = parent; // 为当前节点设置父节点
      parent.children.push(element); // 同时，当前节点也称为父节点的子节点
    }
    stack.push(element);
  }
  // 结束标签
  function end(tagName) {
    console.log("发射匹配到的结束标签-end,tagName = " + tagName);
    // 如果是结束标签，就从栈中抛出
    let endTag = stack.pop();
    // check:抛出的结束标签名与当前结束标签名是否一直
    if (endTag.tag != tagName) console.log("标签出错");
  }
  // 文本
  function text(chars) {
    console.log("发射匹配到的文本-text,chars = " + chars);
    // 文本直接放到前一个中 注意：文本可能有空白字符
    let parent = stack[stack.length - 1];
    chars = chars.replace(/\s/g, ""); // 将空格替换为空，即删除空格
    if (chars) {
      parent.children.push({
        type: 2, // 文本类型为 2
        text: chars,
      });
    }
  }
  /**
   * 截取字符串
   * @param {*} len 截取长度
   */
  function advance(len) {
    html = html.substring(len);
    console.log("截取匹配内容后的 html:" + html);
    console.log("===============================");
  }

  /**
   * 匹配开始标签,返回匹配结果
   */
  function parseStartTag() {
    console.log(
      "***** 进入 parseStartTag，尝试解析开始标签，当前 html： " +
        html +
        "*****"
    );
    // 匹配开始标签，开始标签名为索引 1
    const start = html.match(startTagOpen);
    if (start) {
      // 匹配到开始标签再处理
      // 构造匹配结果，包含：标签名 + 属性
      const match = {
        tagName: start[1],
        attrs: [],
      };
      console.log("html.match(startTagOpen) 结果:" + JSON.stringify(match));
      // 截取匹配到的结果
      advance(start[0].length);
      let end; // 是否匹配到开始标签的结束符号>或/>
      let attr; // 存储属性匹配的结果
      // 匹配属性且不能为开始的结束标签，例如：<div>，到>就已经结束了，不再继续匹配该标签内的属性
      //    attr = html.match(attribute)  匹配属性并赋值当前属性的匹配结果
      //    !(end = html.match(startTagClose))   没有匹配到开始标签的关闭符号>或/>
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        // 将匹配到的属性,push到attrs数组中，匹配到关闭符号>,while 就结束
        console.log("匹配到属性 attr = " + JSON.stringify(attr));
        // console.log("匹配到属性 name = " + attr[1] + "value = " + attr[3] || attr[4] || attr[5])
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
        advance(attr[0].length); // 截取匹配到的属性 xxx=xxx
      }
      // 匹配到关闭符号>,当前标签处理完成 while 结束,
      // 此时，<div id="app" 处理完成，需连同关闭符号>一起被截取掉
      if (end) {
        console.log(
          "匹配关闭符号结果 html.match(startTagClose):" + JSON.stringify(end)
        );
        advance(end[0].length);
      }

      // 开始标签处理完成后，返回匹配结果：tagName标签名 + attrs属性
      console.log(
        ">>>>> 开始标签的匹配结果 startTagMatch = " + JSON.stringify(match)
      );
      return match;
    }
    console.log("未匹配到开始标签，返回 false");
    console.log("===============================");
    return false;
  }

  // 对模板不停截取，直至全部解析完毕
  while (html) {
    // 解析标签和文本(看开头是否为<)
    let index = html.indexOf("<");
    if (index == 0) {
      // 标签
      console.log("解析 html：" + html + ",结果：是标签");
      // 如果是标签，继续解析开始标签和属性
      const startTagMatch = parseStartTag(); // 匹配开始标签，返回匹配结果
      if (startTagMatch) {
        // 匹配到了，说明是开始标签
        // 匹配到开始标签，调用start方法，传递标签名和属性
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue; // 如果是开始标签，就不需要继续向下走了，继续 while 解析后面的部分
      }
      // 如果开始标签没有匹配到，有可能是结束标签 </div>
      let endTagMatch;
      if ((endTagMatch = html.match(endTag))) {
        // 匹配到了，说明是结束标签
        // 匹配到开始标签，调用start方法，传递标签名和属性
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue; // 如果是结束标签，也不需要继续向下走了，继续 while 解析后面的部分
      }
    } else {
      // 文本
      console.log("解析 html：" + html + ",结果：是文本");
    }

    // 文本：index > 0
    if (index > 0) {
      // 将文本取出来并发射出去,再从 html 中拿掉
      let chars = html.substring(0, index); // hello</div>
      text(chars);
      advance(chars.length);
    }
  }
  console.log("当前 template 模板，已全部解析完成");
  return root;
}
```

### 导入模块

src/compile/index.js 中，引入 parserHTML：

```js
// src/compile/index.js

import { parserHTML } from "./parser";

export function compileToFunction(template) {
  console.log(
    "***** 进入 compileToFunction：将 template 编译为 render 函数 *****"
  );
  // 1，将模板变成 AST 语法树
  let ast = parserHTML(template);
  console.log("解析 HTML 返回 ast 语法树====>");
  console.log(ast);
}
```

### 测试 ast 构建逻辑

```js
<div id="app" a='1' b=2 > <p>{{message}} <span>Hello Vue</span></p></div>
```

![](/images/手写vue2源码/（十一）生成ast语法树-构造树形结构/打印输出1.png)

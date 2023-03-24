---
title: （九）生成ast语法树-正则说明
order: 9
---

生成 ast 语法树-正则说明

<!-- more -->

## 模板解析

### 模板解析的说明

```js
export function compileToFunction(template) {
  // 1，将模板变成 AST 语法树
  let ast = parserHTML(template);
  // 2，使用 AST 生成 render 函数
  let code = generate(ast);
}
```

compileToFunction 主要做了以上两件事：

> 将模板变成 AST 语法树
>
> 使用 AST 生成 render 函数

而将 html 模板编译为 ast 语法树，就是用 js 对象的树形结构来描述 HTML 语法；这里需要对 html 模板进行解析，而解析的方式就是使用正则不断进行匹配和处理；

### 模板的解析方式

1. 使用正则对 html 模板进行顺序解析和处理
2. 每处理完一段，就将处理完的这部分截取掉
3. 就这样不停的进行解析和截取，直至将整个模板全部解析完毕

```html
<!-- start：从头开始，使用正则不断进行匹配和截取 -->
<div>abcdefg<span></span></div>		开始标签：<div>
abcdefg<span></span></div>				文本：abcdefg
<span></span></div>								开始标签：<span>
</span></div>											结束标签：</span>
</div>														结束标签：</div>
<!-- end：全部匹配完成 -->
```

可以使用 while 循环，对模板不停截取，直至全部解析完毕

```js
function parserHTML(html) {
  while (html) {
    // todo...
  }
}
```

标签还是文本？

> 内容开头的第一个字符是否为尖角号 < ：
>
> 如果是尖角号，说明是标签；如果不是尖角号，说明是文本

## 正则说明

### Vue2 相关的正则

```js
// 标签名 a-aaa
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// 命名空间标签 aa:aa-xxx
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
// 结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
// 匹配属性
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 匹配标签结束的 >
const startTagClose = /^\s*(\/?)>/;
// 匹配 {{ }} 表达式
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
```

### 匹配标签名

匹配标签名 aa-xxx

```js
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
```

正则解析

> 正则的开始和结尾被/包裹
>
> \\\\-\\\\编译成\\-\\. （第一个\，\\\-是转译中划线-的；第二个\，\\\.是转译.的，）

测试匹配结果

```js
let reg = new RegExp(ncname);
console.log(reg); // 	/[a-zA-Z_][\-\.0-9_a-zA-Z]*/
console.log(reg.test("a-aaa")); // true	任意小写字符 a-z，中间有-，后面可以方字符
```

### 命名空间标签

命名空间标签：aa:aa-xxx

```js
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
```

正则解析

```
(?:${ncname}\\:)?
	?: - 表示匹配但是不捕获
	后面可以有一个冒号
  ? 可有可无
  如：aa:
${ncname} 标签名
	如：aa:aa-xxx	此类命名空间标签使用较少
```

### 匹配开始标签-开始部分

```js
// 匹配标签名(索引1)：<aa:aa-xxx
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
console.log(startTagOpen)  //  /^<((?:[a-zA-Z_][\-\.0-9_a-zA-Z]*\:)?[a-zA-Z_][\-\.0-9_a-zA-Z]*)/
console.log(startTagOpen.test('<aa:aa-xxx')) // true

// 测试匹配结果：
console.log('<aa:aa-xxx'.match(startTagOpen))
[
  '<aa:aa-xxx',
  'aa:aa-xxx',			// 开始标签的标签名
  index: 0,
  input: '<aa:aa-xxx',
  groups: undefined
]
```

### 匹配结束标签

```js
// 匹配标签名(索引1)：</aa:aa-xxxdsadsa>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
console.log(endTag) // /^<\/((?:[a-zA-Z_][\-\.0-9_a-zA-Z]*\:)?[a-zA-Z_][\-\.0-9_a-zA-Z]*)[^>]*>/

正则解析：
^<\\/		<符号开头，后面跟一个/
${qnameCapture}[^>]		中间可以放很多但不能是>
*>	最后必须要有一个>

// 测试匹配结果：
console.log('</aa:aa-xxxdsadsa>'.match(endTag))
[
  '</aa:aa-xxxdsadsa>',
  'aa:aa-xxxdsadsa', 		// 结束标签的标签名
  index: 0,
  input: '</aa:aa-xxxdsadsa>',
  groups: undefined
]
```

### 匹配属性

```js
// 匹配属性（索引 1 为属性 key、索引 3、4、5 其中一直为属性值）：aaa="xxx"、aaa='xxx'、aaa=xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

正则解析：
^\s*  n个空格开头（0 个或 n 个）
[^\s"'<>\/=]+
 	^\s	不是空格
	^\s"'<>\/=	不是空格，不是尖脚号，不是反引号的 n 个字符
?:\s*(=)\s*
  空格和空格之间可以夹一个=等号
?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)
	不是空格，可能是单引号、可能是双引号、可能没有引号

// 情况 1：双引号的情况，aaa="xxx"
console.log('aaa="xxx"'.match(attribute))
[
  'aaa="xxx"',
  'aaa',
  '=',
  'xxx',
  undefined,
  undefined,
  index: 0,
  input: 'aaa="xxx"',
  groups: undefined
]
// 此时，索引3是有值的(xxx),4、5是undefined

// 情况 2：单引号的情况，aaa='xxx'，会匹配到下一个位置
console.log(`aaa='xxx'`.match(attribute))
[
  "aaa='xxx'",
  'aaa',
  '=',
  undefined,
  'xxx',
  undefined,
  index: 0,
  input: "aaa='xxx'",
  groups: undefined
]
// 此时，会匹配到索引 4，即第二个位置

// 情况 3：没有引号的情况,aaa=xxx，第三个位置就是不带单引号的
console.log('aaa=xxx'.match(attribute))
[
  'aaa=xxx',
  'aaa',
  '=',
  undefined,
  undefined,
  'xxx',
  index: 0,
  input: 'aaa=xxx',
  groups: undefined
]
// 索引3、4是undefined，5 是有值的(xxx),表示匹配到了最后一位

应用：
属性的key：[1]
属性的值：[3]||[4]||[5]    索引 3、4、5 哪个有值取哪个
```

### 匹配开始标签-闭合部分

```js
// 匹配结束标签：>
const startTagClose = /^\s*(\/?)>/;

正则解析：

^\s* 	空格 n 个
(\/?)>	尖角号有以下两种情况
	/>	自闭合
  >		没有/的闭合
```

### 匹配表达式

```js
// 匹配 {{   xxx    }} ，匹配到 xxx
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
```

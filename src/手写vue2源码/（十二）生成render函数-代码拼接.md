---
title: （十二）生成render函数-代码拼接
order: 12
---

使用 ast 语法树生成 render 函数 - 代码拼接部分

<!-- more -->

## render 函数之代码拼接：generate(ast)

代码生成的方式，就是进行字符串拼接

```js
// src/compiler/index.js

function generate(ast) {
  let code = `_c('${ast.tag}',${
    ast.attrs.length ? JSON.stringify({}) : "undefined" // 暂不处理属性，后面单独处理
  }${
    ast.children ? `,[]` : "" // 暂不处理儿子，后面单独处理
  })`;

  return code;
}

// _c('div',{},[]}
```

## 处理属性：genProps(ast.attrs)

```js
// src/compiler/index.js

// 将 attrs 数组格式化为：{key=val,key=val,}
function genProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    // 使用 JSON.stringify 将 value 转为 string 类型
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`; // 去掉最后一位多余的逗号，再在外边套上{}
}

function generate(ast) {
  let code = `_c('${ast.tag}',${
    ast.attrs.length ? genProps(ast.attrs) : "undefined"
  }${ast.children ? `,[]` : ""})`;
  return code;
}

export function compileToFunction(template) {
  let ast = parserHTML(template);
  let code = generate(ast);
  console.log(code);
}

// _c('div',{id:"app",a:"1",b:"2"},[]}
```

## 处理属性中的样式

在 style 属性中，会存在样式，也需要在属性中机型处理

```html
<div id="app" a="1" b="2" style="color: red;background: blue;">
  <p>
    {{message}}
    <span>Hello Vue</span>
  </p>
</div>
```

继续将样式处理成为为一个对象：

```js
// src/compiler/index.js#genProps

// 将 attrs 数组格式化为：{key=val,key=val,}
function genProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    // 将样式处理为对象 {name:id, value:'app'}
    if (attr.name == "style") {
      // <div id="app" style="color: red;background: blue;"></div>
      // 使用 replace 进行正则匹配，对样式进行 key，value 替换
      // ^;: 不是分号(分割属性和值)、冒号(结尾)
      let styles = {};
      attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
        styles[arguments[1]] = arguments[2];
      });
      attr.value = styles;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

// 打印输出：
// _c('div',
//    {id:"app",a:"1",b:"2",style:{"color":" red","background":" blue"}},
//    []}
```

## 递归深层处理儿子：genChildren

继续处理儿子，demo 如下：

```html
<div id="app" a="1" b="2" style="color: red;background: blue;">
  <p>
    {{message}}
    <span>Hello Vue 1</span>
    <span>Hello Vue 2</span>
    <span>Hello Vue 3</span>
  </p>
</div>
```

```js
// _c(div,{},c1,c2,c3...)
function generate(ast) {
  let children = genChildren(ast);
  let code = `_c('${ast.tag}',${
    ast.attrs.length ? genProps(ast.attrs) : "undefined"
  }${children ? `,${children}` : ""})`;
  return code;
}

function genChildren(el) {
  console.log("===== genChildren =====");
  let children = el.children;
  if (children) {
    console.log("存在 children, 开始遍历处理子节点．．．", children);
    let result = children.map((item) => gen(item)).join(",");
    console.log("子节点处理完成，result = " + JSON.stringify(result));
    return result;
  }
  console.log("不存在 children, 直接返回 false");
  return false;
}

function gen(el) {
  console.log("===== gen ===== el = ", el);
  if (el.type == 1) {
    console.log("元素标签 tag = " + el.tag + "，generate继续递归处理");
    return generate(el); // 递归处理当前元素
  } else {
    console.log("文本类型,text = " + el.text);
    return el.text;
  }
}

// _c('div',{id:"app",a:"1",b:"2",style:{"color":" red","background":" blue"}},
//    _c('p',undefined,_v(_s(message)),
//       _c('span',undefined,_v('HelloVue1')),
//       _c('span',undefined,_v('HelloVue2')),
//       _c('span',undefined,_v('HelloVue3'))
//    )
// )
```

![](/images/手写vue2源码/（十二）生成render函数-代码拼接/打印输出1.png)

## 为文本类型包装 \_v

```js
function gen(el) {
  console.log("===== gen ===== el = ", el);
  if (el.type == 1) {
    //
    console.log("元素标签 tag = " + el.tag + "，generate继续递归处理");
    return generate(el); // 如果是元素就递归的生成
  } else {
    // 文本类型
    let text = el.text;
    console.log("文本类型,text = " + text);
    return `_v('${text}')`; // 包装_v
  }
}
```

## 为变量包装 \_s

```
1. 文本 -> 包装 _v
2. 变量 -> 包装 _s
3. 字符串 -> 包装 ""

模板中{{ name }}：
1.name 有可能是一个对象，需要使用 JSON.stringify 将对象转换成为字符串

检查 text 中，是否包含{{}}：
1.包含，说明是表达式；
2.如果不包含，直接返回 _v('${text}') ；

判断是否包含{{}}，可以使用正则 defaultTagRE：
如果包含，说明是表达式，需要做表达式 和 普通值的拼接

['aaa',_s(name),'bbb'].join('+') ==> _v('aaa' + s_(name) + 'bbb')
```

先放数组 tokens 中再拼接一下，最后返回 \_v(${tokens.join('+')})

## 完整实现

```js
// src/compiler/index.js#gen
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function gen(el) {
  console.log("===== gen ===== el = ", el);
  if (el.type == 1) {
    //
    console.log("元素标签 tag = " + el.tag + "，generate继续递归处理");
    return generate(el); // 如果是元素就递归的生成
  } else {
    // 文本类型
    let text = el.text;
    console.log("文本类型,text = " + text);
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`; // 普通文本，包装_v
    } else {
      // 存在{{}}表达式，需进行表达式 和 普通值的拼接
      // 目标：['aaa',_s(name),'bbb'].join('+') ==> _v('aaa' + s_(name) + 'bbb')
      let lastIndex = (defaultTagRE.lastIndex = 0);
      let tokens = []; // <div>aaa {{name}} bbb</div>
      let match;
      while ((match = defaultTagRE.exec(text))) {
        console.log("匹配内容" + text);
        let index = match.index; // match.index：指当前捕获到的位置
        console.log("当前的 lastIndex = " + lastIndex);
        console.log("匹配的 match.index = " + index);
        if (index > lastIndex) {
          // 将前一段 ’<div>aaa '中的 aaa 放入 tokens 中
          let preText = text.slice(lastIndex, index);
          console.log("匹配到表达式-找到表达式开始前的部分：" + preText);
          tokens.push(JSON.stringify(preText)); // 利用 JSON.stringify 加双引号
        }

        console.log("匹配到表达式：" + match[1].trim());
        // 放入 match 到的表达式，如{{ name  }}（match[1]是花括号中间的部分，并处理可能存在的换行或回车）
        tokens.push(`_s(${match[1].trim()})`);
        // 更新 lastIndex 长度到'<div>aaa {{name}}'
        lastIndex = index + match[0].length; // 更新 lastIndex 长度到'<div>aaa {{name}}'
      }

      // while 循环后可能还剩余一段，如：’ bbb</div>’，需要将 bbb 放到 tokens 中
      if (lastIndex < text.length) {
        let lastText = text.slice(lastIndex);
        console.log("表达式处理完成后，还有内容需要继续处理：" + lastText);
        tokens.push(JSON.stringify(lastText)); // 从 lastIndex 到最后
      }

      return `_v(${tokens.join("+")})`;
    }
  }
}
```

对文本的处理逻辑：

1. 如果没有特殊的表达式，直接返回
2. 如果有表达式，需进行匹配和截取处理

```
使用正则进行捕获处理，可能存在较复杂的情况，如：
<div>aaa {{name}} bbb</div>或 <div>aaa {{name}} bbb {{age}} ccc</div>：

1. 使用正则 defaultTagRE 捕获表达式，将表达式前面的一段'<div>aaa ' 中的 aaa 放入 tokens 数组
  备注：本次捕获完成后，得到偏移量在表达式后，待表达式处理完成后统一调整即可；
2. 将捕获到表达式名称 name 放入 tokens 数组中并修改匹配偏移量，同理继续处理其余表达式
  备注：每次捕获成功后，重复 1，2 两个步骤
3. 当表达式全部捕获完成后，若文本长度仍大于当前匹配偏移量，说明还有最后一段没有处理，
  将 ' bbb</div>' 中的 bbb 也放入 tokens 数组
4. 都放入 tokens 数组后，拼接返回  `_v(${tokens.join('+')})`
```

![](/images/手写vue2源码/（十二）生成render函数-代码拼接/打印输出2.png)

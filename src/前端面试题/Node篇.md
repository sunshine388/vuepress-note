---
title: Node篇
---

Node 篇

<!-- more -->

# Node 的应用场景

- 特点：
  - 它是一个 Javascript 运行环境
  - 依赖于 Chrome V8 引擎进行代码解释
  - 事件驱动
  - 非阻塞 I/O
  - 单进程，单线程
- 优点：
  - 高并发（最重要的优点）
- 缺点：
  - 只支持单核 CPU ，不能充分利用 CPU
  - 可靠性低，一旦代码某个环节崩溃，整个系统都崩溃

# 尽可能多的说出你对 Electron 的理解

> 最最重要的一点， electron 实际上是一个套了 Chrome 的 nodeJS 程序

所以应该是从两个方面说开来

- Chrome （无各种兼容性问题）；
- NodeJS （ NodeJS 能做的它也能做）

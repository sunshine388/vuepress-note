import{_ as n,W as s,X as a,Y as t,Z as p,$ as e}from"./framework-d2dfa12e.js";const o="/vuepress-note/images/手写vue2源码/（二）vue的初始化流程/打印输出1.png",c="/vuepress-note/images/手写vue2源码/（二）vue的初始化流程/打印输出2.png",i={},l=p("p",null,"Vue 是一套用于构建用户界面的渐进式框架，Vue 并没有完全支持 MVVM 模型，但 Vue 的设计受到了它的启发，变量名 vm 是 vue model 的缩写，表示 vue 实例",-1),u=e(`<h2 id="vue-简介" tabindex="-1"><a class="header-anchor" href="#vue-简介" aria-hidden="true">#</a> Vue 简介</h2><p>以两个概念性问题做简单介绍</p><h3 id="问题-vue-是-mvvm-框架吗" tabindex="-1"><a class="header-anchor" href="#问题-vue-是-mvvm-框架吗" aria-hidden="true">#</a> 问题：Vue 是 MVVM 框架吗？</h3><p>在 Vue 官网上是这样说的：</p><p>Vue 是一套用于构建用户界面的渐进式框架，Vue 并没有完全支持 MVVM 模型，但 Vue 的设计受到了它的启发，变量名 vm 是 vue model 的缩写，表示 vue 实例</p><p>所以，严格说 Vue 并不是一个 MVVM 框架</p><p>MVVM 模式是仅能够通过视图更改数据，通过数据来更改视图的，但 Vue 是可以通过 ref 获取 dom 进行操作的</p><h3 id="问题-vue-的双向绑定和单向数据流矛盾吗" tabindex="-1"><a class="header-anchor" href="#问题-vue-的双向绑定和单向数据流矛盾吗" aria-hidden="true">#</a> 问题：Vue 的双向绑定和单向数据流矛盾吗？</h3><p>当然不矛盾，这是一个理解问题</p><p>双向绑定是指数据变了视图会更新；视图变了会影响数据；</p><p>单向数据说的是响应式数据，即数据变化后会更新视图；</p><h2 id="使用-vue" tabindex="-1"><a class="header-anchor" href="#使用-vue" aria-hidden="true">#</a> 使用 Vue</h2><h3 id="vue-demo" tabindex="-1"><a class="header-anchor" href="#vue-demo" aria-hidden="true">#</a> Vue Demo</h3><p>以一个简单的 Vue Demo 为例:</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>en<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>UTF-8<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">http-equiv</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>X-UA-Compatible<span class="token punctuation">&quot;</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>IE=edge<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>viewport<span class="token punctuation">&quot;</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width=device-width, initial-scale=1.0<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">&gt;</span></span>Document<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
    <span class="token comment">&lt;!-- 模板 --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>app<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>{{message}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token comment">&lt;!-- 引入 vue --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>./vue.js<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
      <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> 初始化 Vue，传入 options 对象 <span class="token operator">--</span><span class="token operator">&gt;</span>
      <span class="token keyword">let</span> vm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">&quot;#app&quot;</span><span class="token punctuation">,</span>
        <span class="token comment">// 1，data 是对象</span>
        <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">&quot;Hello Vue&quot;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token comment">// 2，data 是函数，返回一个对象</span>
        <span class="token comment">// data() {</span>
        <span class="token comment">//   return { message: &#39;Hello Vue&#39; }</span>
        <span class="token comment">// }</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Vue 初始化时，传入 el 挂载点，data 数据；</p><p>初始化完成后，message 成为响应式数据，数据变化更新视图，视图变化影响数据；</p><h3 id="问题-响应式数据原理" tabindex="-1"><a class="header-anchor" href="#问题-响应式数据原理" aria-hidden="true">#</a> 问题：响应式数据原理</h3><p>Object.defineProperty 数据劫持（这里也正是 vue2 的性能瓶颈）</p><h3 id="问题-vue-中的数据可以是对象吗" tabindex="-1"><a class="header-anchor" href="#问题-vue-中的数据可以是对象吗" aria-hidden="true">#</a> 问题：Vue 中的数据可以是对象吗？</h3><p>根组件不会被共享，可以是对象也可以是函数</p><p>非根组件必须为函数，否则 data 状态会多组件共享</p><h2 id="vue-的初始化操作" tabindex="-1"><a class="header-anchor" href="#vue-的初始化操作" aria-hidden="true">#</a> vue 的初始化操作</h2><h3 id="原型方法-init" tabindex="-1"><a class="header-anchor" href="#原型方法-init" aria-hidden="true">#</a> 原型方法 _init</h3><p>在 Vue 原型上扩展一个 _init 方法（原型方法），用于 Vue 的初始化操作</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/index.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> initMixin <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./init&quot;</span><span class="token punctuation">;</span> <span class="token comment">// 引入initMixin模块</span>

<span class="token keyword">function</span> <span class="token function">Vue</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_init</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 这里调用的是Vue的原型方法</span>
<span class="token punctuation">}</span>

<span class="token comment">// 调用 initMixin 进行 Vue 初始化操作</span>
<span class="token function">initMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> Vue<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 new Vue() 时会执行 this._init(options)；这个 _init() 从原型上获取，定义在 initMixin()中；</p><p>将用于初始化操作的原型方法 _init 单独抽离形成一个独立模块 initMixin</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/init.js</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initMixin</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">_init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-html-文件" tabindex="-1"><a class="header-anchor" href="#修改-html-文件" aria-hidden="true">#</a> 修改 html 文件</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">&lt;</span><span class="token operator">!</span><span class="token constant">DOCTYPE</span> html<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span>html lang<span class="token operator">=</span><span class="token string">&quot;en&quot;</span><span class="token operator">&gt;</span>
<span class="token operator">&lt;</span>head<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>meta charset<span class="token operator">=</span><span class="token string">&quot;UTF-8&quot;</span><span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>meta http<span class="token operator">-</span>equiv<span class="token operator">=</span><span class="token string">&quot;X-UA-Compatible&quot;</span> content<span class="token operator">=</span><span class="token string">&quot;IE=edge&quot;</span><span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>meta name<span class="token operator">=</span><span class="token string">&quot;viewport&quot;</span> content<span class="token operator">=</span><span class="token string">&quot;width=device-width, initial-scale=1.0&quot;</span><span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>title<span class="token operator">&gt;</span>Document<span class="token operator">&lt;</span><span class="token operator">/</span>title<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>head<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span>body<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>script src<span class="token operator">=</span><span class="token string">&quot;vue.js&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>script<span class="token operator">&gt;</span>
    <span class="token keyword">let</span> vm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">&#39;#app&#39;</span><span class="token punctuation">,</span>
      <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">&#39;Hello Vue&#39;</span> <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>body<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>html<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Vue 初始化时，传入 el 挂载点，data 数据；</p><p>初始化完成后，message 成为响应式数据，数据变化更新视图，视图变化影响数据；</p><h3 id="打印输出" tabindex="-1"><a class="header-anchor" href="#打印输出" aria-hidden="true">#</a> 打印输出</h3><figure><img src="`+o+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>打印原型方法 _init 的 this，this 指向 vm 实例</p><h2 id="vm-options" tabindex="-1"><a class="header-anchor" href="#vm-options" aria-hidden="true">#</a> vm.$options</h2><p>为了后续让 vue 中的其他方法也能够轻松获取到外部 new Vue 实例化时传入的 options 对象</p><p>干脆将 options 选项挂到 vm 实例上，即 vm.$options</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/init.js</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initMixin</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">_init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span> <span class="token comment">// this 指向当前 vue 实例</span>
    vm<span class="token punctuation">.</span>$options <span class="token operator">=</span> options<span class="token punctuation">;</span> <span class="token comment">// 将 Vue 实例化时用户传入的 options 暴露到 vm 实例上</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="initstate-方法-状态的初始化" tabindex="-1"><a class="header-anchor" href="#initstate-方法-状态的初始化" aria-hidden="true">#</a> initState 方法：状态的初始化</h2><p>在实际使用中，数据不仅来源于传入的 data，还可能来自 props、watch、computed...</p><p>所以，最好能够统一在一个地方，集中进行数据的初始化处理：initState 方法</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/state.js</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initState</span><span class="token punctuation">(</span><span class="token parameter">vm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取options：_init 中已将 options 挂载到 vm.$options</span>
  <span class="token keyword">const</span> opts <span class="token operator">=</span> vm<span class="token punctuation">.</span>$options<span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">initData</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// data数据的初始化</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// props 数据的初始化</span>
  <span class="token comment">// watch 数据的初始化</span>
  <span class="token comment">// computed 数据的初始化</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">initData</span><span class="token punctuation">(</span><span class="token parameter">vm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;进入 state.js - initData，数据初始化操作&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>引入并使用 initState</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/init.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> initState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./state&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initMixin</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">_init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
    vm<span class="token punctuation">.</span>$options <span class="token operator">=</span> options<span class="token punctuation">;</span>

    <span class="token comment">// new Vue 时，传入 options 选项,包含 el 和 data</span>
    <span class="token function">initState</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 状态的初始化</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>$options<span class="token punctuation">.</span>el<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;有el,需要挂载&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+c+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',47);function r(k,d){return s(),a("div",null,[l,t(" more "),u])}const m=n(i,[["render",r],["__file","（二）vue的初始化流程.html.vue"]]);export{m as default};

import{_ as n,W as s,X as a,Y as t,Z as p,$ as e}from"./framework-d2dfa12e.js";const o={},i=p("p",null,"组件部分-组件的编译",-1),c=e(`<h2 id="组件的编译" tabindex="-1"><a class="header-anchor" href="#组件的编译" aria-hidden="true">#</a> 组件的编译</h2><h3 id="组件的介绍" tabindex="-1"><a class="header-anchor" href="#组件的介绍" aria-hidden="true">#</a> 组件的介绍</h3><p>组件源于 WebComponent，即 Web 组件；原生支持自定义标签，但是兼容性不好； 所以，Vue 和 React 实现了一套组件 API；</p><h3 id="组件的定义" tabindex="-1"><a class="header-anchor" href="#组件的定义" aria-hidden="true">#</a> 组件的定义</h3><p>在 vue 中，组件分为&quot;全局组件&quot;和&quot;自定义组件&quot;两种，定义方式如下：</p><h4 id="全局组件" tabindex="-1"><a class="header-anchor" href="#全局组件" aria-hidden="true">#</a> 全局组件</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">&lt;</span>body<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>div id<span class="token operator">=</span><span class="token string">&quot;app1&quot;</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> 可以使用my<span class="token operator">-</span>button组件 <span class="token operator">--</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>div id<span class="token operator">=</span><span class="token string">&quot;app2&quot;</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> 可以使用my<span class="token operator">-</span>button组件 <span class="token operator">--</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>script<span class="token operator">&gt;</span>
    Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;my-button&#39;</span><span class="token punctuation">,</span><span class="token punctuation">{</span>
      <span class="token literal-property property">template</span><span class="token operator">:</span><span class="token string">&#39;&lt;button&gt;Hello Vue&lt;/button&gt;&#39;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">&quot;#app&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>body<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>全局组件通过 Vue.component(&#39;xxx&#39;,{...})定义，可在全局范围使用；</p><h4 id="局部组件" tabindex="-1"><a class="header-anchor" href="#局部组件" aria-hidden="true">#</a> 局部组件</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">&lt;</span>body<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>div id<span class="token operator">=</span><span class="token string">&quot;app1&quot;</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> 可以使用 <span class="token operator">--</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>div id<span class="token operator">=</span><span class="token string">&quot;app2&quot;</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> 不可以使用 <span class="token operator">--</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>script<span class="token operator">&gt;</span>
    <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">&quot;#app1&quot;</span><span class="token punctuation">,</span>
      <span class="token comment">// 声明局部组件-只能在声明作用域 app1 下使用</span>
      <span class="token literal-property property">components</span><span class="token operator">:</span><span class="token punctuation">{</span>
        <span class="token string-property property">&#39;my-button&#39;</span><span class="token operator">:</span><span class="token punctuation">{</span>
          <span class="token literal-property property">template</span><span class="token operator">:</span><span class="token string">&#39;&lt;button&gt;Hello Vue 局部组件&lt;/button&gt;&#39;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>body<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>局部组件，只能在声明作用域下被使用；</p><h3 id="组件的优先级" tabindex="-1"><a class="header-anchor" href="#组件的优先级" aria-hidden="true">#</a> 组件的优先级</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">&lt;</span>body<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>div id<span class="token operator">=</span><span class="token string">&quot;app&quot;</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>script<span class="token operator">&gt;</span>
    <span class="token comment">// 全局组件</span>
    Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;my-button&#39;</span><span class="token punctuation">,</span><span class="token punctuation">{</span>
      <span class="token literal-property property">template</span><span class="token operator">:</span><span class="token string">&#39;&lt;button&gt;Hello Vue 全局组件&lt;/button&gt;&#39;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">&quot;#app&quot;</span><span class="token punctuation">,</span>
      <span class="token comment">// 局部组件</span>
      <span class="token literal-property property">components</span><span class="token operator">:</span><span class="token punctuation">{</span>
        <span class="token string-property property">&#39;my-button&#39;</span><span class="token operator">:</span><span class="token punctuation">{</span>
          <span class="token literal-property property">template</span><span class="token operator">:</span><span class="token string">&#39;&lt;button&gt;Hello Vue 局部组件&lt;/button&gt;&#39;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>body<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同名的全局组件和局部组件同时存在，根据组件查找规则，优先使用局部组件； 相同名称的全局组件和局部组件定义并不会被覆盖，而是会像原型链一样，逐级向上进行查找；</p><h2 id="组件的初始化流程介绍" tabindex="-1"><a class="header-anchor" href="#组件的初始化流程介绍" aria-hidden="true">#</a> 组件的初始化流程介绍</h2><h3 id="vue-的全局-api" tabindex="-1"><a class="header-anchor" href="#vue-的全局-api" aria-hidden="true">#</a> Vue 的全局 API</h3><p>Vue.component 是全局 API，在 Vue 初始化 init 时，会对全局 API 做集中处理：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/index.js</span>

<span class="token doc-comment comment">/**
 * 在vue 中所有的功能都通过原型扩展（原型模式）的方式来添加
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">options</span> vue 实例化传入的配置对象
 */</span>
<span class="token keyword">function</span> <span class="token function">Vue</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_init</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 调用Vue原型上的方法_init</span>
<span class="token punctuation">}</span>

<span class="token function">initMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
<span class="token function">renderMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
<span class="token function">lifeCycleMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
<span class="token function">initGlobalAPI</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span> <span class="token comment">// 初始化 global Api</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> Vue<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>initGlobalAPI 方法，处理全局 API</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/global-api/index.js</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initGlobalAPI</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 全局属性：Vue.options</span>
  <span class="token comment">// 功能：存放 mixin, component, filte, directive 属性</span>
  Vue<span class="token punctuation">.</span>options <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

  Vue<span class="token punctuation">.</span><span class="token function-variable function">mixin</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>options <span class="token operator">=</span> <span class="token function">mergeOptions</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>options<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">;</span>  <span class="token comment">// 返回this,提供链式调用</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * Vue.component API
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">id</span>          组件名
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">definition</span>  组件定义
   */</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">component</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vue-component-api" tabindex="-1"><a class="header-anchor" href="#vue-component-api" aria-hidden="true">#</a> Vue.component API</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 方法定义</span>
Vue<span class="token punctuation">.</span><span class="token function-variable function">component</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token comment">// 使用方式</span>
Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;my-button&#39;</span><span class="token punctuation">,</span><span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span><span class="token string">&#39;my-button&#39;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">template</span><span class="token operator">:</span><span class="token string">&#39;&lt;button&gt;全局组件&lt;/button&gt;&#39;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="组件名-name" tabindex="-1"><a class="header-anchor" href="#组件名-name" aria-hidden="true">#</a> 组件名 name</h4><p>每个组件都有一个自己的名字，即组件的唯一标识；</p><ul><li>默认组件名是：id，即 Vue.component 的第一个参数；</li><li>若 definition 中有 name，使用 name 值作为组件名；</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
  * Vue.component
  * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">id</span>          组件名
  * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">definition</span>  组件定义
  */</span>
Vue<span class="token punctuation">.</span><span class="token function-variable function">component</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  definition<span class="token punctuation">.</span>name <span class="token operator">=</span> definition<span class="token punctuation">.</span>name <span class="token operator">||</span> id<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="组件定义-definition" tabindex="-1"><a class="header-anchor" href="#组件定义-definition" aria-hidden="true">#</a> 组件定义 definition</h4><p>Vue.component 的第二个参数 definition，即组件定义；definition 组件定义可以是函数，也可以是对象;</p><p>若 definition 为对象，Vue.component 方法内部会使用 Vue.extends 进行处理</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/global-api/index.js</span>

<span class="token doc-comment comment">/**
  * 使用基础的 Vue 构造器，创造一个子类
  * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">definition</span>
  */</span>
Vue<span class="token punctuation">.</span><span class="token function-variable function">extends</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
  * Vue.component
  * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">id</span>          组件名
  * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">definition</span>  组件定义：对象或函数
  */</span>
Vue<span class="token punctuation">.</span><span class="token function-variable function">component</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取组件名 name:优先使用definition.name，默认使用 id</span>
  <span class="token keyword">let</span> name <span class="token operator">=</span> definition<span class="token punctuation">.</span>name <span class="token operator">||</span> id<span class="token punctuation">;</span>
  definition<span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>

  <span class="token comment">// 如果传入的definition是对象，需要用Vue.extends包裹</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token function">isObject</span><span class="token punctuation">(</span>definition<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    definition <span class="token operator">=</span> Vue<span class="token punctuation">.</span><span class="token function">extends</span><span class="token punctuation">(</span>definition<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vue-extend" tabindex="-1"><a class="header-anchor" href="#vue-extend" aria-hidden="true">#</a> Vue.extend</h3><p>定义：使用基于 Vue 构造器，创建一个子类； // TODO 补充 Vue 官网相关内容</p><h3 id="保存全局组件构造函数" tabindex="-1"><a class="header-anchor" href="#保存全局组件构造函数" aria-hidden="true">#</a> 保存全局组件构造函数</h3><p>initGlobalAPI 方法中，Vue.options 用于存放全局属性； 而在全局组件中，也要用到全局属性，所以，全局组件也要注册到 Vue.options 中； Vue.options.components 用于存放全局组件：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/global-api/index.js</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initGlobalAPI</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 全局属性：Vue.options</span>
  <span class="token comment">// 功能：存放 mixin, component, filte, directive 属性</span>
  Vue<span class="token punctuation">.</span>options <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token comment">// 每个组件初始化时，将这些属性放入组件</span>
  <span class="token comment">// 用于存放全局组件</span>
  Vue<span class="token punctuation">.</span>options<span class="token punctuation">.</span>components <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 使用基础的 Vue 构造器，创造一个子类
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">definition</span>
   */</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">extends</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * Vue.component
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">id</span>          组件名（默认）
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">definition</span>  组件定义：可能是对象或函数
   */</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">component</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token comment">// 获取组件名 name:优先使用definition.name，默认使用 id</span>
    <span class="token keyword">let</span> name <span class="token operator">=</span> definition<span class="token punctuation">.</span>name <span class="token operator">||</span> id<span class="token punctuation">;</span>
    definition<span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>

    <span class="token comment">// 如果传入的definition是对象，需要用Vue.extends包裹</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token function">isObject</span><span class="token punctuation">(</span>definition<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
      definition <span class="token operator">=</span> Vue<span class="token punctuation">.</span><span class="token function">extends</span><span class="token punctuation">(</span>definition<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 将 definition 对象保存到全局：Vue.options.components</span>
    Vue<span class="token punctuation">.</span>options<span class="token punctuation">.</span>components<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> definition<span class="token punctuation">;</span>

  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Vue.options.components 相当于在全局维护了一个组件名与组件构造函数的映射关系；</p><h3 id="全局组件与局部组件合并" tabindex="-1"><a class="header-anchor" href="#全局组件与局部组件合并" aria-hidden="true">#</a> 全局组件与局部组件合并</h3><p>创造一个组件，就相当于 new 组件类，此时，就会进行组件的初始化；</p><p>当 new Vue 时，会执行 this._init 方法：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/index.js</span>

<span class="token keyword">function</span> <span class="token function">Vue</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_init</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 调用 Vue 的原型方法 _init</span>
<span class="token punctuation">}</span>

<span class="token function">initMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
<span class="token function">renderMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
<span class="token function">lifeCycleMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
<span class="token function">initGlobalAPI</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>_init 方法：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/init.js#initMixin</span>

<span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">_init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
  vm<span class="token punctuation">.</span>$options <span class="token operator">=</span> <span class="token function">mergeOptions</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>constructor<span class="token punctuation">.</span>options<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">initState</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 状态的初始化</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>$options<span class="token punctuation">.</span>el<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 将数据挂在到页面上（此时,数据已经被劫持）</span>
    vm<span class="token punctuation">.</span><span class="token function">$mount</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>$options<span class="token punctuation">.</span>el<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，当 new 组件时，也应该会调用初始化方法：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Vue</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_init</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，vm.constructor.options 中也就包含了 Vue.options.components 当 new vue 时，用户对局部组件进行了声明：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>  <span class="token operator">&lt;</span>script<span class="token operator">&gt;</span>
    <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">&quot;#app&quot;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">components</span><span class="token operator">:</span><span class="token punctuation">{</span>
        <span class="token string-property property">&#39;my-button&#39;</span><span class="token operator">:</span><span class="token punctuation">{</span><span class="token comment">// 局部组件</span>
          <span class="token literal-property property">template</span><span class="token operator">:</span><span class="token string">&#39;&lt;button&gt;Hello Vue 局部组件&lt;/button&gt;&#39;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>内部就会将“全局组件”和“局部组件”进行一次合并:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>vm<span class="token punctuation">.</span>$options <span class="token operator">=</span> <span class="token function">mergeOptions</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>constructor<span class="token punctuation">.</span>options<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>此时，vm.constructor.options（子）是一个函数，但 options（父）是一个对象：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>  <span class="token operator">&lt;</span>script<span class="token operator">&gt;</span>
    <span class="token comment">// 全局组件</span>
    Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;my-button&#39;</span><span class="token punctuation">,</span><span class="token punctuation">{</span> <span class="token comment">// 内部会被 Vue.extends 处理，成为一个构造函数</span>
      <span class="token literal-property property">name</span><span class="token operator">:</span><span class="token string">&#39;my-button&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">template</span><span class="token operator">:</span><span class="token string">&#39;&lt;button&gt;全局组件&lt;/button&gt;&#39;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">&quot;#app&quot;</span><span class="token punctuation">,</span>
      <span class="token comment">// 局部组件</span>
      <span class="token literal-property property">components</span><span class="token operator">:</span><span class="token punctuation">{</span>  <span class="token comment">// 不会被 Vue.extends 处理，就真的是一个对象</span>
        <span class="token string-property property">&#39;my-button&#39;</span><span class="token operator">:</span><span class="token punctuation">{</span>
          <span class="token literal-property property">template</span><span class="token operator">:</span><span class="token string">&#39;&lt;button&gt;局部组件&lt;/button&gt;&#39;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，就维护好了组件间的层级关系； 组件的查找规则：优先找自己，找不到通过链上去找父亲</p><h3 id="组件的合并策略" tabindex="-1"><a class="header-anchor" href="#组件的合并策略" aria-hidden="true">#</a> 组件的合并策略</h3><p>html 模板会被解析称为 AST 语法树:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>  <span class="token operator">&lt;</span>div id<span class="token operator">=</span><span class="token string">&quot;app&quot;</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>my<span class="token operator">-</span>button<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>模板编译流程：</p><ul><li>将模板解析称为 AST 语法树；</li><li>根据 AST 语法树生成 render 函数；</li></ul><p>当前在 render 函数中，如果是标签会调用 _c 方法处理； c 方法之前只处理元素，但现在有可能是组件了！ 即： c(&#39;组件名&#39;) 即 createElm 中的 tag 可能是组件；</p><p>此处需要进行扩展：</p><ul><li>如果是组件，就创建组件 CreateComponent</li><li>如果不是组件就创建元素</li></ul><p>在 createComponent 方法中，创造组件的虚拟节点 componentVnode， 此时组件的构造函数 this.$options.components[tag],不是函数就是对象； 如果是对象，调用 Vue.extend 处理</p><h3 id="组件的渲染和更新" tabindex="-1"><a class="header-anchor" href="#组件的渲染和更新" aria-hidden="true">#</a> 组件的渲染和更新</h3><p>根据组件的虚拟节点，创建出组件的真实节点；并将组件插入到父元素中； 组件初始化时，会为每个组件创建一个 watcher，属性会收集对应组件渲染 watcher 添加到自身 dep 记录； 当组件更新时，根据 dep 收集结果，更新组件对应的 watcher；</p>`,62);function l(r,u){return s(),a("div",null,[i,t(" more "),c])}const k=n(o,[["render",l],["__file","（三十）组件部分-组件的编译.html.vue"]]);export{k as default};

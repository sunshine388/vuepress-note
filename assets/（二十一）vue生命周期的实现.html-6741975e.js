import{_ as n,W as s,X as a,Y as e,Z as p,$ as t}from"./framework-d2dfa12e.js";const o="/vuepress-note/images/手写vue2源码/（二十一）vue生命周期的实现/打印输出1.png",c="/vuepress-note/images/手写vue2源码/（二十一）vue生命周期的实现/打印输出2.png",i={},l=p("p",null,"Vue 生命周期的实现",-1),u=t(`<h2 id="vue-mixin-介绍" tabindex="-1"><a class="header-anchor" href="#vue-mixin-介绍" aria-hidden="true">#</a> Vue.mixin 介绍</h2><h3 id="mixin-简介" tabindex="-1"><a class="header-anchor" href="#mixin-简介" aria-hidden="true">#</a> mixin 简介</h3><p>Vue2 中可以通过 Vue.mixin 为 vue 进行功能扩展 开发中，经常使用 mixin 来为所有组件增加一些生命周期</p><h3 id="mixin-使用" tabindex="-1"><a class="header-anchor" href="#mixin-使用" aria-hidden="true">#</a> mixin 使用</h3><p>vue 初始化时，使用 beforeCreate 生命周期钩子 再通过 Vue.mixin 扩展对 beforeCreate 进行功能扩展 这样在实际执行时，多个 beforeCreate 会进行合并</p><h3 id="生命周期的用法" tabindex="-1"><a class="header-anchor" href="#生命周期的用法" aria-hidden="true">#</a> 生命周期的用法</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 使用 Vue.mixin 做全局扩展</span>
Vue<span class="token punctuation">.</span><span class="token function">mixin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">beforeCreate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;全局:mixin-beforeCreate&quot;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">let</span> vm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">&#39;#app&#39;</span><span class="token punctuation">,</span>
  <span class="token comment">// 用法一：</span>
  <span class="token comment">// beforeCreate(){},</span>
  <span class="token comment">// 用法二：数组写法：逻辑较多需进行分类时吗，可拆分为多个函数</span>
  <span class="token literal-property property">beforeCreate</span><span class="token operator">:</span><span class="token punctuation">[</span>
    <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;局部:new Vue-beforeCreate 1&quot;</span><span class="token punctuation">)</span> <span class="token comment">// A 模块初始化</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;局部:new Vue-beforeCreate 2&quot;</span><span class="token punctuation">)</span> <span class="token comment">// B 模块初始化</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="vue-的-global-api" tabindex="-1"><a class="header-anchor" href="#vue-的-global-api" aria-hidden="true">#</a> Vue 的 Global API</h2><h3 id="全局-api-和-实例-api-的使用" tabindex="-1"><a class="header-anchor" href="#全局-api-和-实例-api-的使用" aria-hidden="true">#</a> 全局 api 和 实例 api 的使用</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 全局 api：对所有组件生效</span>
Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token comment">// 实例 api：仅对当前组件生效</span>
<span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">component</span><span class="token operator">:</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="全局-api-的实现原理" tabindex="-1"><a class="header-anchor" href="#全局-api-的实现原理" aria-hidden="true">#</a> 全局 api 的实现原理</h3><p>new Vue 组件初始化时：</p><ol><li>通过 options 使用实例 api 声明，仅对当前组件生效；</li><li>通过 Vue.component 全局声明的属性将被合并到每一个组件中，全局生效；</li></ol><h2 id="vue-mixin-实现" tabindex="-1"><a class="header-anchor" href="#vue-mixin-实现" aria-hidden="true">#</a> Vue.mixin 实现</h2><h3 id="添加-mixin-方法" tabindex="-1"><a class="header-anchor" href="#添加-mixin-方法" aria-hidden="true">#</a> 添加 mixin 方法</h3><p>创建 Vue 全局 api 模块：src/global-api； 新建 src/global-api/index.js，为 Vue 添加 mixi 静态方法:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//src/global-api/index.js</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initGlobalAPI</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">mixin</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 src/index.js 中调用，进行 vue global api 的初始化：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/index.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> initGlobalAPI <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./global-api&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> initMixin <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./init&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> lifeCycleMixin <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./lifecycle&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> renderMixin <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./render&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">Vue</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_init</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">initMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
<span class="token function">renderMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
<span class="token function">lifeCycleMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span>
<span class="token function">initGlobalAPI</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span> <span class="token comment">// 初始化 global Api</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> Vue<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实现-global-api" tabindex="-1"><a class="header-anchor" href="#实现-global-api" aria-hidden="true">#</a> 实现 Global API</h3><p>在全局属性 Vue.options 中存放属性，供全局使用：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/global-api/index.js</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initGlobalAPI</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 全局属性：Vue.options</span>
  <span class="token comment">// 功能：存放 mixin, component, filte, directive 属性</span>
  Vue<span class="token punctuation">.</span>options <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">mixin</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token punctuation">}</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">component</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">filte</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">directive</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="多个-vue-mixin-的合并策略" tabindex="-1"><a class="header-anchor" href="#多个-vue-mixin-的合并策略" aria-hidden="true">#</a> 多个 Vue.mixin 的合并策略</h3><p>全局 mixin 也可以被多次调用：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Vue<span class="token punctuation">.</span><span class="token function">mixin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">beforeCreate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;全局:mixin-beforeCreate 1&quot;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
Vue<span class="token punctuation">.</span><span class="token function">mixin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">beforeCreate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;全局:mixin-beforeCreate 2&quot;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时，需对全局声明进行合并：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Vue<span class="token punctuation">.</span><span class="token function-variable function">mixin</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 需将多次传入的 options 与全局属性 Vue.options 进行合并</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>合并策略：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>第一次合并：
parentVal:{}
childVal:{ beforeCreate:fn1 }
合并结果：{ beforeCreate:[fn1] }

第二次合并：
parentVal:{ beforeCreate:[fn1] }
childVal:{ beforeCreate:fn2 }
合并结果：{ beforeCreate:[fn1,fn2] }

所以，每次合并需要循环父亲(老值)和儿子(新值)依次进行合并
当新值存在，老值不存在时：添加到老值中
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 src/utils.js 添加工具方法 mergeOptions：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/utils.js</span>

<span class="token doc-comment comment">/**
 * 对象合并:将childVal合并到parentVal中
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">parentVal</span>   父值-老值
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">childVal</span>    子值-新值
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">mergeOptions</span><span class="token punctuation">(</span><span class="token parameter">parentVal<span class="token punctuation">,</span> childVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> options <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> parentVal<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token function">mergeFiled</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> childVal<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// 当新值存在，老值不存在时：添加到老值中</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>parentVal<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
      <span class="token function">mergeFiled</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">function</span> <span class="token function">mergeFiled</span><span class="token punctuation">(</span><span class="token parameter">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 默认合并方法：优先使用新值覆盖老值</span>
    options<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> childVal<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">||</span> parentVal<span class="token punctuation">[</span>key<span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> options<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生命周期的合并策略" tabindex="-1"><a class="header-anchor" href="#生命周期的合并策略" aria-hidden="true">#</a> 生命周期的合并策略</h3><p>策略模式：将不同生命周期的合并使用不同的策略做区分</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/utils.js</span>

<span class="token keyword">let</span> strats <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>  <span class="token comment">// 存放所有策略</span>
<span class="token keyword">let</span> lifeCycle <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token string">&#39;beforeCreate&#39;</span><span class="token punctuation">,</span>
  <span class="token string">&#39;created&#39;</span><span class="token punctuation">,</span>
  <span class="token string">&#39;beforeMount&#39;</span><span class="token punctuation">,</span>
  <span class="token string">&#39;mounted&#39;</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
lifeCycle<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">hook</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// 创建生命周期的合并策略</span>
  strats<span class="token punctuation">[</span>hook<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">parentVal<span class="token punctuation">,</span> childVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span>childVal<span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token comment">// 儿子有值，需要进行合并</span>
      <span class="token keyword">if</span><span class="token punctuation">(</span>parentVal<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token comment">// 父亲儿子都有值：父亲一定是数组，将儿子合入父亲</span>
        <span class="token keyword">return</span> parentVal<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span>childVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>
        <span class="token comment">// 儿子有值，父亲没有值：儿子放入新数组中</span>
        <span class="token comment">// 注意：如果传入的生命周期函数是数组，已经是数组无需再包成数组</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>childVal<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
          <span class="token keyword">return</span> childVal<span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>
          <span class="token keyword">return</span> <span class="token punctuation">[</span>childVal<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>  <span class="token comment">// 儿子没有值，无需合并，直接返回父亲即可</span>
      <span class="token keyword">return</span> parentVal<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/global-api/index.js</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initGlobalAPI</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 全局属性：Vue.options</span>
  <span class="token comment">// 功能：存放 mixin, component, filte, directive 属性</span>
  Vue<span class="token punctuation">.</span>options <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">mixin</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>options <span class="token operator">=</span> <span class="token function">mergeOptions</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>options<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;打印mixin合并后的options&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>options<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">;</span>  <span class="token comment">// 返回this,提供链式调用</span>
  <span class="token punctuation">}</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">component</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">filte</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  Vue<span class="token punctuation">.</span><span class="token function-variable function">directive</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试" tabindex="-1"><a class="header-anchor" href="#测试" aria-hidden="true">#</a> 测试</h3><p>测试 Vue.mixin 中的生命周期合并结果： <img src="`+o+`" alt="" loading="lazy"></p><h2 id="全局与实例的生命周期合并" tabindex="-1"><a class="header-anchor" href="#全局与实例的生命周期合并" aria-hidden="true">#</a> 全局与实例的生命周期合并</h2><p>全局生命周期合并完成后，还要在和 new Vuechu 初始化中的局部声明再进行合并</p><p>new Vue 初始化时，会进入 _init 原型方法：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/init.js#initMixin</span>

<span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">_init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
    <span class="token comment">// 此时需使用 options 与 mixin 合并后的全局 options 再进行一次合并</span>
    vm<span class="token punctuation">.</span>$options <span class="token operator">=</span> <span class="token function">mergeOptions</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>constructor<span class="token punctuation">.</span>options<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打印 vm.$options 查看合并后的结果： <img src="`+c+`" alt="" loading="lazy"></p><p>问题：vm.constructor.options 和 Vue.options 的区别？</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>此处的 vm 有可能是 vm 的子类：
Vue 的子类对 Vue 可能做了增强；子组件可能会继承 Vue；

Vue<span class="token punctuation">.</span>options 就是指 Vue；而 vm<span class="token punctuation">.</span>constructor 指子类（子组件）的构造函数；
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="生命周期的实现" tabindex="-1"><a class="header-anchor" href="#生命周期的实现" aria-hidden="true">#</a> 生命周期的实现</h2><h3 id="创建生命周期执行函数" tabindex="-1"><a class="header-anchor" href="#创建生命周期执行函数" aria-hidden="true">#</a> 创建生命周期执行函数</h3><p>在 src/lifecycle.js 生命周期模块中，创建执行生命周期钩子函数 callHook：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/lifecycle.js</span>

<span class="token doc-comment comment">/**
 * 执行生命周期钩子
 *    从$options取对应的生命周期函数数组并执行
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">vm</span>    vue实例
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">hook</span>  生命周期
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">callHook</span><span class="token punctuation">(</span><span class="token parameter">vm<span class="token punctuation">,</span> hook</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token comment">// 获取生命周期对应函数数组</span>
  <span class="token keyword">let</span> handlers <span class="token operator">=</span> vm<span class="token punctuation">.</span>$options<span class="token punctuation">[</span>hook<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>handlers<span class="token punctuation">)</span><span class="token punctuation">{</span>
    handlers<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">fn</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token function">fn</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 生命周期中的 this 指向 vm 实例</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="添加生命周期钩子" tabindex="-1"><a class="header-anchor" href="#添加生命周期钩子" aria-hidden="true">#</a> 添加生命周期钩子</h3><p>当视图渲染前，调用钩子: beforeCreate 视图更新后，调用钩子: created 当视图挂载完成，调用钩子: mounted</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/lifecycle.js</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">mountComponent</span><span class="token punctuation">(</span><span class="token parameter">vm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// vm._render()：调用 render 方法</span>
  <span class="token comment">// vm._update：将虚拟节点更新到页面上</span>
  <span class="token comment">// 初始化流程</span>
  <span class="token comment">// vm._update(vm._render());</span>
  <span class="token comment">// 改造</span>
  <span class="token keyword">let</span> <span class="token function-variable function">updateComponent</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
    vm<span class="token punctuation">.</span><span class="token function">_update</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span><span class="token function">_render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 当视图渲染前，调用钩子: beforeCreate</span>
  <span class="token function">callHook</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> <span class="token string">&#39;beforeCreate&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 渲染 watcher ：每个组件都有一个 watcher</span>
  <span class="token keyword">new</span> <span class="token class-name">Watcher</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> updateComponent<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Watcher-update&#39;</span><span class="token punctuation">)</span>
    <span class="token comment">// 视图更新后，调用钩子: created</span>
    <span class="token function">callHook</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> <span class="token string">&#39;created&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span><span class="token boolean">true</span><span class="token punctuation">)</span>

   <span class="token comment">// 当视图挂载完成，调用钩子: mounted</span>
   <span class="token function">callHook</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> <span class="token string">&#39;mounted&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>watcher 做视图更新前，调用钩子: beforeUpdate 视图更新完成后，调用钩子: updated</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/scheduler.js</span>

<span class="token doc-comment comment">/**
 * 刷新队列：执行所有 watcher.run 并将队列清空；
 */</span>
<span class="token keyword">function</span> <span class="token function">flushschedulerQueue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 更新前,执行生命周期：beforeUpdate</span>
  queue<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">watcher</span> <span class="token operator">=&gt;</span> watcher<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 依次触发视图更新</span>
  queue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>       <span class="token comment">// reset</span>
  has <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>         <span class="token comment">// reset</span>
  pending <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>  <span class="token comment">// reset</span>
  <span class="token comment">// 更新完成,执行生命周期：updated</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试生命周期执行流程" tabindex="-1"><a class="header-anchor" href="#测试生命周期执行流程" aria-hidden="true">#</a> 测试生命周期执行流程</h3><p>Vue.mixin 中的 2 个 beforeCreate 钩子; new Vue 中的 2 个 beforeCreate 钩子; 按照合并后的顺序依次执行完成;</p><p>打印输出</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token literal-property property">全局</span><span class="token operator">:</span>mixin<span class="token operator">-</span>beforeCreate <span class="token number">1</span>
<span class="token literal-property property">全局</span><span class="token operator">:</span>mixin<span class="token operator">-</span>beforeCreate <span class="token number">2</span>
<span class="token literal-property property">局部</span><span class="token operator">:</span><span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token operator">-</span>beforeCreate <span class="token number">1</span>
<span class="token literal-property property">局部</span><span class="token operator">:</span><span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token operator">-</span>beforeCreate <span class="token number">2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,57);function r(d,k){return s(),a("div",null,[l,e(" more "),u])}const m=n(i,[["render",r],["__file","（二十一）vue生命周期的实现.html.vue"]]);export{m as default};

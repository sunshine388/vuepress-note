import{_ as n,W as s,X as a,Y as e,Z as t,$ as p}from"./framework-d2dfa12e.js";const o={},i=t("p",null,"Vue.component 的实现",-1),c=p(`<h2 id="组件初始化流程简介" tabindex="-1"><a class="header-anchor" href="#组件初始化流程简介" aria-hidden="true">#</a> 组件初始化流程简介</h2><h3 id="vue-component-api" tabindex="-1"><a class="header-anchor" href="#vue-component-api" aria-hidden="true">#</a> Vue.component API</h3><p>Vue.component 是全局 API； Vue 初始化时的 initGlobalAPI 方法，会集中处理 Vue Global API</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 方法定义</span>
Vue<span class="token punctuation">.</span><span class="token function-variable function">component</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vue-extend" tabindex="-1"><a class="header-anchor" href="#vue-extend" aria-hidden="true">#</a> Vue.extend</h3><p>在 Vue.component 中，当第二个参数 definition 为对象时，会默认调用 Vue.extend 进行处理； Vue.extend：使用基础 Vue 构造器，创造一个子类；即组件的构造函数；</p><h3 id="保存组件构造函数" tabindex="-1"><a class="header-anchor" href="#保存组件构造函数" aria-hidden="true">#</a> 保存组件构造函数</h3><p>将组件名与构造函数的映射关系，保存到全局对象 Vue.options.components 中； 备注：全局组件中需要使用全局属性，同时便于后续的组件合并；</p><h3 id="组件合并" tabindex="-1"><a class="header-anchor" href="#组件合并" aria-hidden="true">#</a> 组件合并</h3><p>在 Vue 初始化时，_init 方法会进行 mergeOptions 合并选项； 内部通过组件合并策略，完成“全局组件”和“局部组件”的合并；</p><p>备注：此时的 vm.constructor.options 中包含了 Vue.options.components 组件的查找规则：优先找自己，找不到通过链上去找父亲；</p><h3 id="组件合并的策略" tabindex="-1"><a class="header-anchor" href="#组件合并的策略" aria-hidden="true">#</a> 组件合并的策略</h3><p>模板编译流程：html 模板 -&gt; AST 语法树 -&gt; render 函数；</p><p>在 render 函数中，会通过 _c 即 createElm 处理标签和组件； createComponent 方法：创造组件虚拟节点 componentVnode</p><h3 id="组件的初渲染和更新" tabindex="-1"><a class="header-anchor" href="#组件的初渲染和更新" aria-hidden="true">#</a> 组件的初渲染和更新</h3><p>根据组件的虚拟节点，创建出组件的真实节点；并将组件插入到父元素中； 组件初始化时，会为每个组件创建一个 watcher； 依赖收集:属性收集对应组件渲染的 watcher 记录到 dep 中； 当组件更新时，遍历通知 dep 数组中对应的 watcher 进行组件更新；</p><h2 id="vue-component-实现" tabindex="-1"><a class="header-anchor" href="#vue-component-实现" aria-hidden="true">#</a> Vue.component 实现</h2><h3 id="vue-component-如何加载" tabindex="-1"><a class="header-anchor" href="#vue-component-如何加载" aria-hidden="true">#</a> Vue.component 如何加载</h3><p>Vue.component 是全局 API； 在 Vue 初始化 init 时，会对全局 API 做集中处理：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/index.js</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>initGlobalAPI 方法，处理全局 API：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/global-api/index.js</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vue-component-如何定义" tabindex="-1"><a class="header-anchor" href="#vue-component-如何定义" aria-hidden="true">#</a> Vue.component 如何定义</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 方法定义</span>
Vue<span class="token punctuation">.</span><span class="token function-variable function">component</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token comment">// 使用方式</span>
Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;my-button&#39;</span><span class="token punctuation">,</span><span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span><span class="token string">&#39;my-button&#39;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">template</span><span class="token operator">:</span><span class="token string">&#39;&lt;button&gt;全局组件&lt;/button&gt;&#39;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="组件名-name" tabindex="-1"><a class="header-anchor" href="#组件名-name" aria-hidden="true">#</a> 组件名 name</h4><p>每个组件都有一个自己的名字，即组件的唯一标识；</p><p>默认组件名是：id，即 Vue.component 的第一个参数； 若 definition 中有 name，使用 name 值作为组件名；</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
  * Vue.component
  * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">id</span>          组件名
  * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">definition</span>  组件定义
  */</span>
Vue<span class="token punctuation">.</span><span class="token function-variable function">component</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  definition<span class="token punctuation">.</span>name <span class="token operator">=</span> definition<span class="token punctuation">.</span>name <span class="token operator">||</span> id<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="组件定义-definition" tabindex="-1"><a class="header-anchor" href="#组件定义-definition" aria-hidden="true">#</a> 组件定义 definition</h4><p>Vue.component 的第二个参数 definition，即组件定义； 组件定义 definition 即可以是函数，也可以是对象：</p><p>Vue.extend({ /_ ... <em>/ } { /</em> ... _/ }</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 写法 1：注册组件，传入一个扩展过的构造器</span>
Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;my-component&#39;</span><span class="token punctuation">,</span> Vue<span class="token punctuation">.</span><span class="token function">extend</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment">// 写法 2：注册组件，传入一个选项对象 (自动调用 Vue.extend)</span>
Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;my-component&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment">// 获取注册的组件 (始终返回构造器)</span>
<span class="token keyword">var</span> MyComponent <span class="token operator">=</span> Vue<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;my-component&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>若入参 definition 为对象，则在 Vue.component 方法内部会使用 Vue.extend 进行一次处理：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/global-api/index.js</span>

<span class="token doc-comment comment">/**
  * 使用基础的 Vue 构造器，创造一个子类
  * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">definition</span>
  */</span>
Vue<span class="token punctuation">.</span><span class="token function-variable function">extend</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

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

  <span class="token comment">// 如果传入的 definition 是对象，需要用 Vue.extend 包裹</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token function">isObject</span><span class="token punctuation">(</span>definition<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    definition <span class="token operator">=</span> Vue<span class="token punctuation">.</span><span class="token function">extend</span><span class="token punctuation">(</span>definition<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Vue.extend：使用基础的 Vue 构造器，创建一个子类；</p><h3 id="组件构造函数的全局保存" tabindex="-1"><a class="header-anchor" href="#组件构造函数的全局保存" aria-hidden="true">#</a> 组件构造函数的全局保存</h3><p>在 initGlobalAPI 方法中，Vue.options 用于存放全局属性；而在全局组件中，也会使用全局属性；所以，全局组件也要注册到 Vue.options 上； 所以，扩展 Vue.options 对象 Vue.options.components 用于存放全局组件：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/global-api/index.js</span>

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
  Vue<span class="token punctuation">.</span><span class="token function-variable function">extend</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">definition</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

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

    <span class="token comment">// 如果传入的 definition 是对象，需要用 Vue.extend 包裹</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token function">isObject</span><span class="token punctuation">(</span>definition<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
      definition <span class="token operator">=</span> Vue<span class="token punctuation">.</span><span class="token function">extend</span><span class="token punctuation">(</span>definition<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 将 definition 对象保存到全局：Vue.options.components</span>
    Vue<span class="token punctuation">.</span>options<span class="token punctuation">.</span>components<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> definition<span class="token punctuation">;</span>

  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Vue.options.components 就相当于在全局维护了一个组件名与组件构造函数的映射关系； 这样做的目的和作用：</p><blockquote><p>便于后续通过全局上的 vm.constructor.options 进行全局、局部组件的合并； 便于后续根据组件虚拟节点的 tag 标签，能够直接查找到该组件的构造函数并进行组件的实例化；</p></blockquote><h3 id="vue-component-总结" tabindex="-1"><a class="header-anchor" href="#vue-component-总结" aria-hidden="true">#</a> Vue.component 总结</h3><blockquote><p>Vue.component 是 Vue Global API； 通过调用 Vue.component 进行全局组件声明； 在 Vue 初始化时，Vue.component 内部通过 Vue.extend 生成子类，即组件的构造函数； 维护组件名与组件构造函数的映射关系到 Vue.options.components 供后续组件合并与组件实例化使用；</p></blockquote>`,42);function l(u,d){return s(),a("div",null,[i,e(" more "),c])}const k=n(o,[["render",l],["__file","（二十七）组件部分-Vue-component实现.html.vue"]]);export{k as default};

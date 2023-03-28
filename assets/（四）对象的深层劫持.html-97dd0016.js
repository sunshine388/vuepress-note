import{_ as n,W as s,X as a,Y as e,Z as t,$ as p}from"./framework-d2dfa12e.js";const c={},o=t("p",null,"对 data 数据进行初始化操作，对象属性的深层劫持",-1),i=p(`<h2 id="对象属性深层观测的实现" tabindex="-1"><a class="header-anchor" href="#对象属性深层观测的实现" aria-hidden="true">#</a> 对象属性深层观测的实现</h2><p>当对象属性 obj 即将被 Object.defineProperty 劫持时，再对 obj 对象做一次“对象的单层劫持”，更深层的对象属性劫持，就是在递归执行“对象的单层劫持”</p><p>即：当属性为对象类型时（非 null），继续调用 observe 进行观测，observe 的递归实现了对象属性的深层劫持</p><h2 id="代码逻辑" tabindex="-1"><a class="header-anchor" href="#代码逻辑" aria-hidden="true">#</a> 代码逻辑</h2><p>递归</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">observe</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 递归实现深层观测</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>newValue <span class="token operator">===</span> value<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//继续劫持用户设置的值，因为用户设置的值可能是个对象</span>
      value <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="当设置的值为对象时-将此对象继续进行深层观测" tabindex="-1"><a class="header-anchor" href="#当设置的值为对象时-将此对象继续进行深层观测" aria-hidden="true">#</a> 当设置的值为对象时，将此对象继续进行深层观测</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/observe/index.js#defineReactive</span>

<span class="token doc-comment comment">/**
 * 给对象Obj，定义属性key，值为value
 *  使用Object.defineProperty重新定义data对象中的属性
 *  由于Object.defineProperty性能低，所以vue2的性能瓶颈也在这里
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">obj</span> 需要定义属性的对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">key</span> 给对象定义的属性名
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">value</span> 给对象定义的属性值
 */</span>
<span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">observe</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 递归实现深层观测</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>
        <span class="token string">&quot;修改了被观测属性 key = &quot;</span> <span class="token operator">+</span>
          key <span class="token operator">+</span>
          <span class="token string">&quot;, newValue = &quot;</span> <span class="token operator">+</span>
          <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>newValue <span class="token operator">===</span> value<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token comment">// 当值被修改时，通过 observe 实现对新值的深层观测，此时，新增对象将被观测</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      value <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8);function l(u,r){return s(),a("div",null,[o,e(" more "),i])}const d=n(c,[["render",l],["__file","（四）对象的深层劫持.html.vue"]]);export{d as default};

import{_ as n,W as s,X as a,Y as t,Z as p,$ as e}from"./framework-d2dfa12e.js";const o={},l=p("p",null,"生成 ast 语法树-代码实现",-1),c=e(`<h2 id="模板解析" tabindex="-1"><a class="header-anchor" href="#模板解析" aria-hidden="true">#</a> 模板解析</h2><p>模板解析的方式：对模板不停截取，直至全部解析完毕，可以使用 while 循环</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/compiler/index.js#parserHTML</span>

<span class="token keyword">function</span> <span class="token function">parserHTML</span><span class="token punctuation">(</span><span class="token parameter">html</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>html<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 解析标签or文本，看第一个字符是否为尖角号 &lt;</span>
    <span class="token keyword">let</span> index <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">&quot;&lt;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>index <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;是标签&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;是文本&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="parsestarttag-解析开始标签" tabindex="-1"><a class="header-anchor" href="#parsestarttag-解析开始标签" aria-hidden="true">#</a> parseStartTag 解析开始标签</h3><p>包含尖叫号 &lt; 的情况，有可能是开始标签，但也有可能是结束标签</p><p>所以当为标签时，先使用正则匹配开始标签；如果没有匹配成功，再使用结束标签进行匹配</p><p>parseStartTag 方法：匹配开始标签，返回匹配结果</p><p>备注：匹配结果的索引 1 可以得到标签名，属性后续解析</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/compiler/index.js#parserHTML</span>

<span class="token keyword">function</span> <span class="token function">parserHTML</span><span class="token punctuation">(</span><span class="token parameter">html</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token doc-comment comment">/**
   * 匹配开始标签，返回匹配结果
   */</span>
  <span class="token keyword">function</span> <span class="token function">parseStartTag</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 匹配开始标签，开始标签名为索引 1</span>
    <span class="token keyword">const</span> start <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>startTagOpen<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 构造匹配结果，包含标签名和属性</span>
    <span class="token keyword">const</span> match <span class="token operator">=</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">tagName</span><span class="token operator">:</span> start<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token literal-property property">attrs</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;match结果：&quot;</span> <span class="token operator">+</span> match<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 对模板不停截取，直至全部解析完毕</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>html<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 解析标签和文本(看开头是否为&lt;)</span>
    <span class="token keyword">let</span> index <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">&quot;&lt;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>index <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;解析 html：&quot;</span> <span class="token operator">+</span> html <span class="token operator">+</span> <span class="token string">&quot;,结果：是标签&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 如果是标签，继续解析开始标签和属性</span>
      <span class="token keyword">const</span> startTagMatch <span class="token operator">=</span> <span class="token function">parseStartTag</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 匹配开始标签，返回匹配结果</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>startTagMatch<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 匹配到开始标签</span>
        <span class="token keyword">continue</span><span class="token punctuation">;</span> <span class="token comment">// 如果是开始标签，无需执行下面逻辑，继续下次 while 解析后续内容</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 没有匹配到开始标签，此时有可能为结束标签 &lt;/div&gt;，继续处理结束标签</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>html<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>endTag<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 匹配到结束标签</span>
        <span class="token keyword">continue</span><span class="token punctuation">;</span> <span class="token comment">// 如果是结束标签，无需执行下面逻辑，继续下次 while 解析后续内容</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;解析 html：&quot;</span> <span class="token operator">+</span> html <span class="token operator">+</span> <span class="token string">&quot;,结果：是文本&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了实现对已经匹配到标签进行截取，</p><p>需要 advance 方法：前进，即截取至当前已解析位置</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/compiler/index.js#parserHTML</span>

<span class="token keyword">function</span> <span class="token function">parserHTML</span><span class="token punctuation">(</span><span class="token parameter">html</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 截取字符串
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">len</span> 截取长度
   */</span>
  <span class="token keyword">function</span> <span class="token function">advance</span><span class="token punctuation">(</span><span class="token parameter">len</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    html <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span>len<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 匹配开始标签,返回匹配结果
   */</span>
  <span class="token keyword">function</span> <span class="token function">parseStartTag</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 匹配开始标签，开始标签名为索引 1</span>
    <span class="token keyword">const</span> start <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>startTagOpen<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 构造匹配结果，包含标签名和属性</span>
    <span class="token keyword">const</span> match <span class="token operator">=</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">tagName</span><span class="token operator">:</span>start<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token literal-property property">attrs</span><span class="token operator">:</span><span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;match 结果：&quot;</span> <span class="token operator">+</span> match<span class="token punctuation">)</span>
    <span class="token comment">// 截取匹配到的结果</span>
    <span class="token function">advance</span><span class="token punctuation">(</span>start<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;截取后的 html：&quot;</span> <span class="token operator">+</span> html<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
	<span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解析开始标签中的属性" tabindex="-1"><a class="header-anchor" href="#解析开始标签中的属性" aria-hidden="true">#</a> 解析开始标签中的属性</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>id=&quot;app&quot;&gt;{{message}}&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>开始标签中，可能存在多个属性，此部分需要循环进行处理</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/compiler/index.js#parserHTML#parseStartTag</span>

<span class="token keyword">function</span> <span class="token function">parseStartTag</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> start <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>startTagOpen<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> match <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">tagName</span><span class="token operator">:</span> start<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">attrs</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;match 结果：&quot;</span> <span class="token operator">+</span> match<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 截取匹配到的结果</span>
  <span class="token function">advance</span><span class="token punctuation">(</span>start<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;截取后的 html：&quot;</span> <span class="token operator">+</span> html<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">let</span> end<span class="token punctuation">;</span> <span class="token comment">// 是否匹配到开始标签的结束符号 &gt; 或 /&gt;</span>
  <span class="token keyword">let</span> attr<span class="token punctuation">;</span> <span class="token comment">// 存储属性匹配的结果</span>
  <span class="token comment">// 匹配属性且不能为开始的结束标签，例如：&lt;div&gt;，到 &gt; 就已经结束了，不再继续匹配该标签内的属性</span>
  <span class="token comment">// 		attr = html.match(attribute)  匹配属性并赋值当前属性的匹配结果</span>
  <span class="token comment">// 		!(end = html.match(startTagClose))   没有匹配到开始标签的关闭符号 &gt; 或 /&gt;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>end <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>startTagClose<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>attr <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>attribute<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 将匹配到的属性，push 到 attrs 数组中，匹配到关闭符号 &gt;，while 就结束</span>
    match<span class="token punctuation">.</span>attrs<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> attr<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token literal-property property">value</span><span class="token operator">:</span> attr<span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">||</span> attr<span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">]</span> <span class="token operator">||</span> attr<span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">advance</span><span class="token punctuation">(</span>attr<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 截取匹配到的属性 xxx=xxx</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 匹配到关闭符号 &gt;,当前标签处理完成 while 结束</span>
  <span class="token comment">// 此时，&lt;div id=&quot;app&quot; 处理完成，需连同关闭符号 &gt; 一起被截取掉</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>end<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">advance</span><span class="token punctuation">(</span>end<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 开始标签处理完成后，返回匹配结果：tagName 标签名 + attrs属性</span>
  <span class="token keyword">return</span> match<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="开始标签的处理步骤" tabindex="-1"><a class="header-anchor" href="#开始标签的处理步骤" aria-hidden="true">#</a> 开始标签的处理步骤</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;div id=&quot;app&quot; a=1 b=2&gt;

处理过程：

	&lt;开头，说明是标签：可能是开始标签，也可能是结束标签
  匹配正则 startTagOpen，获取属性名和属性
  匹配“&lt;div”						剩		 “ id=&quot;app&quot; a=1 b=2&gt;”
	匹配“ id=&quot;app&quot;”				剩		 “ a=1 b=2&gt;”
	匹配“ a=1”						剩		 “ b=2&gt;”
	匹配“ b=2”						剩		 “&gt;”
	匹配“&gt;”

匹配到 “&gt;”，while 循环就终止了
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至此，开始标签就解析完成了</p><h3 id="处理开始标签、结束标签和文本" tabindex="-1"><a class="header-anchor" href="#处理开始标签、结束标签和文本" aria-hidden="true">#</a> 处理开始标签、结束标签和文本</h3><p>继续，将开始标签的状态（开始标签、结束标签、文本标签）发射出去</p><p>编写三个发射状态的方法，分别用于向外发射开始标签、结束标签、文本标签</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/compiler/index.js#parserHTML#start</span>
<span class="token comment">// src/compiler/index.js#parserHTML#end</span>
<span class="token comment">// src/compiler/index.js#parserHTML#text</span>

<span class="token comment">// 开始标签</span>
<span class="token keyword">function</span> <span class="token function">start</span><span class="token punctuation">(</span><span class="token parameter">tagName<span class="token punctuation">,</span> attrs</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;start&quot;</span><span class="token punctuation">,</span> tagName<span class="token punctuation">,</span> attrs<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// 结束标签</span>
<span class="token keyword">function</span> <span class="token function">end</span><span class="token punctuation">(</span><span class="token parameter">tagName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;end&quot;</span><span class="token punctuation">,</span> tagName<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// 文本标签</span>
<span class="token keyword">function</span> <span class="token function">text</span><span class="token punctuation">(</span><span class="token parameter">chars</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;text&quot;</span><span class="token punctuation">,</span> chars<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当匹配到开始标签、结束标签、文本时，将数据发送出去</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// src/compiler/index.js#parserHTML#parseStartTag</span>

<span class="token doc-comment comment">/**
 * 匹配开始标签,返回匹配结果
 */</span>
<span class="token keyword">function</span> <span class="token function">parseStartTag</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> start <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>startTagOpen<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>start<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> match <span class="token operator">=</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">tagName</span><span class="token operator">:</span> start<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token literal-property property">attrs</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token function">advance</span><span class="token punctuation">(</span>start<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> end<span class="token punctuation">;</span>
    <span class="token keyword">let</span> attr<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>
      <span class="token operator">!</span><span class="token punctuation">(</span>end <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>startTagClose<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
      <span class="token punctuation">(</span>attr <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>attribute<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      match<span class="token punctuation">.</span>attrs<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> attr<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token literal-property property">value</span><span class="token operator">:</span> attr<span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">||</span> attr<span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">]</span> <span class="token operator">||</span> attr<span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">advance</span><span class="token punctuation">(</span>attr<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>end<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">advance</span><span class="token punctuation">(</span>end<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> match<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">while</span> <span class="token punctuation">(</span>html<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> index <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">&quot;&lt;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>index <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;解析 html：&quot;</span> <span class="token operator">+</span> html <span class="token operator">+</span> <span class="token string">&quot;,结果：是标签&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 如果是标签，继续解析开始标签和属性</span>
    <span class="token keyword">const</span> startTagMatch <span class="token operator">=</span> <span class="token function">parseStartTag</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>
      <span class="token string">&quot;开始标签的匹配结果 startTagMatch = &quot;</span> <span class="token operator">+</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>startTagMatch<span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>startTagMatch<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 匹配到开始标签，调用start方法，传递标签名和属性</span>
      <span class="token function">start</span><span class="token punctuation">(</span>startTagMatch<span class="token punctuation">.</span>tagName<span class="token punctuation">,</span> startTagMatch<span class="token punctuation">.</span>attrs<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span> <span class="token comment">// 如果是开始标签，不需要继续向下走了，继续 while 解析后面的部分</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 如果开始标签没有匹配到，有可能是结束标签 &lt;/div&gt;</span>
    <span class="token keyword">let</span> endTagMatch<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>endTagMatch <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>endTag<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 匹配到了，说明是结束标签</span>
      <span class="token comment">// 匹配到开始标签，调用start方法，传递标签名和属性</span>
      <span class="token function">end</span><span class="token punctuation">(</span>endTagMatch<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">advance</span><span class="token punctuation">(</span>endTagMatch<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span> <span class="token comment">// 如果是结束标签，不需要继续向下走了，继续 while 解析后面的部分</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>index <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 文本</span>
    <span class="token comment">// 将文本取出来并发射出去,再从 html 中拿掉</span>
    <span class="token keyword">let</span> chars <span class="token operator">=</span> html<span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// hello&lt;/div&gt;</span>
    <span class="token function">text</span><span class="token punctuation">(</span>chars<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">advance</span><span class="token punctuation">(</span>chars<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至此，已经拿到了标签名、属性等，但此时还不是树形结构，没有形成一棵树</p><h2 id="测试一个较复杂的模板解析" tabindex="-1"><a class="header-anchor" href="#测试一个较复杂的模板解析" aria-hidden="true">#</a> 测试一个较复杂的模板解析</h2><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>app<span class="token punctuation">&quot;</span></span> <span class="token attr-name">a</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&#39;</span>1<span class="token punctuation">&#39;</span></span> <span class="token attr-name">b</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span>2</span> <span class="token punctuation">&gt;</span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>{{message}} <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span>Hello Vue<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>vue.js<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
    <span class="token keyword">let</span> vm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">&#39;#app&#39;</span><span class="token punctuation">,</span>
      <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">message</span><span class="token operator">:</span>  <span class="token string">&quot;Brave&quot;</span> <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打印结果：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>进入 state.js - initData，数据初始化操作
***** 进入 $mount，el = #app*****
获取真实的元素，el = [object HTMLDivElement]
options 中没有 render , 继续取 template
options 中没有 template, 取 el.outerHTML = &lt;div id=&quot;app&quot; a=&quot;1&quot; b=&quot;2&quot;&gt; &lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
***** 进入 compileToFunction：将 template 编译为 render 函数 *****
***** 进入 parserHTML：将模板编译成 AST 语法树*****
解析 html：&lt;div id=&quot;app&quot; a=&quot;1&quot; b=&quot;2&quot;&gt; &lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： &lt;div id=&quot;app&quot; a=&quot;1&quot; b=&quot;2&quot;&gt; &lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;*****
html.match(startTagOpen) 结果:{&quot;tagName&quot;:&quot;div&quot;,&quot;attrs&quot;:[]}
截取匹配内容后的 html: id=&quot;app&quot; a=&quot;1&quot; b=&quot;2&quot;&gt; &lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
匹配到属性 attr = [&quot; id=\\&quot;app\\&quot;&quot;,&quot;id&quot;,&quot;=&quot;,&quot;app&quot;,null,null]
截取匹配内容后的 html: a=&quot;1&quot; b=&quot;2&quot;&gt; &lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
匹配到属性 attr = [&quot; a=\\&quot;1\\&quot;&quot;,&quot;a&quot;,&quot;=&quot;,&quot;1&quot;,null,null]
截取匹配内容后的 html: b=&quot;2&quot;&gt; &lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
匹配到属性 attr = [&quot; b=\\&quot;2\\&quot;&quot;,&quot;b&quot;,&quot;=&quot;,&quot;2&quot;,null,null]
截取匹配内容后的 html:&gt; &lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
匹配关闭符号结果 html.match(startTagClose):[&quot;&gt;&quot;,&quot;&quot;]
截取匹配内容后的 html: &lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
&gt;&gt;&gt;&gt;&gt; 开始标签的匹配结果 startTagMatch = {&quot;tagName&quot;:&quot;div&quot;,&quot;attrs&quot;:[{&quot;name&quot;:&quot;id&quot;,&quot;value&quot;:&quot;app&quot;},{&quot;name&quot;:&quot;a&quot;,&quot;value&quot;:&quot;1&quot;},{&quot;name&quot;:&quot;b&quot;,&quot;value&quot;:&quot;2&quot;}]}
发射匹配到的开始标签-start,tagName = div,attrs = [{&quot;name&quot;:&quot;id&quot;,&quot;value&quot;:&quot;app&quot;},{&quot;name&quot;:&quot;a&quot;,&quot;value&quot;:&quot;1&quot;},{&quot;name&quot;:&quot;b&quot;,&quot;value&quot;:&quot;2&quot;}]
解析 html： &lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;,结果：是文本
发射匹配到的文本-text,chars =
截取匹配内容后的 html:&lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
解析 html：&lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： &lt;p&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;*****
html.match(startTagOpen) 结果:{&quot;tagName&quot;:&quot;p&quot;,&quot;attrs&quot;:[]}
截取匹配内容后的 html:&gt;{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
匹配关闭符号结果 html.match(startTagClose):[&quot;&gt;&quot;,&quot;&quot;]
截取匹配内容后的 html:{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
&gt;&gt;&gt;&gt;&gt; 开始标签的匹配结果 startTagMatch = {&quot;tagName&quot;:&quot;p&quot;,&quot;attrs&quot;:[]}
发射匹配到的开始标签-start,tagName = p,attrs = []
解析 html：{{message}} &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;,结果：是文本
发射匹配到的文本-text,chars = {{message}}
截取匹配内容后的 html:&lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
解析 html：&lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： &lt;span&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;*****
html.match(startTagOpen) 结果:{&quot;tagName&quot;:&quot;span&quot;,&quot;attrs&quot;:[]}
截取匹配内容后的 html:&gt;Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
匹配关闭符号结果 html.match(startTagClose):[&quot;&gt;&quot;,&quot;&quot;]
截取匹配内容后的 html:Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
&gt;&gt;&gt;&gt;&gt; 开始标签的匹配结果 startTagMatch = {&quot;tagName&quot;:&quot;span&quot;,&quot;attrs&quot;:[]}
发射匹配到的开始标签-start,tagName = span,attrs = []
解析 html：Hello Vue&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;,结果：是文本
发射匹配到的文本-text,chars = Hello Vue
截取匹配内容后的 html:&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;
===============================
解析 html：&lt;/span&gt;&lt;/p&gt;&lt;/div&gt;,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： &lt;/span&gt;&lt;/p&gt;&lt;/div&gt;*****
未匹配到开始标签，返回 false
===============================
发射匹配到的结束标签-end,tagName = span
截取匹配内容后的 html:&lt;/p&gt;&lt;/div&gt;
===============================
解析 html：&lt;/p&gt;&lt;/div&gt;,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： &lt;/p&gt;&lt;/div&gt;*****
未匹配到开始标签，返回 false
===============================
发射匹配到的结束标签-end,tagName = p
截取匹配内容后的 html:&lt;/div&gt;
===============================
解析 html：&lt;/div&gt;,结果：是标签
***** 进入 parseStartTag，尝试解析开始标签，当前 html： &lt;/div&gt;*****
未匹配到开始标签，返回 false
===============================
发射匹配到的结束标签-end,tagName = div
截取匹配内容后的 html:
===============================
当前 template 模板，已全部解析完成
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,30);function i(u,r){return s(),a("div",null,[l,t(" more "),c])}const k=n(o,[["render",i],["__file","（十）生成ast语法树-模板解析.html.vue"]]);export{k as default};

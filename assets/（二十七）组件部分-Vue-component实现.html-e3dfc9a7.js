const e=JSON.parse('{"key":"v-233a21ed","path":"/%E6%89%8B%E5%86%99vue2%E6%BA%90%E7%A0%81/%EF%BC%88%E4%BA%8C%E5%8D%81%E4%B8%83%EF%BC%89%E7%BB%84%E4%BB%B6%E9%83%A8%E5%88%86-Vue-component%E5%AE%9E%E7%8E%B0.html","title":"（二十七）组件部分-Vue.component实现","lang":"zh-CN","frontmatter":{"title":"（二十七）组件部分-Vue.component实现","order":27,"description":"Vue.component 的实现","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/vuepress-note/%E6%89%8B%E5%86%99vue2%E6%BA%90%E7%A0%81/%EF%BC%88%E4%BA%8C%E5%8D%81%E4%B8%83%EF%BC%89%E7%BB%84%E4%BB%B6%E9%83%A8%E5%88%86-Vue-component%E5%AE%9E%E7%8E%B0.html"}],["meta",{"property":"og:site_name","content":"个人笔记"}],["meta",{"property":"og:title","content":"（二十七）组件部分-Vue.component实现"}],["meta",{"property":"og:description","content":"Vue.component 的实现"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-03-17T01:54:54.000Z"}],["meta",{"property":"article:modified_time","content":"2023-03-17T01:54:54.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"（二十七）组件部分-Vue.component实现\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-03-17T01:54:54.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"组件初始化流程简介","slug":"组件初始化流程简介","link":"#组件初始化流程简介","children":[{"level":3,"title":"Vue.component API","slug":"vue-component-api","link":"#vue-component-api","children":[]},{"level":3,"title":"Vue.extend","slug":"vue-extend","link":"#vue-extend","children":[]},{"level":3,"title":"保存组件构造函数","slug":"保存组件构造函数","link":"#保存组件构造函数","children":[]},{"level":3,"title":"组件合并","slug":"组件合并","link":"#组件合并","children":[]},{"level":3,"title":"组件合并的策略","slug":"组件合并的策略","link":"#组件合并的策略","children":[]},{"level":3,"title":"组件的初渲染和更新","slug":"组件的初渲染和更新","link":"#组件的初渲染和更新","children":[]}]},{"level":2,"title":"Vue.component 实现","slug":"vue-component-实现","link":"#vue-component-实现","children":[{"level":3,"title":"Vue.component 如何加载","slug":"vue-component-如何加载","link":"#vue-component-如何加载","children":[]},{"level":3,"title":"Vue.component 如何定义","slug":"vue-component-如何定义","link":"#vue-component-如何定义","children":[]},{"level":3,"title":"组件构造函数的全局保存","slug":"组件构造函数的全局保存","link":"#组件构造函数的全局保存","children":[]},{"level":3,"title":"Vue.component 总结","slug":"vue-component-总结","link":"#vue-component-总结","children":[]}]}],"git":{"createdTime":1678977530000,"updatedTime":1679018094000,"contributors":[{"name":"sunshine388","email":"2723166086@qq.com","commits":2}]},"readingTime":{"minutes":4.38,"words":1315},"filePathRelative":"手写vue2源码/（二十七）组件部分-Vue-component实现.md","localizedDate":"2023年3月16日","excerpt":"<p>Vue.component 的实现</p>\\n","autoDesc":true}');export{e as data};

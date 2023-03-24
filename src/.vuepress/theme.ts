import { hopeTheme } from "vuepress-theme-hope";
import Navbar from "./Navbar.js";
import Sidebar from "./Sidebar";

export default hopeTheme({
  hostname: "https://vuepress-theme-hope-docs-demo.netlify.app",

  iconAssets: "iconfont",
  favicon: "/logo.svg",
  logo: "/logo.svg",

  repo: "sunshine388/vuepress-note",
  docsDir: "src",

  navbar: Navbar,
  sidebar: Sidebar,

  displayFooter: false,
  metaLocales: {
    editLink: "在github上编辑此页",
    toc: "大纲",
  },

  encrypt: {
    global: true,
    admin: "qwerasdf",
  },
  hotReload: true, // 开发模式下显示最近更新时间
  contributors: false, // 不显示页面贡献者

  blog: {
    name: "个人笔记",
  },
  plugins: {
    blog: {
      excerptLength: 0,
    },
    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },
  },
});

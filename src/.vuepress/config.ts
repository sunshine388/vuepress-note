import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

const isProd = process.env.NODE_ENV === "production";

export default defineUserConfig({
  base: isProd ? "/vuepress-note/" : "/",
  lang: "zh-CN",
  title: "个人笔记",
  theme,
});

/// <reference types="vitest" />
// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

import AutoImport from "unplugin-auto-import/vite";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

import fs from 'fs';
import path from 'path';

const key = fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem'));
const cert = fs.readFileSync(path.resolve(__dirname, 'localhost.pem'));

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: { configFile: "src/styles/variables.scss" },
    }),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
    }),

  ],
  define: { "process.env": {} },
  test: {
    globals: true,
    environment: "happy-dom",
  },
  base: '/',
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境打包移除console
        drop_console: true,
        drop_debugger: true,
      }
    }
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@data": fileURLToPath(new URL("./src/data", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {


    port: 4399,
    proxy: {
      "/sdApi": {
        target: "http://me.yunrobot.cn:7860",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sdApi/, ""),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: { charset: false },
      css: { charset: false },
    },
  },
  cacheDir: ".vite_cache", // 将缓存目录设置为项目根目录下的 .vite_cache 文件夹
});

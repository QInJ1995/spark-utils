import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import nodeExternals from "rollup-plugin-node-externals";
import json from "@rollup/plugin-json";
import clear from "rollup-plugin-clear";

// 库名称（浏览器全局变量名，如 window.SparkUtils
const LIB_NAME = "SparkUtils";

export default {
  // 入口文件
  input: "src/index.ts",

  // 输出三种格式
  output: [
    // 1. ES Module（现代 Node / 浏览器）
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: false,
    },
    // 2. CommonJS（Node 老版本）
    {
      file: "dist/index.cjs",
      format: "cjs",
      sourcemap: false,
    },
    // 3. UMD（浏览器直接引入 + Node 通用）
    {
      file: "dist/index.umd.min.js",
      format: "umd",
      name: LIB_NAME, // 浏览器全局变量名
      sourcemap: false,
      plugins: [terser()], // 压缩
    },
  ],

  plugins: [
    clear({ targets: ["dist"] }),
    nodeExternals({
      // 核心选项（默认已最优，按需改）
      builtins: true, // 排除Node内置（默认true）
      deps: false, // 排除dependencies（默认true）
      peerDeps: true, // 排除peerDependencies（默认true）
      devDeps: false, // 不排除devDeps（默认false，要打包工具类则改true）
      optDeps: true, // 排除optionalDependencies
      // 强制排除（即使在deps里也打包）
      exclude: [],
      // 强制包含（即使是内置也排除）
      include: [],
    }),
    resolve({ browser: true }), // 解析 node_modules 依赖
    commonjs(), // 兼容 CommonJS 模块
    typescript(), // 编译 TS + 生成类型文件
    json(),
  ],
};

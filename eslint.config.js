import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.{ts,mts,cts}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // 未使用变量的规则
      "@typescript-eslint/no-var-requires": "off", // 未定义变量的规则
      "@typescript-eslint/no-this-alias": "off", // 禁用 this 别名规则
      "@typescript-eslint/no-redeclare": "off", // 禁止重复声明规则
    },
  },
]);

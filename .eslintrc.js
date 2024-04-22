module.exports = {
  parser: "@babel/eslint-parser",
  // 继承 Eslint 规则
  extends: ["eslint:recommended"],
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
    es6: true, // es6
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": 1,
    "no-dupe-else-if": 1,
    "no-prototype-builtins": 1,
    "no-undef": 1,
    "no-empty": 1,
  },
};
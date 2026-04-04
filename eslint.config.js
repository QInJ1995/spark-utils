import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	// 全局忽略
	{
		ignores: ['node_modules', 'dist', '*.md', '.vscode', '.idea', '.husky']
	},

	// JS + TS 基础配置
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},

	// JS 推荐规则
	js.configs.recommended,

	// TS 推荐规则（官方正确写法）
	...tseslint.configs.recommended,

	// Prettier 兼容（关闭冲突规则）
	prettier,

	// 自定义 TS 规则
	{
		files: ['**/*.{ts,mts,cts}'],
		rules: {
			// TypeScript 类型相关规则
			'@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型（工具库需要灵活性）
			'@typescript-eslint/no-unused-vars': 'off', // 允许未使用的变量（避免开发过程中的干扰）
			'@typescript-eslint/no-var-requires': 'off', // 允许 require 语法（兼容 CommonJS 模块）
			'@typescript-eslint/no-this-alias': 'off', // 允许 this 别名赋值（如 const self = this）
			'@typescript-eslint/no-redeclare': 'off', // 允许变量重复声明（兼容旧代码）
			'@typescript-eslint/no-unused-expressions': 'off', // 允许未使用的表达式
			'@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore 等注释
			// JavaScript 代码风格规则
			'prefer-rest-params': 'off', // 允许使用 arguments 对象
			'prefer-const': 'off', // 不强制使用 const（允许 var/let）
			'prefer-spread': 'off', // 不强制使用展开运算符
			'no-var': 'off', // 允许使用 var 声明变量
			'no-useless-assignment': 'off', // 允许无用的赋值操作
			'no-shadow-restricted-names': 'off', // 允许遮蔽受限名称（如 undefined、NaN）
			'no-cond-assign': 'off', // 允许条件语句中的赋值操作
			'no-control-regex': 'off' // 允许正则表达式中使用控制字符
		}
	}
]);

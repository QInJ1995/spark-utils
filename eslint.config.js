import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: { js },
		extends: ['js/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
		languageOptions: { globals: { ...globals.browser, ...globals.node } }
	},
	tseslint.configs.recommended,
	{ ignores: ['node_modules', 'dist', '*.md', '.vscode', '.idea', '.husky'] },
	{
		files: ['**/*.{ts,mts,cts}'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off', // 允许未使用的变量
			'@typescript-eslint/no-var-requires': 'off', // 允许使用 require() 导入模块
			'@typescript-eslint/no-this-alias': 'off', // 允许将 this 赋值给其他变量
			'@typescript-eslint/no-redeclare': 'off', // 允许重复声明同名变量
			'@typescript-eslint/no-unused-expressions': 'off', // 允许未使用的表达式
			'@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore 等 TypeScript 注释指令
			'prefer-rest-params': 'off', // 允许使用 arguments 而非 rest 参数
			'prefer-const': 'off', // 允许使用 let 即使变量未被重新赋值
			'prefer-spread': 'off', // 允许使用 .apply() 等方法而非展开运算符
			'no-var': 'off', // 允许使用 var 声明变量
			'no-useless-assignment': 'off', // 允许无用的赋值操作
			'no-shadow-restricted-names': 'off', // 允许遮蔽全局受限名称（如 undefined, NaN）
			'no-cond-assign': 'off', // 允许在条件语句中进行赋值操作
			'no-control-regex': 'off' // 允许在正则表达式中使用控制字符
		}
	}
]);

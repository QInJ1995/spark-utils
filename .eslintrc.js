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
		"no-unused-vars": 0,
		"no-dupe-else-if": 1,
		"no-prototype-builtins": 1,
		"no-undef": 0,
		"no-empty": 1,
		"no-redeclare": 0,
		"no-mixed-spaces-and-tabs": 0,
		"no-shadow-restricted-names": 0,
		"no-cond-assign": 0,
		"no-control-regex": 0,
		"no-debugger": 1,
		"comma-dangle": ['error', {
			arrays: 'never',
			objects: 'always',
			imports: 'always',
			exports: 'always',
			functions: 'never',
		}],
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1,
				"VariableDeclarator": 1,
				"outerIIFEBody": 1,
			}
		],
	},
};
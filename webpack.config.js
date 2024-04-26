const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackBar = require('webpackbar')
const ESLintWebpackPlugin = require("eslint-webpack-plugin")
const path = require('path');

module.exports = {
	mode: 'none', // 因为默认是production 默认会进行压缩
	entry: {
		"spark-utils": "./src/index.js",
		"spark-utils.min": "./src/index.js",
		// "test": './public/test.js'
	},
	output: {
		filename: "[name].js",
		library: "SparkUtils",
		clean: true,
		libraryExport: "default", // 不添加的话引用的时候需要 SparkUtils.default
		libraryTarget: "umd", // var this window ...
		// publicPath: '/assets/', // 确保这个路径和你服务器上的路径一致
	},
	devServer: {
		hot: true,
	},
	// 忽略没有引用的第三方模块
	externals: {
		vue: 'vue', // 忽略没有引用的vue
	},
	optimization: {
		minimize: true,
		// usedExports: false, // 关闭副作用标识功能
		minimizer: [
			new TerserPlugin({ // 使用压缩插件
				include: /\.min\.js$/,
			})
		],
	},
	plugins: [
		new ESLintWebpackPlugin({
			// 指定检查文件的根目录
			context: path.resolve(__dirname, "src"),
			files: '**/*.{js,jsx,ts,tsx}', // 指定要检查的文件类型
			fix: true, // 启用自动修复
			cache: true, // 启用缓存以提高性能
		}),
		new WebpackBar({
			// color: "#85d",  // 默认green，进度条颜色支持HEX
			basic: false,   // 默认true，启用一个简单的日志报告器
			profile: false,  // 默认false，启用探查器。
			reporter: {
				start(context) {
					console.log(
						" ____                   _      _   _ _   _ _       _ " + '\n' + 
"/ ___| _ __   __ _ _ __| | __ | | | | |_(_) |___  | |" + '\n' +
"\\___ \\| '_ \\ / _` | '__| |/ / | | | | __| | / __| | |" + '\n' +
" ___) | |_) | (_| | |  |   <  | |_| | |_| | \\__ \\ |_|" + '\n' +
"|____/| .__/ \\__,_|_|  |_|\\_\\  \\___/ \\__|_|_|___/ (_)" + '\n' +
"      |_|                                            " + '\n' 
					)
				}, 
			},
		})
		//     new HtmlWebpackPlugin({
		//     // 以 public/index.html 为模板创建文件
		//     // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
		//     template: path.resolve(__dirname, "public/test.html"),
		//   })
	],
}

const path = require('path');
const WebpackBar = require('webpackbar')
const ESLintWebpackPlugin = require("eslint-webpack-plugin")
 
const commonConfig = {
  // 忽略没有引用的第三方模块
  externals: {
    vue: 'vue', // 忽略没有引用的vue
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
  ],
};
 
module.exports = commonConfig;
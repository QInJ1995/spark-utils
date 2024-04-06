const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin') // 引入压缩插件

module.exports = {
    mode: 'none', // 因为默认是production 默认会进行压缩
    entry: {
        // "spark-utils": "./index.js",
        "spark-utils.min": "./index.js",
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
        hot: true
    },
    // 忽略没有引用的第三方模块
    externals: {
      vue: 'vue' // 忽略没有引用的vue
    },
    optimization: {
        minimize: true,
        // usedExports: false, // 关闭副作用标识功能
        minimizer: [
            new TerserPlugin({ // 使用压缩插件
                include: /\.min\.js$/
            })
        ]
    },
    plugins: [
    //     new HtmlWebpackPlugin({
    //     // 以 public/index.html 为模板创建文件
    //     // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
    //     template: path.resolve(__dirname, "public/test.html"),
    //   })
    ],
}
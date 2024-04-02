const TerserPlugin = require('terser-webpack-plugin') // 引入压缩插件

module.exports = {
    mode: 'none', // 因为默认是production 默认会进行压缩
    entry: {
        "spark-utils": "./index.js",
        "spark-utils.min": "./index.js"
    },
    output: {
        filename: "[name].js",
        library: "SparkUtils",
        clean: true,
        libraryExport: "default", // 不添加的话引用的时候需要 SparkUtils.default
        libraryTarget: "umd", // var this window ...
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
}

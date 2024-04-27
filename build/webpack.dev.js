const {merge,} = require('webpack-merge');
const path = require('path');
const commonConfig = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin')
 
const devConfig = {
  mode: 'development',
  entry: {
    "spark-utils": "./src/index.js",
    "main": "./page/index.js",
  },
  output: {
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    library: "SparkUtils",
    libraryExport: "default",
    libraryTarget: "var", 
  },
  devtool: 'source-map',
  devServer: {
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "spark-utils Test",
      template: path.resolve(__dirname, "../page/index.html"),
    })
  ],
};
 
module.exports = merge(commonConfig, devConfig);
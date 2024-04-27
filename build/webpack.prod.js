const {merge,} = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
 
const prodConfig = {
  mode: 'production',
  entry: {
    "spark-utils.min": "./src/index.js",
  },
  output: {
    filename: "[name].js",
    library: "SparkUtils",
    clean: true,
    libraryExport: "default", // 不添加的话引用的时候需要 SparkUtils.default
    libraryTarget: "umd", // var this window ...
  },
  performance: {
    hints: false,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
      extractComments: false,
    }), new CssMinimizerPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
      // 其他loader配置...
    ],
  },
};
 
module.exports = merge(commonConfig, prodConfig);
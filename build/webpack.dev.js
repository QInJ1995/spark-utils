const {merge,} = require('webpack-merge');
const path = require('path');
const commonConfig = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin')
 
const devConfig = {
  mode: 'development',
  entry: {
    'spark-utils': {
      import: './src/index.js',
      library: {
        // `output.library` 下的所有配置项可以在这里使用
        name: 'SparkUtils',
        type: 'umd',
        export: 'default',
        umdNamedDefine: true,
      },
    },
    main: {
      import: './page/index.js',
      library: {
        type: 'umd',
      },
    },
  },
  output: {
    filename: '[name][hash].js',
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
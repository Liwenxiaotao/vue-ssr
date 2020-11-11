// const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isProd = process.env.NODE_ENE === "production"
/*
*以下为优化开发环境的配置
*/
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const os = require('os')
console.log(`当前cpu核数：${os.cpus().length}`)
// 监控面板
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
// 开启小窗口通知
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
// 生成文件映射表
var ManifestPlugin = require('webpack-manifest-plugin');
// 显示打包进度
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const config = merge(baseConfig, {
  entry: {
    app: path.resolve(__dirname, '../src/entry-client.js')
  },
  optimization: {
    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    // 多进程压缩
    minimizer:[new UglifyJsPlugin({
      // parallel: true,
      parallel: os.cpus().length
    })],
    splitChunks: {
      name: "manifest",
      minChunks: Infinity
    },
    runtimeChunk: {   // 会创建一个在所有生成 chunk 之间共享的运行时文件
      name: 'runtime'
    }
  },
  devtool: "cheap-module-eval-source-map",  // 开发时开启
  devServer: {
    open: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.s(a|c)ss?$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
          path.resolve(__dirname, '../loader/index.js')
        ]
        // use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
    ]
  },
  plugins: [
    // 此插件在输出目录中
    new WebpackBuildNotifierPlugin({
      title: "ssr 客户端代码构建成功",
      // logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true
    }),
    new ProgressBarPlugin(),
    new ManifestPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.simple.html',
      filename: 'index.html',
    })
  ]
})

if (isProd) {
  config.plugins = config.plugins.concat([
    new MiniCssExtractPlugin({
      filename: 'css/style.css'
    })
  ])
}
module.exports = smp.wrap(config)
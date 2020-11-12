// const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

/*
*以下为优化开发环境的配置
*/
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const os = require('os')
console.log(`当前cpu核数：${os.cpus().length}`)
// 监控面板(跟热更新冲突)
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
// 开启小窗口通知
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
// 生成文件映射表
var ManifestPlugin = require('webpack-manifest-plugin');
// 显示打包进度
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// 压缩css
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 对css进行tree shaking
const PurifyCSS = require('purifycss-webpack')
// 硬件缓存(速度提升显著)
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// 多进程压缩
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const glob = require('glob-all')

const isProd = process.env.NODE_ENV === "production"

const resolve = (dir) => path.join(path.resolve(__dirname, "../"), dir)

let config = merge(baseConfig, {
  entry: {
    app: path.resolve(__dirname, '../src/entry-client.js'),
    app2: path.resolve(__dirname, '../src/app2.js')
  },
  optimization: {
    // 多进程压缩(会报错)
    // minimizer:[new UglifyJsPlugin({
    //   parallel: true,
    //   // parallel: os.cpus().length
    // })],
    splitChunks: {
      chunks: 'all',  // 异步还是同步 “initiall | all | async"    // 优化： 提取公用模块
      cacheGroups:{
        lodash: {  // 较大的第三方库单独打包
          test: /lodash/,
          name: "lodash",
          priority: 3,
          minChunks: 1, // 引用最少次数
        },
        vendors:{  // node_modules的包打到一起
          test: /node_modules/,
          name: "vendors", // chunk名称
          minChunks: 1, // 引用最少次数
          priority: 2, // 数值越大，权重越大，优先抽离
          minSize: 0,  // 文件大小,单位子节
        },
        common:{   // 业务代码公用代码单独打包
          name: "common",
          minChunks: 2, // 引用最少次数
          priority: 1,
          chunks: 'all',
          minSize: 0,  // 文件大小,单位子节
        }
      },
    },
    runtimeChunk: {   // 会创建一个在所有生成 chunk 之间共享的运行时文件
      name: 'runtime'
    },
    concatenateModules: true  // 优化： 作用域提升（scope hoisting） 尽量将文件打到同个函数导出
  },
  devtool: isProd ? "none" : "cheap-module-eval-source-map",  // 开发时开启
  devServer: {
    open: true,
    // 代理
    proxy: {
      "/api": "http:127.0.0.1:8888"
    },
    // 请求前钩子
    before(app, server) {
      // 跟express用法一样
      app.get('/api/mock.json', (req, res) => {
        res.json({
          hello: 'hhhhh'
        })
      })
    },
    // 请求后钩子
    after(app, server) {

    },
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          'postcss-loader',
          path.resolve(__dirname, '../loader/index.js')
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
    // 提示框
    new WebpackBuildNotifierPlugin({
      title: "ssr 客户端代码构建成功",
      // logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true
    }),
    // 构建进度
    new ProgressBarPlugin(),
    // 生成映射文件，跟多页有关
    new ManifestPlugin(),
    // 将文件插入html
    new HtmlWebpackPlugin({
      template: './src/index.simple.html',
      filename: 'index.html',
      chunks:['lodash', 'runtime', 'common', 'vendors', 'app'],  // 多入口引用模块，表示该页面要引用那些chunks
      minify: {  // 优化：压缩html配置 （开发环境不压缩）
        removeComments: true,  //移除HTML的注释
        collapseWhitespace: true, // 删除空白符和换行符
        minifyCSS: true // 压缩内联css
      }
    }),
    // 将文件插入html
    new HtmlWebpackPlugin({
      template: './src/index.simple.html',
      filename: 'index2.html',
      chunks:['lodash', 'runtime', 'common', 'vendors', 'app2'],  // 多入口引用模块，表示该页面要引用那些chunks
      minify: {  // 优化：压缩html配置 （开发环境不压缩）
        removeComments: true,  //移除HTML的注释
        collapseWhitespace: true, // 删除空白符和换行符
        minifyCSS: true // 压缩内联css
      }
    })
  ]
})
console.log(config.mode)
if (isProd) {
  config.plugins = config.plugins.concat([
    // 提取css
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash:6].css'
    }),
    // 清理文件夹
    new CleanWebpackPlugin(),
    //优化：压缩css
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'), // 引入cssnano压缩
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),
    // new PurifyCSS({  // 注意会把js控制的css给删除，不适合vue
    //   paths: glob.sync([ // 优化：配置css文件tree shaking的路径文件
    //     resolve('./src/*.html'),
    //     resolve('./src/*.js'),
    //     // resolve('./src/*.vue'),
    //   ])
    // }),
    new ParallelUglifyPlugin({ // 并行压缩输出的js代码
      // 传递给uglify的参数（还是使用UglifyJs压缩，只不过帮助开启了多进程）
      exclude: [/vendors\..*\.js$/],
      uglifyJS: {
        output: {
          beautify: false, // 最紧凑的输出
          comments: false, // 删除所有注释
        },
        compress: {
          // 删除所有的console语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
          // 是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出，可以设置为false关闭这些作用不大的警告
          //warnings: false,
        }
      }
    }),
  ]),
  config = smp.wrap(config)
} else {
    // 热更新，需要把devDerver.hot设为true
    // MiniCssExtractPlugin与热更新有冲突，会让css样式修改热更新失效
    config.plugins = config.plugins.concat(
      [
        new webpack.HotModuleReplacementPlugin(),
        new HardSourceWebpackPlugin(), //放在生产的配置会报错（问题有待确认）时间短时反而热更新更慢
      ]
    )
}
// module.exports = smp.wrap(config)
module.exports = config
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const resolve = (dir) => path.join(path.resolve(__dirname, "../"), dir)
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const os = require('os')

// 优化：并发执行任务（时间慢时，开启多进程反而更慢）注意：happypack与mini-css-extract-plugin配合不好
const HappyPack = require('happypack');
// 设置进程数
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const isProd = process.env.NODE_ENV === "production"

module.exports = {
  mode: isProd ? 'production' : 'development',
  output: {
    path: resolve('dist'),
    publicPath: isProd ? 'www.cdn.com/' : '/',   // 生产环境指定cdn
    filename: '[name].[hash:6].js', // 同步加载的文件名
    chunkFilename: '[name].[contenthash:8].js' // 按需加载的文件名
  },
  resolve: {
    alias: {   // 优化3：设置别名
      'public': resolve('public'),
      '@': resolve('src')
    },
    modules: [resolve('node_modules')], // 优化1：限定第三方模块查找范围
    extensions: [".vue", ".js", ".json"], // 不用滥用，会增加查找时间
    // externals: {
    //   // jquery通过script引入之后，全局中既有jQuery变量
    //   jquery: "jQuery",
    //   lodash: "_"
    // }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process  不解析的模块
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false,
            extractCSS: true  // 提取css文件
          }
        }
      },
      {
        test: /\.jsx?$/,
        // loader: 'happypack/loader?id=babel',  // 使用happypack
        use: ['babel-loader?cacheDirectory'], // 开启缓存
        include: /src/, // 优化2：明确babel解析的文件夹
        // exclude: /node_modules/ 排除范围
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'imgs/[name]_[contenthash:5].[ext]',
          fallback: 'file-loader',
          esModule: false // 很重要，必须设为false
        }
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 100,
          name: 'font/[name]_[contenthash:5].[ext]',
          fallback: 'file-loader',
          esModule: false // 很重要，必须设为false
        }
      },
    ]
  },
  performance: {
    hints: false
  },
 // stats: 'errors-only',
  plugins: [
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    // new HappyPack({    // happypack配套使用
    //   id: 'babel',
    //   // threadPool: happyThreadPool,  // 共享进程功能慎用，项目小的时候，开启happypack和多线程反而使构建时间加长
    //   loaders: [ 'babel-loader?cacheDirectory' ] // // 写法跟loader的写法一样
    // }),
  ]
}
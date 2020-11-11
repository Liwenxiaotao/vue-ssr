const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const resolve = (dir) => path.join(path.resolve(__dirname, "../"), dir)
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const isProd = process.env.NODE_ENE === "production"

module.exports = {
  mode: isProd ? 'production' : 'development',
  output: {
    path: resolve('dist'),
    publicPath: '/',
    filename: '[name].[hash].js'
  },
  resolve: {
    alias: {
      'public': resolve('public'),
      '@': resolve('src')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
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
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
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
  ]
}
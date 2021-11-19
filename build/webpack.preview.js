const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { rules } = require('./webpack.common')
const { srcPath, distPath, publicPath, previewPath } = require('./paths')

module.exports = {
  mode: 'production',
  entry: path.join(srcPath, 'example/example.js'),
  output: {
    path: previewPath,
    // chunk hash, 不同chunk会生成不同的hash
    filename: '[name]_[hash:8].js'
  },
  module: {
    rules
  },
  plugins: [
    new CleanWebpackPlugin(),
    // css代码压缩
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'preview/example.html'),
      filename: 'example.html',
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    })
  ],
  devtool: 'source-map'
}

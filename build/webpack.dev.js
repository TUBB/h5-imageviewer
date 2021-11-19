const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { rules } = require('./webpack.common')
const { srcPath, distPath, publicPath } = require('./paths')

module.exports = {
  mode: 'development',
  entry: {
    example: path.join(srcPath, 'example/example.js')
  },
  output: {
    path: distPath,
    filename: '[name].js'
  },
  module: {
    rules
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'example/example.html'),
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
    }),
    new OpenBrowserPlugin(
      {
        url: 'http://localhost:8080/example.html'
      }
    ),
    new CopyPlugin([
      {
        from: publicPath,
        to: distPath
      }
    ])
  ],
  devServer: {
    port: 8080,
    contentBase: distPath,
    hot: true
  },
  devtool: 'eval-source-map'
}

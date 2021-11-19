const path = require('path')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CDNInjectPlugin = require('./CDNInjectPlugin')
const { rules } = require('./webpack.common')
const { srcPath, publicPath } = require('./paths')
const { name, version } = require('../package.json')
const pathDir = 'umd'
const filename = 'h5-imageviewer.js'
const cdnUrl = `https://unpkg.com/${name}@${version}/${pathDir}/${filename}`

module.exports = {
  mode: 'production',
  entry: path.join(srcPath, 'index.js'),
  output: {
    path: path.resolve(__dirname, '..', pathDir),
    filename: filename,
    libraryExport: 'default',
    libraryTarget: 'umd',
    library: 'H5ImageViewer'
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
      template: path.join(srcPath, 'example/cdn-test.html'),
      filename: path.join(publicPath, 'cdn-test.html'),
      inject: false,
    }),
    new CDNInjectPlugin({ 
      options: {
        cdnUrl: cdnUrl
      } 
    })
  ],
  devtool: 'source-map'
}

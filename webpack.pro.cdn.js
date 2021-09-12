const path = require('path')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CDNInjectPlugin = require('./webpack.cdn.plugin')
const { rules } = require('./webpack.common')
const { name, version } = require('./package.json')
const pathDir = 'umd'
const filename = 'h5-imageviewer.js'
const cdnUrl = `https://unpkg.com/${name}@${version}/${pathDir}/${filename}`

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, pathDir),
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
      template: path.join(__dirname, 'src/example/cdn-test.html'),
      filename: path.join(__dirname, 'public/cdn-test.html'),
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

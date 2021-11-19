const path = require('path')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const { rules } = require('./webpack.common')
const { srcPath, distPath } = require('./paths')

module.exports = {
  mode: 'production',
  entry: path.join(srcPath, 'index.js'),
  output: {
    path: distPath,
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    // css代码压缩
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    })
  ],
  devtool: 'source-map'
}

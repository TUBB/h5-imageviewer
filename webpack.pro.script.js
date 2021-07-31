const path = require('path')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const { version } = require('./package.json')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'umd'),
    filename: "pobi-imageviewer.js",
    libraryExport: "default",
    libraryTarget: "umd",
    library: "PobiImageViewer"
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
          {
            // css3前缀自动补全
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({})
              ]
            }
          }
        ]
      },
      {
        test: /.(jpg|png|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10240,
              // 文件内容hash
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
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

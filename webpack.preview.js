const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/example/example.js',
  output: {
    path: path.resolve(__dirname, 'preview'),
    // chunk hash, 不同chunk会生成不同的hash
    filename: '[name]_[hash:8].js'
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
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/preview/example.html'),
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
  ]
}

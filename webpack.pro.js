const path = require('path')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  // 多页面入口配置
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // chunk hash, 不同chunk会生成不同的hash
    filename: 'bundle.js',
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
                    require('autoprefixer')({
                      browsers: [
                        "defaults",
                        "Chrome >= 49",
                        "Firefox >= 48",
                        "Safari >= 9",
                        "Edge >= 12",
                        "IE >= 9",
                        "Opera 47-48",
                        "ChromeAndroid >= 38",
                        "ios_saf >= 9",
                        "Android >= 3",
                        "not dead"
                      ]                    
                    })
                ]
            }
          },
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
              name: "[name]_[hash:8].[ext]"
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
  ]
}
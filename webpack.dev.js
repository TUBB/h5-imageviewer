const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const  OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    example: './src/example/example.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
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
            loader: 'url-loader',
            options: {
              limit: 10240
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/example/example.html'),
      filename: 'example.html',
      chunks: ['example'],
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
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'dist')
      }
    ])
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
}
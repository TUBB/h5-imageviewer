const rules = [
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
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: '[name]_[hash:8].[ext]'
        }
      }
    ]
  }
]

module.exports = { rules }

var HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  devServer: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  output: {
    libraryTarget: "system"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: false,
    }),
    new CleanWebpackPlugin()
  ],
  externals: [
    /^canopy-styleguide$/,
    /^react$/,
    /^react\/lib.*/,
    /^react-dom$/,
    /.*react-dom.*/,
  ]
}
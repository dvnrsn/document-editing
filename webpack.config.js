var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
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
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    template: './src/index.html',
    inject: false,
  })],
  externals: [
    /^canopy-styleguide$/,
    /^ react$ /,
    /^react-dom$/,
  ]
}
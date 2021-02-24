const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: {
    index: './index.js'
  },
  output: {
    path: __dirname + '/pkg/test.webpack.js/',
  },
  plugins: [new HtmlWebpackPlugin()]
};

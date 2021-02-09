const relativePath = '/pkg/test.webpack.js/';

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
      enforceSizeThreshold: 0
    }
  },
  entry: {
    index: {
      import: './index.js',
      library: { type: 'amd' }
    }
  },
  output: {
    path: __dirname + relativePath,
    publicPath: relativePath,
  }
};

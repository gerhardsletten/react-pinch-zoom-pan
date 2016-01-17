var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
    './demo/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/scripts/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js$/, 
        loader: 'react-hot',
        include: path.join(__dirname, '..'),
        exclude: /node_modules/ 
      },
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015','react']
        },
        include: path.join(__dirname, '..'),
        exclude: /node_modules/ 
      }
    ]
  }
};

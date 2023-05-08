const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const DEBUG = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './app/app.js',
  output: {
    path: path.join(__dirname, pkg.config.build),
    filename: '[name].[hash].js'
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },
      {
        test: /\.(jpe?g|png|gif|svg|tga|gltf|babylon|mtl|pcb|pcd|prwm|obj|mat|mp3|ogg)$/i,
        use: 'file-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },
      {
        test: /\.(vert|frag|glsl|shader|txt)$/i,
        use: 'raw-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },
      {
        type: 'javascript/auto',
        test: /\.(json)/,
        exclude: path.resolve(__dirname, './node_modules/'),
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ title: pkg.config.title })],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 8080
  }
};

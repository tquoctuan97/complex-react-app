const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: './app/Main.js',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'app'),
    filename: 'bundled.js'
  },
  plugins: [new Dotenv()],
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, 'app'),
    hot: true,
    historyApiFallback: { index: 'index.html' }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', ['@babel/preset-env', { targets: { node: '12' } }]]
          }
        }
      }
    ]
  }
}

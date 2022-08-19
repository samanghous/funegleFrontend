const Dotenv = require('dotenv-webpack');

module.exports = {
  devServer: {
    port: 8080,
    host: 'localhost',
  },
  publicPath: "/",
  configureWebpack: {
    plugins: [
      new Dotenv()
    ]
  }
}
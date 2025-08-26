const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/main.js', // gunakan main.js sebagai entry point
  output: {
    filename: 'main.js',
    path: __dirname + '/dist',
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
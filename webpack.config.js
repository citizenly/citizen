var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: __dirname +'/src/js/app.js',
  output: {
    filename: __dirname + '/public/js/app-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "postcss", "sass"],
      }
    ]
  },
  postcss: function() {
    return [
      precss,
      autoprefixer
    ];
  },
   resolve: {
        root: __dirname,
        alias: {
            RepAPI: 'src/js/helper-function/index.js'
        },
        extensions:['', '.js', '.jsx']
   },
  devtool: 'sourcemap'
};
const path = require('path');

module.exports = {
  entry: './project/src/index.js', // Adjust if your entry point is different
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // Add other loaders for different file types as needed
    ],
  },
};

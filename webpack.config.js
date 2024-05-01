const path = require('path');

module.exports = {
  entry: './project/src/index.js',  // Entry point of your application
  output: {
    filename: 'bundle.js',          // Output bundle file name
    path: path.resolve(__dirname, 'dist'),  // Output path
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']  // Loaders for processing CSS files
      },
      {
        test: /\.js$/,                      // Rule for JavaScript files
        exclude: /node_modules/,            // Exclude the node_modules directory
        use: {
          loader: 'babel-loader',           // Use babel-loader for JavaScript files
          options: {
            presets: ['@babel/preset-env'], // Use @babel/preset-env for compiling JS
          }
        }
      },
      // Add other loaders for different file types as needed
    ]
  }
};

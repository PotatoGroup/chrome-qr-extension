const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup.tsx',
    sidepanel: './src/sidepanel.tsx',
    background: './src/background.ts'
  },
  output: {
    path: path.resolve(__dirname, 'chrome-qr-extension'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/popup.html', '**/sidepanel.html'],
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: 'public/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: 'public/sidepanel.html',
      filename: 'sidepanel.html',
      chunks: ['sidepanel'],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
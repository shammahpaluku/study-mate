const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  devtool: isProduction ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: /src/,
        exclude: [/pages\/LoginPage/, /pages\/RegisterPage/, /pages\/VerifyEmailPage/, /pages\/ForgotPasswordPage/, /pages\/ResetPasswordPage/],
        use: [{ loader: 'ts-loader' }]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? 'renderer.[contenthash].js' : 'renderer.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
    }),
  ],
};

if (!isProduction) {
  config.devServer = {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
  };
}

module.exports = config;

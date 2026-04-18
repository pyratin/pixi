import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const pathGet = (index = 0) =>
  path.join(process.cwd(), ['source', 'target'][index], 'browser');

const exclude = [/node_modules/];

/** @type {webpack.Configuration & webpackDevServer.Configuration} */
export default {
  entry: pathGet(0),
  output: { path: pathGet(1), filename: '[name].js', publicPath: '/' },
  plugins: [
    new HtmlWebpackPlugin({ template: path.join(pathGet(0), 'index.html') }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(pathGet(0), 'asset'),
          to: path.join(pathGet(1), 'asset'),
          noErrorOnMissing: true
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude,
        resolve: { fullySpecified: false },
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        exclude,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { modules: true }
          },
          'sass-loader'
        ]
      }
    ]
  },
  devServer: { hot: true, liveReload: true, historyApiFallback: true },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: { test: exclude[0], name: 'vendor', enforce: true }
      }
    }
  },
  resolve: {
    alias: {
      'react-reconciler/constants': 'react-reconciler/constants.js'
    }
  }
};

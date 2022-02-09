import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import NodePolyfillPlugin  from 'node-polyfill-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

const dirnamePath = dirname(fileURLToPath(import.meta.url));

type Configuration = WebpackConfiguration & WebpackDevServerConfiguration;

const config: Configuration = {
  target: ['browserslist','web'],
  experiments: {
    outputModule: true,
  },
  entry: ['react-hot-loader/patch', './src/index.tsx'],
  output: {
    path: resolve(dirnamePath, 'build'),
    chunkFormat: 'module',
    module: true,
    filename: '[name].js',
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(m?js|m?ts|m?tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(m?ts|m?tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.svg$/i,
        issuer: /\.tsx?$/,
        use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: './build',
    },
    historyApiFallback: true,
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(dirnamePath, 'public/index.html'),
      filename: 'index.html',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    fallback: {
      fs: 'browserify-fs/index.js',
      modules: [resolve(dirnamePath, 'src'), resolve(dirnamePath, 'node_modules')],
    },
    extensions: ['.ts', '.mts', '.cts', '.tsx', '.mtsx', '.js', '.jsx', '.cjs', '.mjs', '.wasm', '.css'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '@': resolve(dirnamePath, 'src'),
    },
  },
};

export default config;

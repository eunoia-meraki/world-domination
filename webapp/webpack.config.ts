import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const dirnamePath = dirname(fileURLToPath(import.meta.url));

const config = {
  entry: [
    'react-hot-loader/patch',
    './src/index.tsx'
  ],
  output: {
    path: resolve(dirnamePath, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(m?js|m?ts|m?tsx)$/,
        include: resolve(dirnamePath),
        resolve: {
          fullySpecified: false,
        },
        use: 'babel-loader',
      },
      {
        test: /\.(m?ts|m?tsx)$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
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
              mimetype: 'image/png'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    'static': {
      directory: './build'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(dirnamePath, 'public/index.html'),
      filename: 'index.html',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin()
  ],
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.mts',
      '.js',
      '.css',
    ],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  }
};

export default config;
